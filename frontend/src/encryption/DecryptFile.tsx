import forge from "node-forge";

type FileInput = {
    algorithm: forge.cipher.Algorithm,
    iv: string, 
    encryptedKey: string, 
    encrypted_file: Buffer
}

async function decryptFile(input: FileInput) {
    const fileBytes = new Uint8Array(input.encrypted_file);    

    // Decrypt simetricKey
    const privateKey = forge.pki.privateKeyFromPem( privateKeyPem );

    const symetricKey = privateKey.decrypt( input.encryptedKey );

    // Decrypt file
    var decipher = forge.cipher.createDecipher( input.algorithm, symetricKey);
    decipher.start({iv: input.iv});
    decipher.update(forge.util.createBuffer(fileBytes));
    var result = decipher.finish();

    console.log(decipher.output.toHex());
}


export default decryptFile;