# Hide Method

> Source: [https://refactoring.guru/hide-method](https://refactoring.guru/hide-method)

---

# Hide Method

### Problem

A method isn’t used by other classes or is used only inside its own class hierarchy.

### Solution

Make the method private or protected.

Before

![Hide Method - Before](https://refactoring.guru/images/refactoring/diagrams/Hide Method - Before.png?id=598219cd5a4b26974b091534b2dc89ae)

After

![Hide Method - After](https://refactoring.guru/images/refactoring/diagrams/Hide Method - After.png?id=2f7f1435a959a0a611778513e5bc4365)

### Why Refactor

Quite often, the need to hide methods for getting and setting values is due to development of a richer interface that provides additional behavior, especially if you started with a class that added little beyond mere data encapsulation.

As new behavior is built into the class, you may find that public getter and setter methods are no longer necessary and can be hidden. If you make getter or setter methods private and apply direct access to variables, you can delete the method.

### Benefits

* Hiding methods makes it easier for your code to evolve. When you change a private method, you only need to worry about how to not break the current class since you know that the method can’t be used anywhere else.
* By making methods private, you underscore the importance of the public interface of the class and of the methods that remain public.

### How to Refactor

1. Regularly try to find methods that can be made private. Static code analysis and good unit test coverage can offer a big leg up.
2. Make each method as private as possible.

### Eliminates smell

[Data Class](https://refactoring.guru/smells/data-class)