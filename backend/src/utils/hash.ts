import crypto from "crypto";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { hash, salt };
}

export function comparePassword(
  candidatePassword: string,
  hash: string,
  salt: string
) {
  const hashVerify = crypto
    .pbkdf2Sync(candidatePassword, salt, 10000, 64, "sha512")
    .toString("hex");

  return hash === hashVerify;
}
