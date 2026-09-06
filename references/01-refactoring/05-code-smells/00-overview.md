# Code Smells Overview

> Source: [https://refactoring.guru/refactoring/smells](https://refactoring.guru/refactoring/smells)

---

# Code Smells

— What? How can code "smell"??  
— Well it doesn't have a nose... but it definitely can stink!

![](https://refactoring.guru/images/refactoring/content/catalog/bloaters.png?id=32a44a371122874ebd1e8a2cbb9202b9)

### [Bloaters](https://refactoring.guru/refactoring/smells/bloaters)

Bloaters are code, methods and classes that have increased to such gargantuan proportions that they are hard to work with. Usually these smells do not crop up right away, rather they accumulate over time as the program evolves (and especially when nobody makes an effort to eradicate them).

* [Long Method](https://refactoring.guru/smells/long-method)
* [Large Class](https://refactoring.guru/smells/large-class)

* [Primitive Obsession](https://refactoring.guru/smells/primitive-obsession)
* [Long Parameter List](https://refactoring.guru/smells/long-parameter-list)

* [Data Clumps](https://refactoring.guru/smells/data-clumps)

![](https://refactoring.guru/images/refactoring/content/catalog/oo-abusers.png?id=dee31050499d8d6b5a2d5b2e84e68cc8)

### [Object-Orientation Abusers](https://refactoring.guru/refactoring/smells/oo-abusers)

All these smells are incomplete or incorrect application of object-oriented programming principles.

* [Alternative Classes with Different Interfaces](https://refactoring.guru/smells/alternative-classes-with-different-interfaces)

* [Refused Bequest](https://refactoring.guru/smells/refused-bequest)
* [Switch Statements](https://refactoring.guru/smells/switch-statements)

* [Temporary Field](https://refactoring.guru/smells/temporary-field)

![](https://refactoring.guru/images/refactoring/content/catalog/change-preventers.png?id=db5f332e55fd4b993e15c419baf1db41)

### [Change Preventers](https://refactoring.guru/refactoring/smells/change-preventers)

These smells mean that if you need to change something in one place in your code, you have to make many changes in other places too. Program development becomes much more complicated and expensive as a result.

* [Divergent Change](https://refactoring.guru/smells/divergent-change)

* [Parallel Inheritance Hierarchies](https://refactoring.guru/smells/parallel-inheritance-hierarchies)

* [Shotgun Surgery](https://refactoring.guru/smells/shotgun-surgery)

![](https://refactoring.guru/images/refactoring/content/catalog/dispensables.png?id=b1072dc9efcf8c0374ddbd7e0b8d496f)

### [Dispensables](https://refactoring.guru/refactoring/smells/dispensables)

A dispensable is something pointless and unneeded whose absence would make the code cleaner, more efficient and easier to understand.

* [Comments](https://refactoring.guru/smells/comments)
* [Duplicate Code](https://refactoring.guru/smells/duplicate-code)

* [Data Class](https://refactoring.guru/smells/data-class)
* [Dead Code](https://refactoring.guru/smells/dead-code)

* [Lazy Class](https://refactoring.guru/smells/lazy-class)
* [Speculative Generality](https://refactoring.guru/smells/speculative-generality)

![](https://refactoring.guru/images/refactoring/content/catalog/couplers.png?id=1a0e96c005372053d5823ccb5282ae7d)

### [Couplers](https://refactoring.guru/refactoring/smells/couplers)

All the smells in this group contribute to excessive coupling between classes or show what happens if coupling is replaced by excessive delegation.

* [Feature Envy](https://refactoring.guru/smells/feature-envy)
* [Inappropriate Intimacy](https://refactoring.guru/smells/inappropriate-intimacy)

* [Incomplete Library Class](https://refactoring.guru/smells/incomplete-library-class)
* [Message Chains](https://refactoring.guru/smells/message-chains)

* [Middle Man](https://refactoring.guru/smells/middle-man)