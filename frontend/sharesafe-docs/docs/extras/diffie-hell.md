---
sidebar_position: 3
---

# Diffie-Hellman

The Diffie-Hellman key exchange is a method used by multiple parties to establish a shared secret key over an insecure channel.

Let us consider a scenario with three participants: Alice, Bob, and Charlie. Here is a step-by-step graphical representation of how they can perform the Diffie-Hellman key exchange:

**Step 1**: Initialization

```
          Public Parameters
       (Prime Number, Primitive Root)

           /       |        \
          /        |         \
       Alice      Bob       Charlie
      (a=?)      (b=?)       (c=?)
```

In this step, all participants agree on public parameters: a prime number and a generator. These parameters are shared among the participants.

**Step 2**: Private Values

```
          Public Parameters
       (Prime Number, Primitive Root)

           /       |        \
          /        |         \
        Alice     Bob       Charlie
      (a=5)      (b=7)       (c=3)
```

Each participant chooses a private value. In this example, Alice chooses 5, Bob chooses 7, and Charlie chooses 3.

**Step 3**: Compute Public Values

```
          Public Parameters
       (Prime Number, Primitive Root)

        /              |           \
       /               |            \
  Alice               Bob         Charlie
 (a=5)               (b=7)        (c=3)
(publicA=?)     (publicB=?)   (publicC=?)
```

Each participant computes their public value by raising the generator to the power of their private value modulo the prime number. For example, Alice calculates $publicA = Generator^a mod Prime Number$.

**Step 4**: Exchange Public Values

```
          Public Parameters
       (Prime Number, Primitive Root)

        /              |           \
       /               |            \
  Alice      <---   Bob       <--- Charlie
 (a=5)              (b=7)            (c=3)
(publicA=?)      (publicB=?)       (publicC=?)
```

Participants exchange their computed public values with each other.

**Step 5**: Compute Shared Secret

```
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

**Step 6**: Shared Secret

```
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
