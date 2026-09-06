# Duplicate Code

> Source: [https://refactoring.guru/smells/duplicate-code](https://refactoring.guru/smells/duplicate-code)

---

# Duplicate Code

### Signs and Symptoms

Two code fragments look almost identical.

![](https://refactoring.guru/images/refactoring/content/smells/duplicate-code-01.png?id=16fe591195fa50073551852b3d44844e)

### Reasons for the Problem

Duplication usually occurs when multiple programmers are working on different parts of the same program at the same time. Since they’re working on different tasks, they may be unaware their colleague has already written similar code that could be repurposed for their own needs.

There’s also more subtle duplication, when specific parts of code look different but actually perform the same job. This kind of duplication can be hard to find and fix.

Sometimes duplication is purposeful. When rushing to meet deadlines and the existing code is “almost right” for the job, novice programmers may not be able to resist the temptation of copying and pasting the relevant code. And in some cases, the programmer is simply too lazy to de-clutter.

### Treatment

* If the same code is found in two or more methods in the same class: use [Extract Method](https://refactoring.guru/extract-method) and place calls for the new method in both places.

  ![](https://refactoring.guru/images/refactoring/content/smells/duplicate-code-02.png?id=50d92af3defe2c2688f66cde102c9c09)
* If the same code is found in two subclasses of the same level:

  + Use [Extract Method](https://refactoring.guru/extract-method) for both classes, followed by [Pull Up Field](https://refactoring.guru/pull-up-field) for the fields used in the method that you’re pulling up.
  + If the duplicate code is inside a constructor, use [Pull Up Constructor Body](https://refactoring.guru/pull-up-constructor-body).
  + If the duplicate code is similar but not completely identical, use [Form Template Method](https://refactoring.guru/form-template-method).
  + If two methods do the same thing but use different algorithms, select the best algorithm and apply [Substitute Algorithm](https://refactoring.guru/substitute-algorithm).
* If duplicate code is found in two different classes:

  + If the classes aren’t part of a hierarchy, use [Extract Superclass](https://refactoring.guru/extract-superclass) in order to create a single superclass for these classes that maintains all the previous functionality.
  + If it’s difficult or impossible to create a superclass, use [Extract Class](https://refactoring.guru/extract-class) in one class and use the new component in the other.
* If a large number of conditional expressions are present and perform the same code (differing only in their conditions), merge these operators into a single condition using [Consolidate Conditional Expression](https://refactoring.guru/consolidate-conditional-expression) and use [Extract Method](https://refactoring.guru/extract-method) to place the condition in a separate method with an easy-to-understand name.
* If the same code is performed in all branches of a conditional expression: place the identical code outside of the condition tree by using [Consolidate Duplicate Conditional Fragments](https://refactoring.guru/consolidate-duplicate-conditional-fragments).

### Payoff

* Merging duplicate code simplifies the structure of your code and makes it shorter.
* Simplification + shortness = code that’s easier to simplify and cheaper to support.

![](https://refactoring.guru/images/refactoring/content/smells/duplicate-code-03.png?id=bd88b98ff5e5e1b5a4019cb0a50df9f5)

### When to Ignore

* In very rare cases, merging two identical fragments of code can make the code less intuitive and obvious.