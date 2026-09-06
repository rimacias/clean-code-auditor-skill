# Push Down Field

> Source: [https://refactoring.guru/push-down-field](https://refactoring.guru/push-down-field)

---

# Push Down Field

### Problem

Is a field used only in a few subclasses?

### Solution

Move the field to these subclasses.

Before

![Push Down Field - Before](https://refactoring.guru/images/refactoring/diagrams/Push Down Field - Before.png?id=79ff2461236c616fcfbc5b0ab8abf5d9)

After

![Push Down Field - After](https://refactoring.guru/images/refactoring/diagrams/Push Down Field - After.png?id=b48b45a448c27122df61dab2c2451227)

### Why Refactor

Although it was planned to use a field universally for all classes, in reality the field is used only in some subclasses. This situation can occur when planned features fail to pan out, for example.

This can also occur due to extraction (or removal) of part of the functionality of class hierarchies.

### Benefits

* Improves internal class coherency. A field is located where it’s actually used.
* When moving to several subclasses simultaneously, you can develop the fields independently of each other. This does create code duplication, yes, so push down fields only when you really do intend to use the fields in different ways.

### How to Refactor

1. Declare a field in all the necessary subclasses.
2. Remove the field from the superclass.

### Anti-refactoring

[Pull Up Field](https://refactoring.guru/pull-up-field)

### Similar refactorings

[Push Down Method](https://refactoring.guru/push-down-method)

### Helps other refactorings

[Extract Subclass](https://refactoring.guru/extract-subclass)

### Eliminates smell

[Refused Bequest](https://refactoring.guru/smells/refused-bequest)