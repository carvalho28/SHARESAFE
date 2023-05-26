---
sidebar_position: 3
---

# Diffie-Hellman

<!-- Upon joining or leaving a group, an algorithm that simulates Diffie-Hellman for multiple parties is executed. The original Diffe-Hellman key exchange algorithm consists of creating a secret key between two entities, usually Alice and Bob, that takes advantage of the discrete logarithm problem. 

The idea behind the group version of the Diffie-Hellman algorithm is that, instead of the usual binary group of Alice and Bob, we have a group of $N$ people for which we want a secret key.

Firstly, the algorithm consists of having a prime number $P$ and a generator number $G$ upon which everyone agrees. $G$ must be a number so that for every $n$ where $0 <= n <= p-1$, $G^n mod P$ will generate all the integer numbers between $1$ and $p - 1$. Once everyone has their original secret number $x_i$, they calculate their public number $X_i = G^x_i mod P$. Afterward, each member gives their public value to someone else, and the recipient also cyphers it with their own secret value ($Y_i = X_i^{x_j} mod P$). This process is now repeated until everyone cyphers everyone else's public cyphers. Once the last members cypher their received values, they keep them, as they now all have the same secret key for the group they form.

## Implementation

Usually, the process described above is executed on each member's client app; however, since our program is a web application with groups that can vary in size, this process would be very inconvenient for the users, as not only they would have various secret keys for each group locally, but every time a change in the group occurred, the program would have to access the key file and update it, which could take a long time and could happen asynchronously between users.

To circumvent this problem, the secret key is created on the server, and every time a member joins or leaves a group, a new value is generated for everyone, also on the server. This is achieved by generating $G$ and $P$, but instead of having $n$ users signing each other's values, $n$ arbitrary secret and public key pairs are created, and each only needs to cypher the group value once. After the last operation, the group successfully has a secret key.

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
Finally, in order to distribute the key to the users, $n$ keys are saved, each signed by the user's own public RSA key, and saved in a database, from where it is retrieved by the user when they need it. In order to use it to encrypt files, the user only needs to decrypt the key with his/her secret RSA key. -->

The Diffie-Hellman key exchange is a method used by multiple parties to establish a shared secret key over an insecure channel.

Let's consider a scenario with three participants: Alice, Bob, and Charlie. Here's a step-by-step graphical representation of how they can perform the Diffie-Hellman key exchange:

Step 1: Initialization

```scss
          Public Parameters
       (Prime Number, Primitive Root)

           /       |        \
          /        |         \
     Alice       Bob       Charlie
    (a=?)      (b=?)      (c=?)
```

In this step, all participants agree on public parameters: a prime number and a generator. These parameters are shared among the participants.

Step 2: Private Values

```scss
          Public Parameters
       (Prime Number, Primitive Root)

           /       |        \
          /        |         \
     Alice       Bob       Charlie
    (a=5)      (b=7)      (c=3)
```

Each participant chooses a private value. In this example, Alice chooses 5, Bob chooses 7, and Charlie chooses 3.

Step 3: Compute Public Values

```scss
          Public Parameters
       (Prime Number, Primitive Root)

        /              |           \
       /               |            \
  Alice               Bob         Charlie
 (a=5)               (b=7)        (c=3)
(publicA=?)     (publicB=?)   (publicC=?)
```


Each participant computes their public value by raising the generator to the power of their private value modulo the prime number. For example, Alice calculates $publicA = Generator^a mod Prime Number$.

Step 4: Exchange Public Values

```scss
          Public Parameters
       (Prime Number, Primitive Root)

        /              |           \
       /               |            \
  Alice       <---   Bob       <---   Charlie
 (a=5)              (b=7)         (c=3)
(publicA=?)    (publicB=?)   (publicC=?)
```

Participants exchange their computed public values with each other.

Step 5: Compute Shared Secret

```scss
          Public Parameters
       (Prime Number, Primitive Root)

        /              |           \
       /               |            \
  Alice               Bob         Charlie
 (a=5)               (b=7)        (c=3)
(publicA=?)     (publicB=?)   (publicC=?)
   sharedA=         sharedB=       sharedC=
    (computed       (computed     (computed
   by Alice)       by Bob)       by Charlie)
```

Each participant computes the shared secret by raising the received public value to the power of their private value modulo the prime number. For example, Alice calculates $sharedA = publicB^a$ mod Prime Number.

Step 6: Shared Secret

```scss
          Public Parameters
       (Prime Number, Primitive Root)

        /              |           \
       /               |            \
  Alice               Bob         Charlie
 (a=5)               (b=7)        (c=3)
(publicA=?)     (publicB=?)   (publicC=?)
   sharedA=         sharedB=       sharedC=
    (computed       (computed     (computed
   by Alice)       by Bob)       by Charlie)
     (shared        (shared        (shared
    secret of      secret of      secret of
     Alice)         Bob)         Charlie)

```

After performing the necessary computations, all participants have a shared secret key. In this example, Alice, Bob, and Charlie have established the shared secret, which is the same for all of them.

Please note that the numbers and calculations shown in this graphical representation are simplified for illustrative purposes. In practice, much larger prime numbers and complex calculations are used to ensure the security of the key exchange.
