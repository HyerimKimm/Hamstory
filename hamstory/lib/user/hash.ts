import crypto from "node:crypto";

export function hashUserPassword(password: string) {
  /* 16바이트의 랜덤 솔트 생성, 16진수 문자열로 반환 */
  const salt = crypto.randomBytes(16).toString("hex");

  /* 비밀번호와 솔트를 사용하여 해시 생성 */
  const hashUserPassword = crypto.scryptSync(password, salt, 64);

  /* 해시와 솔트를 조합하여 반환 */
  return hashUserPassword.toString("hex") + ":" + salt;
}

export function verifyPassword(
  storedPassword: string,
  suppliedPassword: string,
) {
  /* 저장된 비밀번호와 솔트를 분리 */
  const [hashedPassword, salt] = storedPassword.split(":");

  /* 저장된 비밀번호를 버퍼로 변환 */
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");

  /* 입력된 비밀번호와 솔트를 사용하여 해시 생성 */
  const suppliedPasswordBuf = crypto.scryptSync(suppliedPassword, salt, 64);

  /* 저장된 비밀번호와 입력된 비밀번호를 비교 */
  return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}
