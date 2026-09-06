# Dispensables Overview

> Source: [https://refactoring.guru/refactoring/smells/dispensables](https://refactoring.guru/refactoring/smells/dispensables)

---

# Dispensables

A dispensable is something pointless and unneeded whose absence would make the code cleaner, more efficient and easier to understand.

[Comments](https://refactoring.guru/smells/comments)

A method is filled with explanatory comments.

[Duplicate Code](https://refactoring.guru/smells/duplicate-code)

Two code fragments look almost identical.

[Lazy Class](https://refactoring.guru/smells/lazy-class)

Understanding and maintaining classes always costs time and money. So if a class doesn’t do enough to earn your attention, it should be deleted.

[Data Class](https://refactoring.guru/smells/data-class)

A data class refers to a class that contains only fields and crude methods for accessing them (getters and setters). These are simply containers for data used by other classes. These classes don’t contain any additional functionality and can’t independently operate on the data that they own.

[Dead Code](https://refactoring.guru/smells/dead-code)

A variable, parameter, field, method or class is no longer used (usually because it’s obsolete).

[Speculative Generality](https://refactoring.guru/smells/speculative-generality)

There’s an unused class, method, field or parameter.