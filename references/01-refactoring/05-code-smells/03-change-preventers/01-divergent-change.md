# Divergent Change

> Source: [https://refactoring.guru/smells/divergent-change](https://refactoring.guru/smells/divergent-change)

---

# Divergent Change

> *Divergent Change* resembles [Shotgun Surgery](https://refactoring.guru/smells/shotgun-surgery) but is actually the opposite smell. *Divergent Change* is when many changes are made to a single class. *Shotgun Surgery* refers to when a single change is made to multiple classes simultaneously.

### Signs and Symptoms

You find yourself having to change many unrelated methods when you make changes to a class. For example, when adding a new product type you have to change the methods for finding, displaying, and ordering products.

![](https://refactoring.guru/images/refactoring/content/smells/divergent-change-01.png?id=d62e68e1778d67bf82ff74064c24de33)

### Reasons for the Problem

Often these divergent modifications are due to poor program structure or "copypasta programming”.

### Treatment

* Split up the behavior of the class via [Extract Class](https://refactoring.guru/extract-class).
* If different classes have the same behavior, you may want to combine the classes through inheritance ([Extract Superclass](https://refactoring.guru/extract-superclass) and [Extract Subclass](https://refactoring.guru/extract-subclass)).

![](https://refactoring.guru/images/refactoring/content/smells/divergent-change-02.png?id=21b6fd7cba36f123c09497cb8f5a5625)

### Payoff

* Improves code organization.
* Reduces code duplication.
* Simplifies support.