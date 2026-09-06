# Refused Bequest

> Source: [https://refactoring.guru/smells/refused-bequest](https://refactoring.guru/smells/refused-bequest)

---

# Refused Bequest

### Signs and Symptoms

If a subclass uses only some of the methods and properties inherited from its parents, the hierarchy is off-kilter. The unneeded methods may simply go unused or be redefined and give off exceptions.

![](https://refactoring.guru/images/refactoring/content/smells/refused-bequest-01.png?id=7a1d79e75a3836c22ec865d72c98664e)

### Reasons for the Problem

Someone was motivated to create inheritance between classes only by the desire to reuse the code in a superclass. But the superclass and subclass are completely different.

![](https://refactoring.guru/images/refactoring/content/smells/refused-bequest-02.png?id=f9b0affd4bbf6fec22c05783fc75562e)

### Treatment

* If inheritance makes no sense and the subclass really does have nothing in common with the superclass, eliminate inheritance in favor of [Replace Inheritance with Delegation](https://refactoring.guru/replace-inheritance-with-delegation).
* If inheritance is appropriate, get rid of unneeded fields and methods in the subclass. Extract all fields and methods needed by the subclass from the parent class, put them in a new superclass, and set both classes to inherit from it ([Extract Superclass](https://refactoring.guru/extract-superclass)).

![](https://refactoring.guru/images/refactoring/content/smells/refused-bequest-03.png?id=2a84293620fa1caf4329fca1f4a44e08)

### Payoff

* Improves code clarity and organization. You will no longer have to wonder why the `Dog` class is inherited from the `Chair` class (even though they both have 4 legs).