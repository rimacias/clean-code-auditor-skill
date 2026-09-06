# Large Class

> Source: [https://refactoring.guru/smells/large-class](https://refactoring.guru/smells/large-class)

---

# Large Class

### Signs and Symptoms

A class contains many fields/methods/lines of code.

![](https://refactoring.guru/images/refactoring/content/smells/large-class-01.png?id=acac82f25cc90aaa413c2daefebf0e4b)

### Reasons for the Problem

Classes usually start small. But over time, they get bloated as the program grows.

As is the case with long methods as well, programmers usually find it mentally less taxing to place a new feature in an existing class than to create a new class for the feature.

![](https://refactoring.guru/images/refactoring/content/smells/large-class-02.png?id=973b37334ae57489945a88b9327f81e3)

### Treatment

When a class is wearing too many (functional) hats, think about splitting it up:

* [Extract Class](https://refactoring.guru/extract-class) helps if part of the behavior of the large class can be spun off into a separate component.
* [Extract Subclass](https://refactoring.guru/extract-subclass) helps if part of the behavior of the large class can be implemented in different ways or is used in rare cases.
* [Extract Interface](https://refactoring.guru/extract-interface) helps if it’s necessary to have a list of the operations and behaviors that the client can use.
* If a large class is responsible for the graphical interface, you may try to move some of its data and behavior to a separate domain object. In doing so, it may be necessary to store copies of some data in two places and keep the data consistent. [Duplicate Observed Data](https://refactoring.guru/duplicate-observed-data) offers a way to do this.

![](https://refactoring.guru/images/refactoring/content/smells/large-class-03.png?id=f0a0109f731dbc420ffe385cb658f0de)

### Payoff

* Refactoring of these classes spares developers from needing to remember a large number of attributes for a class.
* In many cases, splitting large classes into parts avoids duplication of code and functionality.