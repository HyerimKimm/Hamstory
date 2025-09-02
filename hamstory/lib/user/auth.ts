import { cookies } from "next/headers";

import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Lucia } from "lucia";
import { MongoClient } from "mongodb";

const url = process.env.NEXT_PUBLIC_MONGODB_URI as string;

const client = new MongoClient(url);
await client.connect();

const db = client.db("hamstory");

/*
1번째 인수: 세션 컬렉션
2번째 인수: 유저 컬렉션
*/
const adapter = new MongodbAdapter(
  db.collection("sessions"),
  db.collection("users"),
);

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

export async function createAuthSession(userId: string) {
  const session = await lucia.createSession(userId, {});

  const sessionCookie = lucia.createSessionCookie(session.id);

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
