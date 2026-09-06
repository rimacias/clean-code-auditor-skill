# Speculative Generality

> Source: [https://refactoring.guru/smells/speculative-generality](https://refactoring.guru/smells/speculative-generality)

---

# Speculative Generality

### Signs and Symptoms

There’s an unused class, method, field or parameter.

![](https://refactoring.guru/images/refactoring/content/smells/speculative-generality-01.png?id=c804fce5c6c5c34b4d9389fcb2aa60aa)

### Reasons for the Problem

Sometimes code is created “just in case” to support anticipated future features that never get implemented. As a result, code becomes hard to understand and support.

### Treatment

* For removing unused abstract classes, try [Collapse Hierarchy](https://refactoring.guru/collapse-hierarchy).
* Unnecessary delegation of functionality to another class can be eliminated via [Inline Class](https://refactoring.guru/inline-class).
* Unused methods? Use [Inline Method](https://refactoring.guru/inline-method) to get rid of them.
* Methods with unused parameters should be given a look with the help of [Remove Parameter](https://refactoring.guru/remove-parameter).
* Unused fields can be simply deleted.

![](https://refactoring.guru/images/refactoring/content/smells/speculative-generality-02.png?id=e9d0e8a6170b6d0d0be9cca44175fe44)

### Payoff

* Slimmer code.
* Easier support.

### When to Ignore

* If you’re working on a framework, it’s eminently reasonable to create functionality not used in the framework itself, as long as the functionality is needed by the frameworks’s users.
* Before deleting elements, make sure that they aren’t used in unit tests. This happens if tests need a way to get certain internal information from a class or perform special testing-related actions.