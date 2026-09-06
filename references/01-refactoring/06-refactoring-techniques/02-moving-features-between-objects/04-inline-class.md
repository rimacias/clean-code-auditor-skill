# Inline Class

> Source: [https://refactoring.guru/inline-class](https://refactoring.guru/inline-class)

---

# Inline Class

### Problem

A class does almost nothing and isn’t responsible for anything, and no additional responsibilities are planned for it.

### Solution

Move all features from the class to another one.

Before

![Inline Class - Before](https://refactoring.guru/images/refactoring/diagrams/Inline Class - Before.png?id=717d80baaa902d09acbaa55fd0539638)

After

![Inline Class - After](https://refactoring.guru/images/refactoring/diagrams/Inline Class - After.png?id=7cb7db0fe2ab0d17f067d411f9e98f15)

### Why Refactor

* Often this technique is needed after the features of one class are “transplanted” to other classes, leaving that class with little to do.

### Benefits

* Eliminating needless classes frees up operating memory on the computer—and bandwidth in your head.

### How to Refactor

1. In the recipient class, create the public fields and methods present in the donor class. Methods should refer to the equivalent methods of the donor class.
2. Replace all references to the donor class with references to the fields and methods of the recipient class.
3. Now test the program and make sure that no errors have been added. If tests show that everything is working A-OK, start using [Move Method](https://refactoring.guru/move-method) and [Move Field](https://refactoring.guru/move-field) to completely transplant all functionality to the recipient class from the original one. Continue doing so until the original class is completely empty.
4. Delete the original class.

### Anti-refactoring

[Extract Class](https://refactoring.guru/extract-class)

### Eliminates smell

[Shotgun Surgery](https://refactoring.guru/smells/shotgun-surgery)

[Lazy Class](https://refactoring.guru/smells/lazy-class)

[Speculative Generality](https://refactoring.guru/smells/speculative-generality)