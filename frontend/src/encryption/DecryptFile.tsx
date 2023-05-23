import forge from "node-forge";

type FileInput = {
  algorithm: forge.cipher.Algorithm;
  iv: string;
  encryptedKey: string;
  encrypted_file: any;
  privateKeyPem: string;
};

// Decrypts the file and downloads it
async function decryptFile(
  input: FileInput,
  type: string,
  receivedMac: string,
) {
  const decodedFile = forge.util.hexToBytes(
    forge.util.decode64(input.encrypted_file),
  );

  const privateKey = forge.pki.privateKeyFromPem(input.privateKeyPem);

  // Decrypt simetricKey
  const symetricKey = privateKey.decrypt(
    forge.util.decode64(input.encryptedKey),
  );

  // verify the hmac
  const hmac = forge.hmac.create();
  hmac.start("sha256", symetricKey);
  hmac.update(input.encrypted_file);
  const calculatedMac = hmac.digest().toHex();
  if (calculatedMac !== forge.util.decode64(receivedMac))
    throw "Message authentication code is not valid";

  // Decrypt file
  const decipher = forge.cipher.createDecipher(input.algorithm, symetricKey);
  decipher.start({
    iv: forge.util.decode64(input.iv),
  });
  // given that i saved the file as .getBytes() i need to convert it back to a buffer
  decipher.update(forge.util.createBuffer(decodedFile));
  const result = decipher.finish();

  if (!result) throw "Error on file decryption";

  // return decipher.output.getBytes();
  return decipher.output.data;

  // ---- decrypt utf8-encoded bytes ----

  // const decryptedData = decipher.output.getBytes();
  // const utf8String = forge.util.decodeUtf8(decryptedData);

  // return utf8String;
}

export default decryptFile;
