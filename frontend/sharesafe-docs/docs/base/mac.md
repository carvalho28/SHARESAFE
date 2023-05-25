---
sidebar_position: 3
---

# HMAC

The HMAC is generated using the mac algorithm chosen by the user.

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
