import forge from "node-forge";
import { getCookie } from "../auth/Cookies";

type fileInformation = {
  file_name: string;
  file_type: string;
  file_size: number;
  encrypted_file: string;
  iv: string;
  algorithm: string;
  signature: string;
  signature_algorithm: string;
  mac: string;
  mac_algorithm: string;
  user_id: number;
  group_id: number;
};

type userInformation = {
  id: number;
  encrypted_key: string;
};

async function sendFile(
  file: File,
  groupId: number,
  digitalSignature: File | undefined,
  encryption_algorithm: string,
  signature_algorithm: string,
  mac_algorithm: string,
) {
  const user_id = getCookie("user_id");
  const fileBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileBuffer);

  let publicKey: forge.pki.rsa.PublicKey;
  let encryptedSymetricKey: string;

  let file_info: fileInformation;
  let users_group: userInformation[] = [];

  // 16 bytes = 128 bits
  // 32 bytes = 256 bits
  // 64 bytes = 512 bits
  const symetricKey = forge.random.getBytesSync(32);
  const iv = forge.random.getBytesSync(16);

  // AES - CBC or AES - GCM
  const cipher = forge.cipher.createCipher("AES-CBC", symetricKey);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(fileBytes));
  cipher.finish();

  const encryptedFile = cipher.output.toHex();
  // convert encrypted file to BASE64
  const base64EncryptedFile = forge.util.encode64(encryptedFile);

  let signature: string | undefined;
  // get the private key from the file
  if (digitalSignature) {
    const privateKeyFileBuffer = await digitalSignature?.arrayBuffer();
    const privateKeyString = new TextDecoder().decode(privateKeyFileBuffer);
    const privateKey = forge.pki.privateKeyFromPem(privateKeyString);
    // sign the encrypted file
    const md = forge.md.sha256.create();
    md.update(base64EncryptedFile);
    signature = privateKey.sign(md);
  }

  // message authentication code
  const hmac = forge.hmac.create();
  hmac.start("sha256", symetricKey);
  hmac.update(base64EncryptedFile);
  const hmacHex = hmac.digest().toHex();

  file_info = {
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    encrypted_file: base64EncryptedFile,
    iv: forge.util.encode64(iv).toString(),
    algorithm: "AES-CBC",
    // if signature is empty, the file is not signed
    signature: signature ? forge.util.encode64(signature).toString() : "",
    signature_algorithm: "SHA256",
    mac: forge.util.encode64(hmacHex).toString(),
    mac_algorithm: "SHA256",
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

  // console.log("envio de ficheiro: ", body);

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
