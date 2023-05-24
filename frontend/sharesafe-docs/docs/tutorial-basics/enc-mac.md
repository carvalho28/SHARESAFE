---
sidebar_position: 1
---

# Encryption, Signature and MAC

To send an encrypted file to a user, click on the `Send File` button on the Sidebar.

A popup will appear, where the user can:

- upload the file to be sent (mandatory);
- upload his private key, if he wishes to sign the file (optional);
- select the encryption algorithm to be used (AES-256 default);
- select the MAC algorithm to be used (SHA-256 default);
- select the digital signature algorithm to be used (RSA-2048 and SHA-256 default);
- type the desired symetric key to be used in the file encryption (optional).

## File Encryption

In case the user opts for not providing the symetric key, it will be generated randomly. Same applies to the iv.

```typescript title="Generating symetric key and iv"
  const symetricKey = forge.random.getBytesSync(32);
  const iv = forge.random.getBytesSync(16);
```
Then the file will be encrypted using the seymetric key and iv previously generated, and the encryption algorithm chosen by the user.

```typescript title="File encryption"
const cipher = forge.cipher.createCipher( encryption_algorithm, symetricKey);
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

Endly the now encrypted file is encoded to ***BASE64***.

```typescript title="Encoding the encrypted file"
const base64EncryptedFile = forge.util.encode64(encryptedFile);
```

## File Signature

If the user has uploaded the signature file, the encryped file will be sign with the user's signature.

```typescript title="Sign the encrypted file"
if (digitalSignature) {
    const privateKeyFileBuffer = await digitalSignature?.arrayBuffer();
    const privateKeyString = new TextDecoder().decode(privateKeyFileBuffer);
    const privateKey = forge.pki.privateKeyFromPem(privateKeyString);
    // sign the encrypted file
    md.update(base64EncryptedFile);
    signature = privateKey.sign(md);
  }
```

### Allowed Signature algorithms

- SHA1
- SHA256
- SHA384
- SHA512
- MD5

## HMAC

Finnaly, an HMAC it's generated using the mac algorithm chosen by the user.

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