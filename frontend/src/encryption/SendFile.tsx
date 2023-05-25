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

export type typesEnc = "random" | "userKey" | "diffie";

async function sendFile(
  encryptionType: typesEnc,
  own_key: string,
  private_key: string,
  diffieKey: string,
  file: File,
  groupId: number,
  digitalSignature: File | undefined,
  encryption_algorithm: forge.cipher.Algorithm,
  signature_algorithm: string,
  mac_algorithm: forge.md.Algorithm,
) {
  let symetricKey: string = "";
  if (encryptionType === "random") {
    console.log("random");
    if (encryption_algorithm === "3DES-CBC" || encryption_algorithm === "3DES-ECB") {
      symetricKey = forge.random.getBytesSync(24)
    } else {
      symetricKey = forge.random.getBytesSync(32);
    }
  } else if (encryptionType === "userKey") {
    console.log("userKey");
    // create symetric key from own key
    symetricKey = forge.pkcs5.pbkdf2(
      own_key,
      forge.random.getBytesSync(32),
      10000,
      32,
    );
  } else if (encryptionType === "diffie") {
    console.log("diffie");
    if (private_key) {
      // decrypt the private key
      const privateKey = forge.pki.privateKeyFromPem(String(private_key));
      console.log("privateKey", privateKey);
      const decryptedX = privateKey.decrypt(
        forge.util.decode64(diffieKey),
        "RSA-OAEP",
      );
      symetricKey = forge.util.hexToBytes(decryptedX);
      console.log("symetricKey", symetricKey);
    }
  }
  const user_id = getCookie("user_id");
  const fileBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileBuffer);

  let md = null;

  // Convert signature_algorithm
  switch (signature_algorithm) {
    case "SHA1":
      md = forge.md.sha1.create();
      break;
    case "SHA256":
      md = forge.md.sha256.create();
      break;
    case "SHA384":
      md = forge.md.sha384.create();
      break;
    case "SHA512":
      md = forge.md.sha512.create();
      break;
    case "MD5":
      md = forge.md.md5.create();
      break;
    default:
      md = forge.md.sha256.create();
      break;
  }

  let publicKey: forge.pki.rsa.PublicKey;
  let encryptedSymetricKey: string;

  let file_info: fileInformation;
  let users_group: userInformation[] = [];

  // 16 bytes = 128 bits
  // 32 bytes = 256 bits
  // 64 bytes = 512 bits
  const iv = forge.random.getBytesSync(16);

  console.log("encryption_algorithm", encryption_algorithm);
  console.log("iv", iv);
  console.log("symetricKey", symetricKey);
  // AES - CBC or AES - GCM
  const cipher = forge.cipher.createCipher(encryption_algorithm, symetricKey);
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
    md.update(base64EncryptedFile);
    signature = privateKey.sign(md);
  }

  // message authentication code
  const hmac = forge.hmac.create();
  hmac.start(mac_algorithm, symetricKey);
  hmac.update(base64EncryptedFile);
  const hmacHex = hmac.digest().toHex();

  file_info = {
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    encrypted_file: base64EncryptedFile,
    iv: forge.util.encode64(iv).toString(),
    algorithm: encryption_algorithm,
    // if signature is empty, the file is not signed
    signature: signature ? forge.util.encode64(signature).toString() : "",
    signature_algorithm: signature_algorithm,
    mac: forge.util.encode64(hmacHex).toString(),
    mac_algorithm: mac_algorithm,
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
