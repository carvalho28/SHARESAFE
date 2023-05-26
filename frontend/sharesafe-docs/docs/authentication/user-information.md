---
sidebar_position: 1
---

# User Information

All users must be authenticated to access the SHARESAFE platform.

## User Table

The `User` table was created to store the user's information.
The table has the following fields:

```prisma
model User {
  id         Int             @id @default(autoincrement())
  name       String
  email      String          @unique
  password   String
  salt       String
  public_key String
  ...
}
```

As we can see, each user is identified by an `id`, has a `name`, an `email` which is the information used to log in.

## Password and Salt

The `password` and `salt` fields are used to store the user's password and the salt used to hash the password.

The `salt` is a random string that is generated when the user creates an account, and is used to make the password "invisible" to anyone who has access to the database, as we can see in the following example of a user:

```
id: 1
name:        Example User
email:       example@example.com
password:    4ab21fc6874461b893f086ab72faed6612c32c93f63981ee65bc99...
salt:        118f166145cebb2035757677cc2af9b14a96f4ed8ee9a6acedc2317d9a...
...
```

### Hashing Password

The function used to hash the password is the following:

```typescript title="hashPassword function"
export function hashPassword(password: string) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { hash, salt };
}
```

It receives the password as a parameter, generates a random string to be used as salt, and then hashes the password using the salt, this salt and hashed password are then stored in the database.

### Verifying Password

To verify if the password is correct, the following function is used:

```typescript title="comparePassword function"
export function comparePassword({
  candidatePassword,
  hash,
  salt,
}: {
  candidatePassword: string;
  hash: string;
  salt: string;
}) {
  const hashVerify = crypto
    .pbkdf2Sync(candidatePassword, salt, 10000, 64, "sha512")
    .toString("hex");

  return hash === hashVerify;
}
```

It receives the candidate password, the hash and the salt, and then hashes the candidate password using the salt.
If the hash of the candidate password is equal to the hash stored in the database, then the password is correct.
