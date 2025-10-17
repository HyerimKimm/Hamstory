"use server";

import { destroyAuthSession } from "../../lib/user/auth";

export default async function logout() {
  const result = await destroyAuthSession();

  if (result.success) {
    return {
      success: true,
      message: "로그아웃에 성공했습니다.",
      data: null,
    };
  } else {
    return {
      success: false,
      message: "로그아웃에 실패했습니다.",
      data: null,
    };
  }
}
