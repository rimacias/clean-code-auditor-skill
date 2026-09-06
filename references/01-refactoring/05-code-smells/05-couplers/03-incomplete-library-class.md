# Incomplete Library Class

> Source: [https://refactoring.guru/smells/incomplete-library-class](https://refactoring.guru/smells/incomplete-library-class)

---

# Incomplete Library Class

### Signs and Symptoms

Sooner or later, [libraries](https://en.wikipedia.org/wiki/Library_(computing)) stop meeting user needs. The only solution to the problem—changing the library—is often impossible since the library is read-only.

![](https://refactoring.guru/images/refactoring/content/smells/incomplete-library-class-01.png?id=ca51f740f7fd39b7de1430b64cae9f8c)

### Reasons for the Problem

The author of the library hasn’t provided the features you need or has refused to implement them.

### Treatment

* To introduce a few methods to a library class, use [Introduce Foreign Method](https://refactoring.guru/introduce-foreign-method).
* For big changes in a class library, use [Introduce Local Extension](https://refactoring.guru/introduce-local-extension).

### Payoff

* Reduces code duplication (instead of creating your own library from scratch, you can still piggy-back off an existing one).

![](https://refactoring.guru/images/refactoring/content/smells/incomplete-library-class-02.png?id=05a8d9c631d43a3fb256196f366fd089)

### When to Ignore

* Extending a library can generate additional work if the changes to the library involve changes in code.