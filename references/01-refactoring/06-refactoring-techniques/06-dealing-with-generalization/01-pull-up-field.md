# Pull Up Field

> Source: [https://refactoring.guru/pull-up-field](https://refactoring.guru/pull-up-field)

---

# Pull Up Field

### Problem

Two classes have the same field.

### Solution

Remove the field from subclasses and move it to the superclass.

Before

![Pull Up Field - Before](https://refactoring.guru/images/refactoring/diagrams/Pull Up Field - Before.png?id=8174b96aa69ce1541271a14b97cc3e33)

After

![Pull Up Field - After](https://refactoring.guru/images/refactoring/diagrams/Pull Up Field - After.png?id=c97f930072aba9f00c03ba140797de19)

### Why Refactor

Subclasses grew and developed separately, causing identical (or nearly identical) fields and methods to appear.

### Benefits

* Eliminates duplication of fields in subclasses.
* Eases subsequent relocation of duplicate methods, if they exist, from subclasses to a superclass.

### How to Refactor

1. Make sure that the fields are used for the same needs in subclasses.
2. If the fields have different names, give them the same name and replace all references to the fields in existing code.
3. Create a field with the same name in the superclass. Note that if the fields were private, the superclass field should be protected.
4. Remove the fields from the subclasses.
5. You may want to consider using [Self Encapsulate Field](https://refactoring.guru/self-encapsulate-field) for the new field, in order to hide it behind access methods.

### Anti-refactoring

[Push Down Field](https://refactoring.guru/push-down-field)

### Similar refactorings

[Pull Up Method](https://refactoring.guru/pull-up-method)

### Eliminates smell

[Duplicate Code](https://refactoring.guru/smells/duplicate-code)