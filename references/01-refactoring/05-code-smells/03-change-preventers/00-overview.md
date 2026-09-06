# Change Preventers Overview

> Source: [https://refactoring.guru/refactoring/smells/change-preventers](https://refactoring.guru/refactoring/smells/change-preventers)

---

# Change Preventers

These smells mean that if you need to change something in one place in your code, you have to make many changes in other places too. Program development becomes much more complicated and expensive as a result.

[Divergent Change](https://refactoring.guru/smells/divergent-change)

You find yourself having to change many unrelated methods when you make changes to a class. For example, when adding a new product type you have to change the methods for finding, displaying, and ordering products.

[Shotgun Surgery](https://refactoring.guru/smells/shotgun-surgery)

Making any modifications requires that you make many small changes to many different classes.

[Parallel Inheritance Hierarchies](https://refactoring.guru/smells/parallel-inheritance-hierarchies)

Whenever you create a subclass for a class, you find yourself needing to create a subclass for another class.