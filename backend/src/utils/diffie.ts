import crypto from "crypto";

// export function diffieH(nUsers: number) {
//   var user, aux_user;
//   var key;

//   var users = [];

//   // aux_user = crypto.createDiffieHellman(2048);

//   users.push(crypto.createDiffieHellman(2048));
//   const prime = users[0].getPrime();
//   const generator = users[0].getGenerator();
//   key = users[0].generateKeys();

//   if (nUsers === 1) {
//     return key;
//   }

//   user = crypto.createDiffieHellman(prime, generator);
//   users[0].setPrivateKey(user[0].generateKeys());
//   users.push(user.computeSecret(key));
//   users[1].setPrivateKey(user[1].generateKeys());

//   if (nUsers == 2) {
//     return user;
//   }

//   for (let i = 0; i < nUsers - 2; i++) {
//     aux_user = crypto.createDiffieHellman(prime, generator);
//     aux_user.setPrivateKey(aux_user.generateKeys());
//     user.push(aux_user.computeSecret(users[i + 1]));
//   }

//   //   return user;
//   // return the sha256 of the shared secret
//   const sharedSecret = crypto.createHash("sha256").update(user).digest();
//   return sharedSecret.toString("hex");
// }

export function diffieH2(nUsers: number) {
  let user = crypto.createDiffieHellman(2048);
  const prime = user.getPrime();
  const generator = user.getGenerator();
  const participants = [];
  let sharedSecret = null;

  // Generate participants
  for (let i = 0; i < nUsers; i++) {
    const participant = crypto.createDiffieHellman(prime, generator);
    const keys = participant.generateKeys();

    participants.push({
      participant,
      keys,
    });
  }

  // Compute shared secret
  for (let i = 0; i < nUsers; i++) {
    const currentParticipant = participants[i];
    const otherSharedSecret = currentParticipant.participant.computeSecret(
      participants[(i + 1) % nUsers].keys
    );

    if (sharedSecret === null) {
      sharedSecret = otherSharedSecret;
    } else if (!sharedSecret.equals(otherSharedSecret)) {
      throw new Error("Shared secrets are not equal!");
    }
  }

  // Hash shared secret
  const hashedSharedSecret = sharedSecret
    ? crypto.createHash("sha256").update(sharedSecret).digest("hex")
    : null;

  return hashedSharedSecret;
}
