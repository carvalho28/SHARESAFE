---
sidebar_position: 2
---

# File Encryption

For safety purposes, the iv is generated randomly and is different for each file.

The encryption however can be done in three different ways:

- using a symmetric key chosen by the user;
- using a symmetric key generated randomly;
- using the [diffie-hellman](../extras/diffie-hell) key exchange algorithm.

## Random Symmetric Key

If the user does not submit a symmetric key, one will be generated randomly.

```typescript title="Generating symmetric key and iv"
const symmetricKey = forge.random.getBytesSync(32);
const iv = forge.random.getBytesSync(16);
```

Then the file will be encrypted using the symmetric key and iv previously generated and the encryption algorithm chosen by the user.

```typescript title="File encryption"
const cipher = forge.cipher.createCipher(encryption_algorithm, symmetricKey);
cipher.start({ iv: iv });
cipher.update(forge.util.createBuffer(fileBytes));
cipher.finish();
```

## Symmetric Key chosen by the user

If the user submits a symmetric key, it will be used to encrypt the file.

```typescript title="Creating symmetric key based on user input"
symmetricKey = forge.pkcs5.pbkdf2(
  own_key,
  forge.random.getBytesSync(32),
  10000,
  32,
);
```

This function `forge.pkcs5.pbkdf2` generates a symmetric key based on the user's input and a random salt,
allowing the password to be used as a key, in a secure way.

## Symmetric Key generated using Diffie-Hellman

The process of generating the symmetric key is explained in the [diffie-hellman](../extras/diffie-hell) page.

## Allowed encryption algorithms

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

## Location - Encrypted Files

The encrypted files are stored in the `files` folder, in the `backend` folder.
The decision to store the files in the files folder, rather than the database, was made to optimize storage and improve database performance. Additionally, storing files separately allows for easier file management and enables direct access to the files when needed.
