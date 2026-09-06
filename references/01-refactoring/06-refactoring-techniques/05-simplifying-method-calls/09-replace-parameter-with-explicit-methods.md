# Replace Parameter with Explicit Methods

> Source: [https://refactoring.guru/replace-parameter-with-explicit-methods](https://refactoring.guru/replace-parameter-with-explicit-methods)

---

# Replace Parameter with Explicit Methods

### Problem

A method is split into parts, each of which is run depending on the value of a parameter.

### Solution

Extract the individual parts of the method into their own methods and call them instead of the original method.

Before

```
void setValue(String name, int value) {
  if (name.equals("height")) {
    height = value;
    return;
  }
  if (name.equals("width")) {
    width = value;
    return;
  }
  Assert.shouldNeverReachHere();
}
```

After

```
void setHeight(int arg) {
  height = arg;
}
void setWidth(int arg) {
  width = arg;
}
```

Before

```
void SetValue(string name, int value) 
{
  if (name.Equals("height")) 
  {
    height = value;
    return;
  }
  if (name.Equals("width")) 
  {
    width = value;
    return;
  }
  Assert.Fail();
}
```

After

```
void SetHeight(int arg) 
{
  height = arg;
}
void SetWidth(int arg) 
{
  width = arg;
}
```

Before

```
function setValue($name, $value) {
  if ($name === "height") {
    $this->height = $value;
    return;
  }
  if ($name === "width") {
    $this->width = $value;
    return;
  }
  assert("Should never reach here");
}
```

After

```
function setHeight($arg) {
  $this->height = $arg;
}
function setWidth($arg) {
  $this->width = $arg;
}
```

Before

```
def output(self, name):
    if name == "banner"
        # Print the banner.
        # ...
    if name == "info"
        # Print the info.
        # ...
```

After

```
def outputBanner(self):
    # Print the banner.
    # ...

def outputInfo(self):
    # Print the info.
    # ...
```

Before

```
 setValue(name: string, value: number): void {
  if (name.equals("height")) {
    height = value;
    return;
  }
  if (name.equals("width")) {
    width = value;
    return;
  }
  
}
```

After

```
setHeight(arg: number): void {
  height = arg;
}
setWidth(arg: number): number {
  width = arg;
}
```

### Why Refactor

A method containing parameter-dependent variants has grown massive. Non-trivial code is run in each branch and new variants are added very rarely.

### Benefits

* Improves code readability. It’s much easier to understand the purpose of `startEngine()` than `setValue("engineEnabled", true)`.

### When Not to Use

* Don’t replace a parameter with explicit methods if a method is rarely changed and new variants aren’t added inside it.

### How to Refactor

1. For each variant of the method, create a separate method. Run these methods based on the value of a parameter in the main method.
2. Find all places where the original method is called. In these places, place a call for one of the new parameter-dependent variants.
3. When no calls to the original method remain, delete it.

### Anti-refactoring

[Parameterize Method](https://refactoring.guru/parameterize-method)

### Similar refactorings

[Replace Conditional with Polymorphism](https://refactoring.guru/replace-conditional-with-polymorphism)

### Eliminates smell

[Switch Statements](https://refactoring.guru/smells/switch-statements)

[Long Method](https://refactoring.guru/smells/long-method)