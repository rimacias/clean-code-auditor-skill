# Pull Up Constructor Body

> Source: [https://refactoring.guru/pull-up-constructor-body](https://refactoring.guru/pull-up-constructor-body)

---

# Pull Up Constructor Body

### Problem

Your subclasses have constructors with code that’s mostly identical.

### Solution

Create a superclass constructor and move the code that’s the same in the subclasses to it. Call the superclass constructor in the subclass constructors.

Before

```
class Manager extends Employee {
  public Manager(String name, String id, int grade) {
    this.name = name;
    this.id = id;
    this.grade = grade;
  }
  // ...
}
```

After

```
class Manager extends Employee {
  public Manager(String name, String id, int grade) {
    super(name, id);
    this.grade = grade;
  }
  // ...
}
```

Before

```
public class Manager: Employee 
{
  public Manager(string name, string id, int grade) 
  {
    this.name = name;
    this.id = id;
    this.grade = grade;
  }
  // ...
}
```

After

```
public class Manager: Employee 
{
  public Manager(string name, string id, int grade): base(name, id)
  {
    this.grade = grade;
  }
  // ...
}
```

Before

```
class Manager extends Employee {
  public function __construct($name, $id, $grade) {
    $this->name = $name;
    $this->id = $id;
    $this->grade = $grade;
  }
  // ...
}
```

After

```
class Manager extends Employee {
  public function __construct($name, $id, $grade) {
    parent::__construct($name, $id);
    $this->grade = $grade;
  }
  // ...
}
```

Before

```
class Manager(Employee):
    def __init__(self, name, id, grade):
        self.name = name
        self.id = id
        self.grade = grade
    # ...
```

After

```
class Manager(Employee):
    def __init__(self, name, id, grade):
        Employee.__init__(name, id)
        self.grade = grade
    # ...
```

Before

```
class Manager extends Employee {
  constructor(name: string, id: string, grade: number) {
    this.name = name;
    this.id = id;
    this.grade = grade;
  }
  // ...
}
```

After

```
class Manager extends Employee {
  constructor(name: string, id: string, grade: number) {
    super(name, id);
    this.grade = grade;
  }
  // ...
}
```

### Why Refactor

How is this refactoring technique different from [Pull Up Method](https://refactoring.guru/pull-up-method)?

1. In Java, subclasses can’t inherit a constructor, so you can’t simply apply [Pull Up Method](https://refactoring.guru/pull-up-method) to the subclass constructor and delete it after removing all the constructor code to the superclass. In addition to creating a constructor in the superclass it’s necessary to have constructors in the subclasses with simple delegation to the superclass constructor.
2. In C++ and Java (if you didn’t explicitly call the superclass constructor) the superclass constructor is automatically called prior to the subclass constructor, which makes it necessary to move the common code only from the beginning of the subclass constructors (since you won’t be able to call the superclass constructor from an arbitrary place in a subclass constructor).
3. In most programming languages, a subclass constructor can have its own list of parameters different from the parameters of the superclass. Therefore you should create a superclass constructor only with the parameters that it truly needs.

### How to Refactor

1. Create a constructor in a superclass.
2. Extract the common code from the beginning of the constructor of each subclass to the superclass constructor. Before doing so, try to move as much common code as possible to the beginning of the constructor.
3. Place the call for the superclass constructor in the first line in the subclass constructors.

### Similar refactorings

[Pull Up Method](https://refactoring.guru/pull-up-method)

### Eliminates smell

[Duplicate Code](https://refactoring.guru/smells/duplicate-code)