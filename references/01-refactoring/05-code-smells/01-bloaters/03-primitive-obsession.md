# Primitive Obsession

> Source: [https://refactoring.guru/smells/primitive-obsession](https://refactoring.guru/smells/primitive-obsession)

---

# Primitive Obsession

### Signs and Symptoms

* Use of primitives instead of small objects for simple tasks (such as currency, ranges, special strings for phone numbers, etc.)
* Use of constants for coding information (such as a constant `USER_ADMIN_ROLE = 1` for referring to users with administrator rights.)
* Use of string constants as field names for use in data arrays.

![](https://refactoring.guru/images/refactoring/content/smells/primitive-obsession-01.png?id=73e1c5b08ea68a7ad7a66832644e6696)

### Reasons for the Problem

Like most other smells, primitive obsessions are born in moments of weakness. “Just a field for storing some data!” the programmer said. Creating a primitive field is so much easier than making a whole new class, right? And so it was done. Then another field was needed and added in the same way. Lo and behold, the class became huge and unwieldy.

Primitives are often used to “simulate” types. So instead of a separate data type, you have a set of numbers or strings that form the list of allowable values for some entity. Easy-to-understand names are then given to these specific numbers and strings via constants, which is why they’re spread wide and far.

Another example of poor primitive use is field simulation. The class contains a large array of diverse data and string constants (which are specified in the class) are used as array indices for getting this data.

### Treatment

* If you have a large variety of primitive fields, it may be possible to logically group some of them into their own class. Even better, move the behavior associated with this data into the class too. For this task, try [Replace Data Value with Object](https://refactoring.guru/replace-data-value-with-object).

  ![](https://refactoring.guru/images/refactoring/content/smells/primitive-obsession-02.png?id=69dfd06eec8d6053e9d88c03ecc78044)
* If the values of primitive fields are used in method parameters, go with [Introduce Parameter Object](https://refactoring.guru/introduce-parameter-object) or [Preserve Whole Object](https://refactoring.guru/preserve-whole-object).
* When complicated data is coded in variables, use [Replace Type Code with Class](https://refactoring.guru/replace-type-code-with-class), [Replace Type Code with Subclasses](https://refactoring.guru/replace-type-code-with-subclasses) or [Replace Type Code with State/Strategy](https://refactoring.guru/replace-type-code-with-state-strategy).
* If there are arrays among the variables, use [Replace Array with Object](https://refactoring.guru/replace-array-with-object).

![](https://refactoring.guru/images/refactoring/content/smells/primitive-obsession-03.png?id=ab0a8c7b6188265bb9890424e679af2f)

### Payoff

* Code becomes more flexible thanks to use of objects instead of primitives.
* Better understandability and organization of code. Operations on particular data are in the same place, instead of being scattered. No more guessing about the reason for all these strange constants and why they’re in an array.
* Easier finding of duplicate code.