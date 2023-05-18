import forge from "node-forge";

type FileInput = {
  algorithm: forge.cipher.Algorithm;
  iv: string;
  encryptedKey: string;
  encrypted_file: any;
  privateKeyPem: string;
};

// Decrypts the file and downloads it
async function decryptFile(input: FileInput) {
  console.log(input);

  const fileBytes = new Uint8Array(input.encrypted_file.data);
  console.log("fileBytes", fileBytes);

  const privateKey = forge.pki.privateKeyFromPem(input.privateKeyPem);

  // console.log(forge.util.decode64( input.encryptedKey ));
  console.log("input.encryptedKey", input.encryptedKey);

  // Decrypt simetricKey
  const symetricKey = privateKey.decrypt(
    forge.util.decode64(input.encryptedKey),
  );

  console.log("symetricKey", symetricKey);

  // Decrypt file
  var decipher = forge.cipher.createDecipher(input.algorithm, symetricKey);
  decipher.start({
    iv: forge.util.createBuffer(forge.util.decode64(input.iv)),
  });
  decipher.update(forge.util.createBuffer(fileBytes));
  var result = decipher.finish();
  console.log("result", result);

  if (!result) throw "Error on file decryption";
  console.log("decipher.output", decipher.output);

  return decipher.output;
}

export default decryptFile;
