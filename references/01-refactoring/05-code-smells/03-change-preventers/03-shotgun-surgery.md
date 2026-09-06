# Shotgun Surgery

> Source: [https://refactoring.guru/smells/shotgun-surgery](https://refactoring.guru/smells/shotgun-surgery)

---

# Shotgun Surgery

> *Shotgun Surgery* resembles [Divergent Change](https://refactoring.guru/smells/divergent-change) but is actually the opposite smell. *Divergent Change* is when many changes are made to a single class. *Shotgun Surgery* refers to when a single change is made to multiple classes simultaneously.

### Signs and Symptoms

Making any modifications requires that you make many small changes to many different classes.

![](https://refactoring.guru/images/refactoring/content/smells/shotgun-surgery-01.png?id=9cc1117a6d787364788e152a3adb6a53)

### Reasons for the Problem

A single responsibility has been split up among a large number of classes. This can happen after overzealous application of [Divergent Change](https://refactoring.guru/smells/divergent-change).

![](https://refactoring.guru/images/refactoring/content/smells/shotgun-surgery-02.png?id=48f8a4a0f17d112e02ae73bacaed43fa)

### Treatment

* Use [Move Method](https://refactoring.guru/move-method) and [Move Field](https://refactoring.guru/move-field) to move existing class behaviors into a single class. If there’s no class appropriate for this, create a new one.
* If moving code to the same class leaves the original classes almost empty, try to get rid of these now-redundant classes via [Inline Class](https://refactoring.guru/inline-class).

![](https://refactoring.guru/images/refactoring/content/smells/shotgun-surgery-03.png?id=cf013f14eb5cde98bd48595a1c9836a9)

### Payoff

* Better organization.
* Less code duplication.
* Easier maintenance.