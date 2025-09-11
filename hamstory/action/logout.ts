"use server";

import { redirect } from "next/navigation";

import { destroyAuthSession } from "../lib/user/auth";

export default async function logout() {
  const result = await destroyAuthSession();

  if (result.success) {
    redirect("/");
  } else {
    console.error(result);
  }
}
