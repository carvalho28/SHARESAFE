import forge from "node-forge";
var fs = require('fs');

type FileInput = {
    fileName: string,
    algorithm: forge.cipher.Algorithm,
    iv: string, 
    encryptedKey: string, 
    encrypted_file: Buffer
    privateKeyPem: string
}

// Decrypts the file and downloads it
async function decryptFile(input: FileInput) {
    const fileBytes = new Uint8Array(input.encrypted_file);    

    const privateKey = forge.pki.privateKeyFromPem( input.privateKeyPem );
    
    // Decrypt simetricKey
    const symetricKey = privateKey.decrypt( input.encryptedKey );

    // Decrypt file
    var decipher = forge.cipher.createDecipher( input.algorithm, symetricKey);
    decipher.start({iv: input.iv});
    decipher.update(forge.util.createBuffer(fileBytes));
    var result = decipher.finish();

    if (!result) throw "Error on file decryption"

    // console.log(decipher.output.toHex());


    // Create blob link to download
    const url = window.URL.createObjectURL(
        new Blob([ decipher.output.getBytes() ]),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
        'download',
        input.fileName,
    );

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);
}

export default decryptFile;
