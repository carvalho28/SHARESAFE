---
sidebar_position: 4
---

# File Signature

Lastly, if the user has enable the signature, the encryped file will be sign with the user's signature, his private key and the signature algorithm chosen by the user.

````typescript title="Signature"

```typescript title="Sign the encrypted file"
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

- **Message authentication**: the receiver can verify that the message comes from the sender.
- **Message integrity**: the receiver can verify that the message has not been altered.
- **Non-repudiation**: the sender cannot deny having sent the message.
- **False-proof**: the receiver cannot forge the signature of the message.
