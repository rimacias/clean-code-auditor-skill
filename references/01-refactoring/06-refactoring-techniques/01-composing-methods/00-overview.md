# Composing Methods Overview

> Source: [https://refactoring.guru/refactoring/techniques/composing-methods](https://refactoring.guru/refactoring/techniques/composing-methods)

---

# Composing Methods

Much of refactoring is devoted to correctly composing methods. In most cases, excessively long methods are the root of all evil. The vagaries of code inside these methods conceal the execution logic and make the method extremely hard to understand—and even harder to change.

The refactoring techniques in this group streamline methods, remove code duplication, and pave the way for future improvements.

[Extract Method](https://refactoring.guru/extract-method)

**Problem:** You have a code fragment that can be grouped together.

**Solution:** Move this code to a separate new method (or function) and replace the old code with a call to the method.

[Inline Method](https://refactoring.guru/inline-method)

**Problem:** When a method body is more obvious than the method itself, use this technique.

**Solution:** Replace calls to the method with the method’s content and delete the method itself.

[Extract Variable](https://refactoring.guru/extract-variable)

**Problem:** You have an expression that’s hard to understand.

**Solution:** Place the result of the expression or its parts in separate variables that are self-explanatory.

[Inline Temp](https://refactoring.guru/inline-temp)

**Problem:** You have a temporary variable that’s assigned the result of a simple expression and nothing more.

**Solution:** Replace the references to the variable with the expression itself.

[Replace Temp with Query](https://refactoring.guru/replace-temp-with-query)

**Problem:** You place the result of an expression in a local variable for later use in your code.

**Solution:** Move the entire expression to a separate method and return the result from it. Query the method instead of using a variable. Incorporate the new method in other methods, if necessary.

[Split Temporary Variable](https://refactoring.guru/split-temporary-variable)

**Problem:** You have a local variable that’s used to store various intermediate values inside a method (except for cycle variables).

**Solution:** Use different variables for different values. Each variable should be responsible for only one particular thing.

[Remove Assignments to Parameters](https://refactoring.guru/remove-assignments-to-parameters)

**Problem:** Some value is assigned to a parameter inside method’s body.

**Solution:** Use a local variable instead of a parameter.

[Replace Method with Method Object](https://refactoring.guru/replace-method-with-method-object)

**Problem:** You have a long method in which the local variables are so intertwined that you can’t apply *Extract Method*.

**Solution:** Transform the method into a separate class so that the local variables become fields of the class. Then you can split the method into several methods within the same class.

[Substitute Algorithm](https://refactoring.guru/substitute-algorithm)

**Problem:** So you want to replace an existing algorithm with a new one?

**Solution:** Replace the body of the method that implements the algorithm with a new algorithm.