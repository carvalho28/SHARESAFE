import { findUsers } from "./user.service";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export async function getUsersHandler() {
  const users = await findUsers();
  return users;
}

export async function registerUserHandler() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: process.env.PRIVATE_KEY_PASSPHRASE,
    },
  });

  return { publicKey: publicKey, privateKey: privateKey };
}
