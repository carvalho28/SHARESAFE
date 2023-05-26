---
sidebar_position: 6
---

# File Signature

Lastly, if the user has enabled the signature, the encrypted file will be signed with the user's signature. This signature is generated using the user's private key, and the signature algorithm chosen by the user.

````typescript title="Signature"

if (digitalSignature) {
  const privateKeyFileBuffer = await digitalSignature?.arrayBuffer();
  const privateKeyString = new TextDecoder().decode(privateKeyFileBuffer);
  const privateKey = forge.pki.privateKeyFromPem(privateKeyString);
  // sign the encrypted file
  md.update(base64EncryptedFile);
  signature = privateKey.sign(md);
}
````

## Allowed Signature algorithms

- SHA1
- SHA256
- SHA384
- SHA512
- MD5

The signature is used to verify that the received file was sent by the user who claims to have sent it.
The signature guarantees:

- **message authentication**: the receiver can verify that the message comes from the sender;
- **message integrity**: the receiver can verify that the message has not been altered;
- **non-repudiation**: the sender cannot deny having sent the message;
- **false-proof**: the receiver cannot forge the signature of the message.
