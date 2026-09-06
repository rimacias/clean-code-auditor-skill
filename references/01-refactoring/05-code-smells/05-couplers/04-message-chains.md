# Message Chains

> Source: [https://refactoring.guru/smells/message-chains](https://refactoring.guru/smells/message-chains)

---

# Message Chains

### Signs and Symptoms

In code you see a series of calls resembling `$a->b()->c()->d()`

![](https://refactoring.guru/images/refactoring/content/smells/message-chains-01.png?id=c290ab1d348b3e6ab500c0b949f3d3f8)

### Reasons for the Problem

A message chain occurs when a client requests another object, that object requests yet another one, and so on. These chains mean that the client is dependent on navigation along the class structure. Any changes in these relationships require modifying the client.

### Treatment

* To delete a message chain, use [Hide Delegate](https://refactoring.guru/hide-delegate).
* Sometimes it’s better to think of why the end object is being used. Perhaps it would make sense to use [Extract Method](https://refactoring.guru/extract-method) for this functionality and move it to the beginning of the chain, by using [Move Method](https://refactoring.guru/move-method).

![](https://refactoring.guru/images/refactoring/content/smells/message-chains-02.png?id=d348325f450e592900b1a4a2ed960b53)

### Payoff

* Reduces dependencies between classes of a chain.
* Reduces the amount of bloated code.

![](https://refactoring.guru/images/refactoring/content/smells/message-chains-03.png?id=e651ac11f057e3e2e7c7786fc4051a66)

### When to Ignore

* Overly aggressive delegate hiding can cause code in which it’s hard to see where the functionality is actually occurring. Which is another way of saying, avoid the [Middle Man](https://refactoring.guru/smells/middle-man) smell as well.