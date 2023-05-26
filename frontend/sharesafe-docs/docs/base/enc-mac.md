---
sidebar_position: 1
---

# Send File

To send an encrypted file to a user, click on the `Send File` button on the Sidebar.

A popup will appear, where the user can:

- upload the file to be sent (mandatory);
- upload his private key, if he wishes to sign the file (optional);
- select the encryption algorithm to be used (AES-256 default);
- select the MAC algorithm to be used (SHA-256 default);
- enable the digital signature (optional);
  - select the digital signature algorithm to be used (RSA-2048 and SHA-256 default);
- type the desired symetric key to be used in the file encryption (optional);
- enable the use of diffie-hellman (optional).

## Send File Logic

- [Encryption](./enc.md)
- [HMAC](./mac.md)
- [Signature](./signature.md)
- [Diffie-Hellman](../extras/diffie-hell.md)

## Notes

In the encrypted data sent across the network, the data is encoded to **_BASE64_**, this
prevents the data from being corrupted during the transfer.

For example, the encrypted file being encoded:

```typescript title="Encoding the encrypted file"
const base64EncryptedFile = forge.util.encode64(encryptedFile);
```
