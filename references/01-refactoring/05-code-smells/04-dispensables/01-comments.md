# Comments

> Source: [https://refactoring.guru/smells/comments](https://refactoring.guru/smells/comments)

---

# Comments

### Signs and Symptoms

A method is filled with explanatory comments.

![](https://refactoring.guru/images/refactoring/content/smells/comments-01.png?id=584958123f3b902e0ad0895d879509b9)

### Reasons for the Problem

Comments are usually created with the best of intentions, when the author realizes that his or her code isn’t intuitive or obvious. In such cases, comments are like a deodorant masking the smell of fishy code that could be improved.

> The best comment is a good name for a method or class.

If you feel that a code fragment can’t be understood without comments, try to change the code structure in a way that makes comments unnecessary.

### Treatment

* If a comment is intended to explain a complex expression, the expression should be split into understandable subexpressions using [Extract Variable](https://refactoring.guru/extract-variable).
* If a comment explains a section of code, this section can be turned into a separate method via [Extract Method](https://refactoring.guru/extract-method). The name of the new method can be taken from the comment text itself, most likely.
* If a method has already been extracted, but comments are still necessary to explain what the method does, give the method a self-explanatory name. Use [Rename Method](https://refactoring.guru/rename-method) for this.
* If you need to assert rules about a state that’s necessary for the system to work, use [Introduce Assertion](https://refactoring.guru/introduce-assertion).

### Payoff

* Code becomes more intuitive and obvious.

![](https://refactoring.guru/images/refactoring/content/smells/comments-02.png?id=266f82bb7081957d409ae690c2c66483)

### When to Ignore

Comments can sometimes be useful:

* When explaining **why** something is being implemented in a particular way.
* When explaining complex algorithms (when all other methods for simplifying the algorithm have been tried and come up short).