---
sidebar_position: 3
---

# Diffie-Hellman

Upon joining or leaving a group, an algorithm that simulates Diffie-Hellman for multiple parties is executed. The original Diffie-Hellman key exchange algorithm consists of creating a secret key between two entities, usually Alice and Bob, that takes advantage of the discrete logarithm problem.

The idea behind the group version of the Diffie-Hellman algorithm is that, instead of the usual binary group of Alice and Bob, we have a group of $N$ people for which we want a secret key.

Firstly, the algorithm consists of having a prime number $P$ and a generator number $G$ upon which everyone agrees. $G$ must be a number so that for every $n$ where $0 <= n <= p-1$, $G^n mod P$ will generate all the integer numbers between $1$ and $p - 1$. Once everyone has their original secret number $x_i$, they calculate their public number $X_i = G^x_i mod P$. Afterwards, each member gives their public value to someone else, and the recipient also cyphers it with their own secret value ($Y_i = X_i^{x_j} mod P$).This process is now repeated until everyone cyphers everyone else's public cyphers.Once the last members cypher their received values, they keep them, as they now all have the same secret key for the group they form.

## Implementation

Usually, the process described above is executed on each member's client app; however, since our program is a web application with groups that can vary in size, this process would be very inconvenuient for the users, as not only they would have various secret keys for each group locally, but every time a change in the groupoccured, the program would have to access the key file and update it, which could take a long time and could happen asynchronously between users.

To circumvent this problem, the secret key is created on the server, and every time a member joins or leaves a group, a new value is generated for everyone, also on the server. This is achieved by generating $G$ and $P$, but instead of having $n$ users signing each others' values, $n$ arbitrary secret and public key pairs are created, and each only needs to cypher the group value once. After the last operation, the group succesfully has a secret key.

```typescript
// Compute shared secret
  for (let i = 0; i < nUsers; i++) {
    const currentParticipant = participants[i];
    const otherSharedSecret = currentParticipant.participant.computeSecret(
      participants[(i + 1) % nUsers].keys
    );

    if (sharedSecret === null) {
      sharedSecret = otherSharedSecret;
    } else if (!sharedSecret.equals(otherSharedSecret)) {
      throw new Error("Shared secrets are not equal!");
    }
  }
```

Finally, in order to distribute the key to the users, $n$ keys are saved, each signed by the user's own public RSA key, and saved in a database, from where it is retrieved by the user when they need it. In order to use it to encrypt files, the user only needs to decrypt the key with his/her secret RSA key.
