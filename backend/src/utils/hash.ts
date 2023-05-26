import crypto from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { hash, salt };
}

export function comparePassword({
  candidatePassword,
  hash,
  salt,
}: {
  candidatePassword: string;
  hash: string;
  salt: string;
}) {
  const hashVerify = crypto
    .pbkdf2Sync(candidatePassword, salt, 10000, 64, "sha512")
    .toString("hex");

  return hash === hashVerify;
}

// export async function validateToken(
//   request: FastifyRequest,
//   reply: FastifyReply,
//   next: Function
// ) {
//   try {
//     const auth = request.headers.authorization;
//     if (!auth) {
//       return reply.status(401).send({ message: "No token provided" });
//     }
//     const token = auth.split(" ")[1];
//     const decoded = await request.jwtVerify();
//     request.user = decoded;
//     return next();
//   } catch (err) {
//     return reply.status(401).send({ message: "Unauthorized" });
//   }
// }
