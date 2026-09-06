# Data Clumps

> Source: [https://refactoring.guru/smells/data-clumps](https://refactoring.guru/smells/data-clumps)

---

# Data Clumps

### Signs and Symptoms

Sometimes different parts of the code contain identical groups of variables (such as parameters for connecting to a database). These clumps should be turned into their own classes.

![](https://refactoring.guru/images/refactoring/content/smells/data-clumps-01.png?id=9d8a38ce942720cee728797eba695a2f)

### Reasons for the Problem

Often these data groups are due to poor program structure or "copypasta programming”.

If you want to make sure whether or not some data is a data clump, just delete one of the data values and see whether the other values still make sense. If this isn’t the case, this is a good sign that this group of variables should be combined into an object.

### Treatment

* If repeating data comprises the fields of a class, use [Extract Class](https://refactoring.guru/extract-class) to move the fields to their own class.
* If the same data clumps are passed in the parameters of methods, use [Introduce Parameter Object](https://refactoring.guru/introduce-parameter-object) to set them off as a class.
* If some of the data is passed to other methods, think about passing the entire data object to the method instead of just individual fields. [Preserve Whole Object](https://refactoring.guru/preserve-whole-object) will help with this.
* Look at the code used by these fields. It may be a good idea to move this code to a data class.

![](https://refactoring.guru/images/refactoring/content/smells/data-clumps-02.png?id=cfb0a8fa64a983473dd31527e28ae158)

### Payoff

* Improves understanding and organization of code. Operations on particular data are now gathered in a single place, instead of haphazardly throughout the code.
* Reduces code size.

![](https://refactoring.guru/images/refactoring/content/smells/data-clumps-03.png?id=c170bbdea77b7d4a26947ef328b70adc)

### When to Ignore

* Passing an entire object in the parameters of a method, instead of passing just its values (primitive types), may create an undesirable dependency between the two classes.