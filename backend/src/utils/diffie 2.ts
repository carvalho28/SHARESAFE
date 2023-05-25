import crypto from "crypto";

export function diffieH(nUsers: number) {
  var user, aux_user;
  var key;

  //   users.push(crypto.createDiffieHellman(2048));
  aux_user = crypto.createDiffieHellman(2048);
  const prime = aux_user.getPrime();
  const generator = aux_user.getGenerator();
  key = aux_user.generateKeys();

  if (nUsers === 1) {
    return key;
  }

  console.log(key);

  user = crypto.createDiffieHellman(prime, generator);
  user.setPrivateKey(user.generateKeys());
  user = user.computeSecret(key);

  if (nUsers == 2) {
    return user;
  }

  for (let i = 0; i < nUsers - 2; i++) {
    aux_user = crypto.createDiffieHellman(prime, generator);
    aux_user.setPrivateKey(aux_user.generateKeys());
    user = aux_user.computeSecret(user);
  }

  return user.toString("hex");
}
