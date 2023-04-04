import forge from "node-forge";
import { useState } from "react";

async function sendFile( file: File ) {
  const fileBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileBuffer);

  let publicKey;
  let encryptedSymetricKey;

  let body_users : any[] = [];

  const symetricKey = forge.random.getBytesSync(16);
  const iv = forge.random.getBytesSync(16);

  const cipher = forge.cipher.createCipher('AES-CBC', symetricKey);
  cipher.start({iv: iv});
  cipher.update(forge.util.createBuffer(fileBytes));
  cipher.finish();

  const encryptedFile = cipher.output.toHex();

  await fetch("http://localhost:3000/api/users/", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        // Encrypt symetric key with user public key
        data.forEach(user => {

            publicKey = forge.pki.publicKeyFromPem( user.public_key );
            
            encryptedSymetricKey = publicKey.encrypt(symetricKey);
            
            body_users.push({
                user_id: user.id,
                file_key: encryptedSymetricKey,
                iv: iv
            });
        });
        
      })
      .catch((err) => {
        console.log(err.message);
      });

      const body = {
        encryptedFile,
        body_users
      };

      console.log(JSON.stringify(body));
      console.log(body);
      

      await fetch("http://localhost:3000/api/file/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(body),
       })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });

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
