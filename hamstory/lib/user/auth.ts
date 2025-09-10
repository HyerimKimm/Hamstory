import { cookies } from "next/headers";

import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { verify } from "crypto";
import { Lucia, Session, User } from "lucia";
import { MongoClient } from "mongodb";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

// Lucia를 위한 전용 클라이언트 (어댑터용)
const adapterClient = new MongoClient(url);
await adapterClient.connect();

const db = adapterClient.db("hamstory");

/*
1번째 인수: 세션 컬렉션
2번째 인수: 유저 컬렉션
*/
const adapter = new MongodbAdapter(
  db.collection("sessions"),
  db.collection("users"),
);

/* Lucia 인스턴스 생성 */
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "auth_session", // 명시적으로 쿠키 이름 설정
    expires: false, //  // next.js에서 lucia를 사용할 때는 false로 설정해야 함
    attributes: {
      secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서는 https에서만 작동하도록 설정
      sameSite: "lax", // CSRF 공격 방지
    },
  },
});

/* 세션 생성 함수 */
export async function createAuthSession(userId: string) {
  const session = await lucia.createSession(userId, {});

  const sessionCookie = lucia.createSessionCookie(session.id);

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

/* 세션 검증 함수 */
export async function verifyAuth(): Promise<{
  success: boolean;
  message: string;
  data:
    | {
        user: User;
        session: Session;
      }
    | {
        user: null;
        session: null;
      }
    | null;
}> {
  const sessionCookie = (await cookies()).get(lucia.sessionCookieName);

  if (!sessionCookie) {
    return {
      success: false,
      message: "세션이 존재하지 않습니다.",
      data: null,
    };
  }

  const sessionId = sessionCookie.value;

  if (!sessionId) {
    return {
      success: false,
      message: "세션 아이디가 존재하지 않습니다.",
      data: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    /* 활성화 되고 유효한 세션을 찾은 경우 */
    if (result.session && result.session.fresh) {
      /* 세션 쿠키 기간 연장 */
      const sessionCookie = lucia.createSessionCookie(result.session.id);

      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }

    /* 세션을 찾지 못한 경우 -> 전송된 세션 쿠키를 삭제 */
    if (!result.session || !result.user) {
      const sessionCookie = lucia.createBlankSessionCookie();

      /* 빈 세션 쿠키를 생성하고 쿠키 저장소에 저장 */
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return {
        success: false,
        message: "세션 검증 실패",
        data: null,
      };
    }
  } catch {
    /* next.js에서는 페이지 렌더링 과정의 일부에서 쿠키를 설정할 수 없음 */
    /* 따라서 예외 처리 */
    /* 예외 처리 시 쿠키 설정 시도를 무시하고 계속 진행 */
  } finally {
    return {
      success: true,
      message: "세션 검증 성공",
      data: result,
    };
  }
}

/* 세션 삭제 함수 */
export async function destroyAuthSession(): Promise<{
  success: boolean;
  message: string;
  data: null;
}> {
  const result = await verifyAuth();

  if (!result.success || !result.data || !result.data.session) {
    return {
      success: false,
      message: "세션 삭제 실패",
      data: null,
    };
  }

  await lucia.invalidateSession(result.data.session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return {
    success: true,
    message: "세션 삭제 성공",
    data: null,
  };
}
