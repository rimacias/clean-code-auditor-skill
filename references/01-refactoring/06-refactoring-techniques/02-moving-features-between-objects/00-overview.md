# Moving Features between Objects Overview

> Source: [https://refactoring.guru/refactoring/techniques/moving-features-between-objects](https://refactoring.guru/refactoring/techniques/moving-features-between-objects)

---

# Moving Features between Objects

Even if you have distributed functionality among different classes in a less-than-perfect way, there’s still hope.

These refactoring techniques show how to safely move functionality between classes, create new classes, and hide implementation details from public access.

[Move Method](https://refactoring.guru/move-method)

**Problem:** A method is used more in another class than in its own class.

**Solution:** Create a new method in the class that uses the method the most, then move code from the old method to there. Turn the code of the original method into a reference to the new method in the other class or else remove it entirely.

[Move Field](https://refactoring.guru/move-field)

**Problem:** A field is used more in another class than in its own class.

**Solution:** Create a field in a new class and redirect all users of the old field to it.

[Extract Class](https://refactoring.guru/extract-class)

**Problem:** When one class does the work of two, awkwardness results.

**Solution:** Instead, create a new class and place the fields and methods responsible for the relevant functionality in it.

[Inline Class](https://refactoring.guru/inline-class)

**Problem:** A class does almost nothing and isn’t responsible for anything, and no additional responsibilities are planned for it.

**Solution:** Move all features from the class to another one.

[Hide Delegate](https://refactoring.guru/hide-delegate)

**Problem:** The client gets object B from a field or method of object А. Then the client calls a method of object B.

**Solution:** Create a new method in class A that delegates the call to object B. Now the client doesn’t know about, or depend on, class B.

[Remove Middle Man](https://refactoring.guru/remove-middle-man)

**Problem:** A class has too many methods that simply delegate to other objects.

**Solution:** Delete these methods and force the client to call the end methods directly.

[Introduce Foreign Method](https://refactoring.guru/introduce-foreign-method)

**Problem:** A utility class doesn’t contain the method that you need and you can’t add the method to the class.

**Solution:** Add the method to a client class and pass an object of the utility class to it as an argument.

[Introduce Local Extension](https://refactoring.guru/introduce-local-extension)

**Problem:** A utility class doesn’t contain some methods that you need. But you can’t add these methods to the class.

**Solution:** Create a new class containing the methods and make it either the child or wrapper of the utility class.