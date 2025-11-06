import { cookies } from "next/headers";

import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Lucia, Session, User } from "lucia";
import { MongoClient } from "mongodb";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

// Lucia를 위한 전용 클라이언트 (어댑터용)
let adapterClient: MongoClient | null = null;
let db: ReturnType<MongoClient["db"]> | null = null;
let adapter: MongodbAdapter | null = null;
let luciaInstance: Lucia<MongodbAdapter> | null = null;

// MongoDB 연결 및 어댑터 초기화 함수
async function initializeAdapter() {
  if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ adapter: null, lucia: null }), 1000);
    });
  } else {
    if (adapterClient && adapter && luciaInstance) {
      return { adapter, lucia: luciaInstance };
    }

    try {
      adapterClient = new MongoClient(url, {
        serverSelectionTimeoutMS: 5000, // 5초 타임아웃
        connectTimeoutMS: 10000, // 연결 타임아웃 10초
      });

      await adapterClient.connect();

      db = adapterClient.db("hamstory");

      adapter = new MongodbAdapter(
        db.collection("sessions"),
        db.collection("users"),
      );

      luciaInstance = new Lucia(adapter, {
        sessionCookie: {
          name: "auth_session",
          expires: false,
          attributes: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          },
        },
      });

      return { adapter, lucia: luciaInstance };
    } catch (error) {
      console.error("MongoDB connection failed in auth.ts:", error);
      throw new Error(
        "데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.",
      );
    }
  }
}

// Lucia 인스턴스 가져오기 (lazy initialization)
async function getLucia() {
  if (!luciaInstance) {
    await initializeAdapter();
  }
  return luciaInstance!;
}

// Lucia 인스턴스를 lazy하게 export
export const lucia = {
  async createSession(userId: string, attributes: {}) {
    const lucia = await getLucia();
    return lucia.createSession(userId, attributes);
  },
  async validateSession(sessionId: string) {
    const lucia = await getLucia();
    return lucia.validateSession(sessionId);
  },
  async invalidateSession(sessionId: string) {
    const lucia = await getLucia();
    return lucia.invalidateSession(sessionId);
  },
  createSessionCookie(sessionId: string) {
    if (!luciaInstance) {
      throw new Error(
        "Lucia instance not initialized. Database connection required.",
      );
    }
    return luciaInstance.createSessionCookie(sessionId);
  },
  createBlankSessionCookie() {
    if (!luciaInstance) {
      throw new Error(
        "Lucia instance not initialized. Database connection required.",
      );
    }
    return luciaInstance.createBlankSessionCookie();
  },
  get sessionCookieName() {
    // 이 경우는 초기화 전에 호출될 수 있으므로 기본값 반환
    return "auth_session";
  },
};

/* 세션 생성 함수 */
export async function createAuthSession(userId: string) {
  if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
    return new Promise((resolve) => {
      setTimeout(() => resolve(null), 1000);
    });
  } else {
    const session = await lucia.createSession(userId, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }
}

/* 세션 검증 함수 
  1. 설정된 세션 쿠키가 없으면 세션 검증 실패
  2. 세션 쿠키가 있으면 세션 검증 시도
  3. 세션 검증 성공 시 세션 쿠키 기간 연장
  4. 세션 검증 실패 시 세션 쿠키 삭제
*/
export async function verifyAuth(): Promise<{
  success: boolean;
  message: string;
  data: {
    user: User;
    session: Session;
  } | null;
}> {
  if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            success: true,
            message: "세션 검증 성공",
            data: {
              user: { id: "user1" },
              session: {
                id: "session1",
                expiresAt: new Date(),
                fresh: true,
                userId: "user1",
              },
            },
          }),
        // resolve({
        //   success: false,
        //   message: "세션 검증 실패",
        //   data: null,
        // }),
        1000,
      );
    });
  } else {
    try {
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
      }

      // 여기 도달했다면 result.session과 result.user가 모두 존재함이 보장됨
      if (!result.session || !result.user) {
        return {
          success: false,
          message: "세션 검증 실패",
          data: null,
        };
      }

      return {
        success: true,
        message: "세션 검증 성공",
        data: {
          user: result.user,
          session: result.session,
        },
      };
    } catch (error) {
      console.error("Authentication error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "인증 처리 중 오류가 발생했습니다.",
        data: null,
      };
    }
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
      message: "세션 검증 실패",
      data: null,
    };
  }

  if (process.env.NEXT_PUBLIC_IS_MOCK === "true") {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            success: true,
            message: "세션 삭제 성공",
            data: null,
          }),
        1000,
      );
    });
  } else {
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
}
