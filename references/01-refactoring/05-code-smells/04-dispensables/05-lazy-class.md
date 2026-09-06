# Lazy Class

> Source: [https://refactoring.guru/smells/lazy-class](https://refactoring.guru/smells/lazy-class)

---

# Lazy Class

### Signs and Symptoms

Understanding and maintaining classes always costs time and money. So if a class doesn’t do enough to earn your attention, it should be deleted.

![](https://refactoring.guru/images/refactoring/content/smells/lazy-class-01.png?id=efec5911dfaaa3ba69d3eb4dab03fd3c)

### Reasons for the Problem

Perhaps a class was designed to be fully functional but after some of the refactoring it has become ridiculously small.

Or perhaps it was designed to support future development work that never got done.

### Treatment

* Components that are near-useless should be given the [Inline Class](https://refactoring.guru/inline-class) treatment.
* For subclasses with few functions, try [Collapse Hierarchy](https://refactoring.guru/collapse-hierarchy).

![](https://refactoring.guru/images/refactoring/content/smells/lazy-class-02.png?id=393302f2bd27ba0197660caea274ae23)

### Payoff

* Reduced code size.
* Easier maintenance.

### When to Ignore

* Sometimes a *Lazy Class* is created in order to delineate intentions for future development, In this case, try to maintain a balance between clarity and simplicity in your code.