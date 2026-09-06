# Introduce Parameter Object

> Source: [https://refactoring.guru/introduce-parameter-object](https://refactoring.guru/introduce-parameter-object)

---

# Introduce Parameter Object

### Problem

Your methods contain a repeating group of parameters.

### Solution

Replace these parameters with an object.

Before

![Introduce Parameter Object - Before](https://refactoring.guru/images/refactoring/diagrams/Introduce Parameter Object - Before.png?id=023aa35781e4c8d16e0faf7172646d1e)

After

![Introduce Parameter Object - After](https://refactoring.guru/images/refactoring/diagrams/Introduce Parameter Object - After.png?id=b5ed29b5678759399a83c229b1837730)

### Why Refactor

Identical groups of parameters are often encountered in multiple methods. This causes code duplication of both the parameters themselves and of related operations. By consolidating parameters in a single class, you can also move the methods for handling this data there as well, freeing the other methods from this code.

### Benefits

* More readable code. Instead of a hodgepodge of parameters, you see a single object with a comprehensible name.
* Identical groups of parameters scattered here and there create their own kind of code duplication: while identical code isn’t being called, identical groups of parameters and arguments are constantly encountered.

### Drawbacks

* If you move only data to a new class and don’t plan to move any behaviors or related operations there, this begins to smell of a [Data Class](https://refactoring.guru/smells/data-class).

### How to Refactor

1. Create a new class that will represent your group of parameters. Make the class immutable.
2. In the method that you want to refactor, use [Add Parameter](https://refactoring.guru/add-parameter), which is where your parameter object will be passed. In all method calls, pass the object created from old method parameters to this parameter.
3. Now start deleting old parameters from the method one by one, replacing them in the code with fields of the parameter object. Test the program after each parameter replacement.
4. When done, see whether there’s any point in moving a part of the method (or sometimes even the whole method) to a parameter object class. If so, use [Move Method](https://refactoring.guru/move-method) or [Extract Method](https://refactoring.guru/extract-method).

### Similar refactorings

[Preserve Whole Object](https://refactoring.guru/preserve-whole-object)

### Eliminates smell

[Long Parameter List](https://refactoring.guru/smells/long-parameter-list)

[Data Clumps](https://refactoring.guru/smells/data-clumps)

[Primitive Obsession](https://refactoring.guru/smells/primitive-obsession)

[Long Method](https://refactoring.guru/smells/long-method)