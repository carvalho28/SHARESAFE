import forge from "node-forge";

type FileInput = {
    algorithm: forge.cipher.Algorithm,
    iv: Buffer, 
    encryptedKey: string, 
    encrypted_file: Buffer
    privateKeyPem: string
}

// Decrypts the file and downloads it
async function decryptFile(input: FileInput) {
    console.log(input);

    const fileBytes = new Uint8Array( input.encrypted_file );

    const privateKey = forge.pki.privateKeyFromPem( input.privateKeyPem );
    
    console.log(forge.util.decode64( input.encryptedKey ));
    
    // Decrypt simetricKey
    const symetricKey = privateKey.decrypt( forge.util.decode64( input.encryptedKey ) );

    // Decrypt file
    var decipher = forge.cipher.createDecipher( input.algorithm, symetricKey);
    decipher.start({iv: Buffer.from( input.iv ).toString() });
    decipher.update(forge.util.createBuffer(fileBytes));
    var result = decipher.finish();

    if (!result) throw "Error on file decryption"

    console.log(decipher.output.toHex());

    return decipher.output;
}

export default decryptFile;