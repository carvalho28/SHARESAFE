---
sidebar_position: 1
---

# Encryption, MAC and Signature

To send an encrypted file to a user, click on the `Send File` button on the Sidebar.

A popup will appear, where the user can:

- upload the file to be sent (mandatory);
- upload his private key, if he wishes to sign the file (optional);
- select the encryption algorithm to be used (AES-256 default);
- select the MAC algorithm to be used (SHA-256 default);
- enable the digital signature (optional);
  - select the digital signature algorithm to be used (RSA-2048 and SHA-256 default);
- type the desired symetric key to be used in the file encryption (optional).

## File Encryption

If the user does not submit a symmetric key, one will be generated randomly. The generated iv is always random.

```typescript title="Generating symetric key and iv"
const symetricKey = forge.random.getBytesSync(32);
const iv = forge.random.getBytesSync(16);
```

Then the file will be encrypted using the symmetric key and iv previously generated and the encryption algorithm chosen by the user.

```typescript title="File encryption"
const cipher = forge.cipher.createCipher(encryption_algorithm, symetricKey);
cipher.start({ iv: iv });
cipher.update(forge.util.createBuffer(fileBytes));
cipher.finish();
```

### Allowed encryption algorithms

- AES-ECB
- AES-CBC
- AES-CFB
- AES-OFB
- AES-CTR
- AES-GCM
- 3DES-ECB
- 3DES-CBC
- DES-ECB
- DES-CBC

### Location - Encrypted Files

The encrypted files are stored in the `files` folder, in the `backend` folder.
The decision to store the files in the files folder, rather than the database, was made to optimize storage and improve database performance. Additionally, storing files separately allows for easier file management and enables direct access to the files when needed.

## HMAC

The HMAC is generated using the mac algorithm chosen by the user.

```typescript title="HMAC"
const hmac = forge.hmac.create();
hmac.start(mac_algorithm, symetricKey);
hmac.update(base64EncryptedFile);
const hmacHex = hmac.digest().toHex();
```

### Allowed HMAC algorithms

- SHA1
- SHA256
- SHA384
- SHA512
- MD5

This HMAC is used to verify the integrity of the file, when the user receives it.
HMAC guarantees:

- **Message authentication**: the receiver can verify that the message comes from the sender.
- **Message integrity**: the receiver can verify that the message has not been altered.

## File Signature

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

### Allowed Signature algorithms

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

## Notes

In the encrypted data sent across the network, the data is encoded to **_BASE64_**, this
prevents the data from being corrupted during the transfer.

For example, the encrypted file being encoded:

```typescript title="Encoding the encrypted file"
const base64EncryptedFile = forge.util.encode64(encryptedFile);
```
