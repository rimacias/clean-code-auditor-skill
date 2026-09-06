# Temporary Field

> Source: [https://refactoring.guru/smells/temporary-field](https://refactoring.guru/smells/temporary-field)

---

# Temporary Field

### Signs and Symptoms

Temporary fields get their values (and thus are needed by objects) only under certain circumstances. Outside of these circumstances, they’re empty.

![](https://refactoring.guru/images/refactoring/content/smells/temporary-field-01.png?id=5e30a8144171693ee4894091762b9742)

### Reasons for the Problem

Oftentimes, temporary fields are created for use in an algorithm that requires a large amount of inputs. So instead of creating a large number of parameters in the method, the programmer decides to create fields for this data in the class. These fields are used only in the algorithm and go unused the rest of the time.

This kind of code is tough to understand. You expect to see data in object fields but for some reason they’re almost always empty.

![](https://refactoring.guru/images/refactoring/content/smells/temporary-field-02.png?id=2cf98e02ffb0c1d36a98d48ba7bc5c45)

### Treatment

* Temporary fields and all code operating on them can be put in a separate class via [Extract Class](https://refactoring.guru/extract-class). In other words, you’re creating a method object, achieving the same result as if you would perform [Replace Method with Method Object](https://refactoring.guru/replace-method-with-method-object).
* [Introduce Null Object](https://refactoring.guru/introduce-null-object) and integrate it in place of the conditional code which was used to check the temporary field values for existence.

![](https://refactoring.guru/images/refactoring/content/smells/temporary-field-03.png?id=cf0e1c1e2a19745d23ca9e1d917d45cc)

### Payoff

* Better code clarity and organization.