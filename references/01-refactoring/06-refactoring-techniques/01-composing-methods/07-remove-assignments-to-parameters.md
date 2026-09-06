# Remove Assignments to Parameters

> Source: [https://refactoring.guru/remove-assignments-to-parameters](https://refactoring.guru/remove-assignments-to-parameters)

---

# Remove Assignments to Parameters

### Problem

Some value is assigned to a parameter inside method’s body.

### Solution

Use a local variable instead of a parameter.

Before

```
int discount(int inputVal, int quantity) {
  if (quantity > 50) {
    inputVal -= 2;
  }
  // ...
}
```

After

```
int discount(int inputVal, int quantity) {
  int result = inputVal;
  if (quantity > 50) {
    result -= 2;
  }
  // ...
}
```

Before

```
int Discount(int inputVal, int quantity) 
{
  if (quantity > 50) 
  {
    inputVal -= 2;
  }
  // ...
}
```

After

```
int Discount(int inputVal, int quantity) 
{
  int result = inputVal;
  
  if (quantity > 50) 
  {
    result -= 2;
  }
  // ...
}
```

Before

```
function discount($inputVal, $quantity) {
  if ($quantity > 50) {
    $inputVal -= 2;
  }
  ...
```

After

```
function discount($inputVal, $quantity) {
  $result = $inputVal;
  if ($quantity > 50) {
    $result -= 2;
  }
  ...
```

Before

```
def discount(inputVal, quantity):
    if quantity > 50:
        inputVal -= 2
    # ...
```

After

```
def discount(inputVal, quantity):
    result = inputVal
    if quantity > 50:
        result -= 2
    # ...
```

Before

```
discount(inputVal: number, quantity: number): number {
  if (quantity > 50) {
    inputVal -= 2;
  }
  // ...
}
```

After

```
discount(inputVal: number, quantity: number): number {
  let result = inputVal;
  if (quantity > 50) {
    result -= 2;
  }
  // ...
}
```

### Why Refactor

The reasons for this refactoring are the same as for [Split Temporary Variable](https://refactoring.guru/split-temporary-variable), but in this case we’re dealing with a parameter, not a local variable.

First, if a parameter is passed via reference, then after the parameter value is changed inside the method, this value is passed to the argument that requested calling this method. Very often, this occurs accidentally and leads to unfortunate effects. Even if parameters are usually passed by value (and not by reference) in your programming language, this coding quirk may alienate those who are unaccustomed to it.

Second, multiple assignments of different values to a single parameter make it difficult for you to know what data should be contained in the parameter at any particular point in time. The problem worsens if your parameter and its contents are documented but the actual value is capable of differing from what’s expected inside the method.

### Benefits

* Each element of the program should be responsible for only one thing. This makes code maintenance much easier going forward, since you can safely replace code without any side effects.
* This refactoring helps to extract [repetitive code to separate methods](https://refactoring.guru/extract-method).

### How to Refactor

1. Create a local variable and assign the initial value of your parameter.
2. In all method code that follows this line, replace the parameter with your new local variable.

### Similar refactorings

[Split Temporary Variable](https://refactoring.guru/split-temporary-variable)

### Helps other refactorings

[Extract Method](https://refactoring.guru/extract-method)