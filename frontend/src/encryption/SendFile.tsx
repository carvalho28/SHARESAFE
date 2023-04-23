import forge from "node-forge";

type fileInformation = {
  file_name: string;
  file_type: string;
  file_size: number;
  encrypted_file: string;
  iv: string;
  user_id: number;
};

async function sendFile(file: File) {
  const fileBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileBuffer);

  let publicKey;
  let encryptedSymetricKey;

  let fileInfo: fileInformation;
  let body_users: any[] = [];

  const symetricKey = forge.random.getBytesSync(16);
  const iv = forge.random.getBytesSync(16);

  const cipher = forge.cipher.createCipher('AES-CBC', symetricKey);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(fileBytes));
  cipher.finish();

  // const encryptedFile = cipher.output.toHex();

  // get the encrypted bytes which is the file encrypted with the symetric key
  const encryptedFile = cipher.output.getBytes();

  fileInfo = {
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    encrypted_file: encryptedFile,
    iv: iv,
    user_id: 1,
  };

  // await fetch("http://localhost:3000/api/users/", {
  //     method: "GET",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //
  //       // Encrypt symetric key with user public key
  //       data.forEach((user: { public_key: string; id: any; }) => {
  //
  //           publicKey = forge.pki.publicKeyFromPem( user.public_key );
  //           
  //           encryptedSymetricKey = publicKey.encrypt(symetricKey);
  //           
  //           body_users.push({
  //               user_id: user.id,
  //               file_key: encryptedSymetricKey
  //           });
  //       });
  //       
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  //
  //     const body = {
  //       file_info: fileInfo,
  //       users_info: body_users
  //     };
  //
  //     console.log(JSON.stringify(body));
  //     console.log(body);

  console.log(fileInfo);

  await fetch("http://localhost:3000/api/files/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(fileInfo),
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
                fileInfo: {
                    name: xxx,
                    type: xxx,
                    size: xxx,
                    encryptedFile: xxx,
                    iv: xxx
                },
                users_data: [
                    {
                        userId: xxx,
                        file_key: xxx
                    },
                    ...
                ]
            }
*/
