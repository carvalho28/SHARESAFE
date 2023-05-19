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
  console.log("input.encrypted_file", input.encrypted_file);

  const decodedFile = forge.util.decode64(input.encrypted_file);

  const privateKey = forge.pki.privateKeyFromPem(input.privateKeyPem);

  // console.log(forge.util.decode64( input.encryptedKey ));

  // Decrypt simetricKey
  const symetricKey = privateKey.decrypt(
    forge.util.decode64(input.encryptedKey),
  );

  console.log("symetricKey", symetricKey);
  console.log("input.iv", forge.util.decode64(input.iv));
  console.log("input.algorithm", input.algorithm);

  // Decrypt file
  const decipher = forge.cipher.createDecipher(input.algorithm, symetricKey);
  decipher.start({
    iv: forge.util.decode64(input.iv),
  });
  // given that i saved the file as .getBytes() i need to convert it back to a buffer
  decipher.update(forge.util.createBuffer(decodedFile));
  const result = decipher.finish();
  console.log("result", result);
  console.log("decipher", decipher);
  console.log("decipher.output", decipher.output);
  console.log("decipher.output", decipher.output.getBytes());

  if (!result) throw "Error on file decryption";
  console.log("decipher.output", decipher.output);

  return decipher.output;
}

export default decryptFile;
