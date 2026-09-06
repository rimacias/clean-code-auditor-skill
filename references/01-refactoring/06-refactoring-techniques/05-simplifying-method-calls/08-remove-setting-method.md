# Remove Setting Method

> Source: [https://refactoring.guru/remove-setting-method](https://refactoring.guru/remove-setting-method)

---

# Remove Setting Method

### Problem

The value of a field should be set only when it’s created, and not change at any time after that.

### Solution

So remove methods that set the field’s value.

Before

![Remove Setting Method - Before](https://refactoring.guru/images/refactoring/diagrams/Remove Setting Method - Before.png?id=6f5c0d77289a8f59a2bb89032d5bc55f)

After

![Remove Setting Method - After](https://refactoring.guru/images/refactoring/diagrams/Remove Setting Method - After.png?id=5e75fe3df982c4da469ddceb96530058)

### Why Refactor

You want to prevent any changes to the value of a field.

### How to Refactor

1. The value of a field should be changeable only in the constructor. If the constructor doesn’t contain a parameter for setting the value, add one.
2. Find all setter calls.

   * If a setter call is located right after a call for the constructor of the current class, move its argument to the constructor call and remove the setter.
   * Replace setter calls in the constructor with direct access to the field.
3. Delete the setter.

### Helps other refactorings

[Change Reference to Value](https://refactoring.guru/change-reference-to-value)