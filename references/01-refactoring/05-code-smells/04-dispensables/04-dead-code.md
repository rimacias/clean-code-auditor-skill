# Dead Code

> Source: [https://refactoring.guru/smells/dead-code](https://refactoring.guru/smells/dead-code)

---

# Dead Code

### Signs and Symptoms

A variable, parameter, field, method or class is no longer used (usually because it’s obsolete).

![](https://refactoring.guru/images/refactoring/content/smells/dead-code-01.png?id=418685bee5de933c472c48efcb5b67a0)

### Reasons for the Problem

When requirements for the software have changed or corrections have been made, nobody had time to clean up the old code.

Such code could also be found in complex conditionals, when one of the branches becomes unreachable (due to error or other circumstances).

### Treatment

The quickest way to find dead code is to use a good [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment).

* Delete unused code and unneeded files.
* In the case of an unnecessary class, [Inline Class](https://refactoring.guru/inline-class) or [Collapse Hierarchy](https://refactoring.guru/collapse-hierarchy) can be applied if a subclass or superclass is used.
* To remove unneeded parameters, use [Remove Parameter](https://refactoring.guru/remove-parameter).

![](https://refactoring.guru/images/refactoring/content/smells/dead-code-02.png?id=b368f23b7cc88340933b761cf2ad1954)

### Payoff

* Reduced code size.
* Simpler support.