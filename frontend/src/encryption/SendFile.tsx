import forge from "node-forge";

type fileInformation = {
  file_name: string;
  file_type: string;
  file_size: number;
  encrypted_file: string;
  iv: string;
  algorithm: string;
  user_id: number;
};

async function sendFile(file: File) {
  const fileBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileBuffer);

  let publicKey: forge.pki.rsa.PublicKey;
  let encryptedSymetricKey: string;

  let file_info: fileInformation;
  let users_group: string[] = [];

  const symetricKey = forge.random.getBytesSync(16);
  const iv = forge.random.getBytesSync(16);

  // AES - CBC or AES - GCM
  const cipher = forge.cipher.createCipher('AES-CBC', symetricKey);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(fileBytes));
  cipher.finish();

  // get the encrypted bytes which is the file encrypted with the symetric key
  const encryptedFile = cipher.output.getBytes();

  file_info = {
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    encrypted_file: encryptedFile,
    iv: iv,
    algorithm: "AES-CBC",
    user_id: 1,
  };

  await fetch("http://localhost:3000/api/users/", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      // Encrypt symetric key with user public key
      data.forEach((user: { public_key: string; id: number; }) => {

        publicKey = forge.pki.publicKeyFromPem(user.public_key);

        encryptedSymetricKey = publicKey.encrypt(symetricKey);

        users_group.push(encryptedSymetricKey);
      });

    })
    .catch((err: any) => {
      console.log("Error: ", err.message);
    });

  const body = {
    file_info,
    users_group,
  };


  console.log(body);


  await fetch("http://localhost:3000/api/files/upload", {
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
                file_info: {
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
