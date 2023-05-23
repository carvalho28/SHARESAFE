import forge from "node-forge";
import { getCookie } from "../auth/Cookies";

type fileInformation = {
  file_name: string;
  file_type: string;
  file_size: number;
  encrypted_file: string;
  iv: string;
  algorithm: string;
  user_id: number;
  group_id: number;
};

type userInformation = {
  id: number;
  encrypted_key: string;
};

async function sendFile(file: File, groupId: number) {
  const user_id = getCookie("user_id");
  const fileBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileBuffer);
  console.log("fileBytes", fileBytes);

  let publicKey: forge.pki.rsa.PublicKey;
  let encryptedSymetricKey: string;

  let file_info: fileInformation;
  let users_group: userInformation[] = [];

  // 16 bytes = 128 bits
  // 32 bytes = 256 bits
  // 64 bytes = 512 bits
  const symetricKey = forge.random.getBytesSync(32);
  console.log("symetricKey", symetricKey);
  const iv = forge.random.getBytesSync(16);
  console.log("iv", iv);

  // AES - CBC or AES - GCM
  const cipher = forge.cipher.createCipher("AES-CBC", symetricKey);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(fileBytes));
  cipher.finish();

  // const encryptedFile = cipher.output.getBytes();
  // const encryptedFile = cipher.output.toHex();
  const encryptedFile = cipher.output.toHex();
  const base64EncryptedFile = forge.util.encode64(encryptedFile);

  file_info = {
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    // convert encrypted file to BASE64
    // encrypted_file: forge.util.encode64(encryptedFile),
    encrypted_file: base64EncryptedFile,
    iv: forge.util.encode64(iv).toString(),
    algorithm: "AES-CBC",
    user_id: Number(user_id),
    group_id: Number(groupId),
  };

  const bodyGetUsers = {
    group_id: 1,
  };
  await fetch("http://localhost:3000/api/groups/getUsers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(bodyGetUsers),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("recebido", data);

      // Encrypt symetric key with user public key
      data.members.forEach((user: { public_key: string; id: number }) => {
        publicKey = forge.pki.publicKeyFromPem(user.public_key);

        encryptedSymetricKey = publicKey.encrypt(symetricKey);

        users_group.push({
          id: user.id,
          encrypted_key: forge.util.encode64(encryptedSymetricKey),
        });
      });
    })
    .catch((err: any) => {
      console.log("Error: ", err);
      return err;
    });

  const body = {
    file_info,
    users_group,
  };

  console.log("envio de ficheiro: ", body);

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
