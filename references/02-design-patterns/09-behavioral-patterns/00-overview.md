# Behavioral Patterns Overview

> Source: [https://refactoring.guru/design-patterns/behavioral-patterns](https://refactoring.guru/design-patterns/behavioral-patterns)

---

# Behavioral Design Patterns

Behavioral design patterns are concerned with algorithms and the assignment of responsibilities between objects.

[![Chain of Responsibility](https://refactoring.guru/images/patterns/cards/chain-of-responsibility-mini.png?id=36d85eba8d14986f053123de17aac7a7)
Chain of Responsibility

Lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.](https://refactoring.guru/design-patterns/chain-of-responsibility)
[![Command](https://refactoring.guru/images/patterns/cards/command-mini.png?id=b149eda017c0583c1e92343b83cfb1eb)
Command

Turns a request into a stand-alone object that contains all information about the request. This transformation lets you pass requests as a method arguments, delay or queue a request's execution, and support undoable operations.](https://refactoring.guru/design-patterns/command)
[![Iterator](https://refactoring.guru/images/patterns/cards/iterator-mini.png?id=76c28bb48f997b36965983dd2b41f02e)
Iterator

Lets you traverse elements of a collection without exposing its underlying representation (list, stack, tree, etc.).](https://refactoring.guru/design-patterns/iterator)
[![Mediator](https://refactoring.guru/images/patterns/cards/mediator-mini.png?id=a7e43ee8e17e4474737b1fcb3201d7ba)
Mediator

Lets you reduce chaotic dependencies between objects. The pattern restricts direct communications between the objects and forces them to collaborate only via a mediator object.](https://refactoring.guru/design-patterns/mediator)
[![Memento](https://refactoring.guru/images/patterns/cards/memento-mini.png?id=8b2ea4dc2c5d15775a654808cc9de099)
Memento

Lets you save and restore the previous state of an object without revealing the details of its implementation.](https://refactoring.guru/design-patterns/memento)
[![Observer](https://refactoring.guru/images/patterns/cards/observer-mini.png?id=fd2081ab1cff29c60b499bcf6a62786a)
Observer

Lets you define a subscription mechanism to notify multiple objects about any events that happen to the object they're observing.](https://refactoring.guru/design-patterns/observer)
[![State](https://refactoring.guru/images/patterns/cards/state-mini.png?id=f4018837e0641d1dade756b6678fd4ee)
State

Lets an object alter its behavior when its internal state changes. It appears as if the object changed its class.](https://refactoring.guru/design-patterns/state)
[![Strategy](https://refactoring.guru/images/patterns/cards/strategy-mini.png?id=d38abee4fb6f2aed909d262bdadca936)
Strategy

Lets you define a family of algorithms, put each of them into a separate class, and make their objects interchangeable.](https://refactoring.guru/design-patterns/strategy)
[![Template Method](https://refactoring.guru/images/patterns/cards/template-method-mini.png?id=9f200248d88026d8e79d0f3dae411ab4)
Template Method

Defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.](https://refactoring.guru/design-patterns/template-method)
[![Visitor](https://refactoring.guru/images/patterns/cards/visitor-mini.png?id=854a35a62963bec1d75eab996918989b)
Visitor

Lets you separate algorithms from the objects on which they operate.](https://refactoring.guru/design-patterns/visitor)