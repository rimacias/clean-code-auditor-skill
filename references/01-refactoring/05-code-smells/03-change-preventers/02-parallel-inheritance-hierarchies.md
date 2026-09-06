# Parallel Inheritance Hierarchies

> Source: [https://refactoring.guru/smells/parallel-inheritance-hierarchies](https://refactoring.guru/smells/parallel-inheritance-hierarchies)

---

# Parallel Inheritance Hierarchies

### Signs and Symptoms

Whenever you create a subclass for a class, you find yourself needing to create a subclass for another class.

![](https://refactoring.guru/images/refactoring/content/smells/parallel-inheritance-hierarchies-01.png?id=9167875f5f0e80256edcc8fcaaed3563)

### Reasons for the Problem

All was well as long as the hierarchy stayed small. But with new classes being added, making changes has become harder and harder.

### Treatment

* You may de-duplicate parallel class hierarchies in two steps. First, make instances of one hierarchy refer to instances of another hierarchy. Then, remove the hierarchy in the referred class, by using [Move Method](https://refactoring.guru/move-method) and [Move Field](https://refactoring.guru/move-field).

### Payoff

* Reduces code duplication.
* Can improve organization of code.

![](https://refactoring.guru/images/refactoring/content/smells/parallel-inheritance-hierarchies-02.png?id=4dca6795d3d087b23ad1027298d6f1dd)

### When to Ignore

* Sometimes having parallel class hierarchies is just a way to avoid even bigger mess with program architecture. If you find that your attempts to de-duplicate hierarchies produce even uglier code, just step out, revert all of your changes and get used to that code.