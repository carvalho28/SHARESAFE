---
sidebar_position: 3
---

# Message Authentication Code (MAC)

We opted for **HMAC** (Hash-based Message Authentication Code) to ensure the integrity of the file.
**HMAC** provides a secure way to verify the authenticity and integrity of the file by generating a unique hash code based on the file's contents and a secret key. This ensures that any tampering or modifications to the file can be detected, providing an added layer of data integrity protection.

The **HMAC** is generated using the mac algorithm chosen by the user.

```typescript title="HMAC"
const hmac = forge.hmac.create();
hmac.start(mac_algorithm, symetricKey);
hmac.update(base64EncryptedFile);
const hmacHex = hmac.digest().toHex();
```

## Allowed HMAC algorithms

- SHA1
- SHA256
- SHA384
- SHA512
- MD5

This HMAC is used to verify the integrity of the file, when the user receives it.
HMAC guarantees:

- **Message authentication**: the receiver can verify that the message comes from the sender.
- **Message integrity**: the receiver can verify that the message has not been altered.
