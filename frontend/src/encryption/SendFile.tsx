import forge from "node-forge";
import { useState } from "react";

async function sendFile(prop: { file: File }) {
  const message = "Ola isto é um teste";

  let publicKey;
  let encryptedSymetricKey;

  let body_users = [];

  const symetricKey = forge.random.getBytesSync(16);
  const iv = forge.random.getBytesSync(16);

  const cipher = forge.cipher.createCipher('AES-CBC', symetricKey);
  cipher.start({iv: iv});
  cipher.update(forge.util.createBuffer(message));
  cipher.finish();

  const encryptedFile = cipher.output;

  await fetch("http://localhost:3000/api/users/", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        // Encrypt symetric key with user public key
        data.forEach(user => {
            console.log(user.name);

            publicKey = forge.pki.publicKeyFromPem( user.public_key );
            
            encryptedSymetricKey = publicKey.encrypt(symetricKey);
            
            body_users.push({
                name: user.name,
                key: encryptedSymetricKey
            });
        });
        
      })
      .catch((err) => {
        console.log(err.message);
      });

      console.log(body_users);
}

export default sendFile;

/*  (Logic)

    => Send File <=
        - request group public keys:
            body: {
                group_keys: [
                    {
                        userId: xxx,
                        publicKey: xxx
                    },
                    ...
                ]
            }
        - generate symetric key
        - encrypt file with symetric key
        - encrypt symetric key with each user public key
        - send encrypted file and symetric keys
            body: {
                file: xxx,
                signature: xxx,
                keys: [
                    {
                        userId: xxx,
                        file_key: xxx
                    },
                    ...
                ]
            }
*/
