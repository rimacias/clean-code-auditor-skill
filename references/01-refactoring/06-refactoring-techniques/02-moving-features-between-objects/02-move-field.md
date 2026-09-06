# Move Field

> Source: [https://refactoring.guru/move-field](https://refactoring.guru/move-field)

---

# Move Field

### Problem

A field is used more in another class than in its own class.

### Solution

Create a field in a new class and redirect all users of the old field to it.

Before

![Move Field - Before](https://refactoring.guru/images/refactoring/diagrams/Move Field - Before.png?id=b58c81b01a0c4ef8659f92cc64fa51a8)

After

![Move Field - After](https://refactoring.guru/images/refactoring/diagrams/Move Field - After.png?id=d7c21af94ec9df17575373bae745e96e)

### Why Refactor

Often fields are moved as part of the [Extract Class](https://refactoring.guru/extract-class) technique. Deciding which class to leave the field in can be tough. Here is our rule of thumb: **put a field in the same place as the methods that use it** (or else where most of these methods are).

This rule will help in other cases when a field is simply located in the wrong place.

### How to Refactor

1. If the field is public, refactoring will be much easier if you make the field private and provide public access methods (for this, you can use [Encapsulate Field](https://refactoring.guru/encapsulate-field)).
2. Create the same field with access methods in the recipient class.
3. Decide how you will refer to the recipient class. You may already have a field or method that returns the appropriate object; if not, you will need to write a new method or field to store the object of the recipient class.
4. Replace all references to the old field with appropriate calls to methods in the recipient class. If the field isn’t private, take care of this in the superclass and subclasses.
5. Delete the field in the original class.

### Similar refactorings

[Move Method](https://refactoring.guru/move-method)

### Helps other refactorings

[Extract Class](https://refactoring.guru/extract-class)

[Inline Class](https://refactoring.guru/inline-class)

### Eliminates smell

[Shotgun Surgery](https://refactoring.guru/smells/shotgun-surgery)

[Parallel Inheritance Hierarchies](https://refactoring.guru/smells/parallel-inheritance-hierarchies)

[Inappropriate Intimacy](https://refactoring.guru/smells/inappropriate-intimacy)