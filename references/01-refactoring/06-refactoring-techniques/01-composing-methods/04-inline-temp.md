# Inline Temp

> Source: [https://refactoring.guru/inline-temp](https://refactoring.guru/inline-temp)

---

# Inline Temp

### Problem

You have a temporary variable that’s assigned the result of a simple expression and nothing more.

### Solution

Replace the references to the variable with the expression itself.

Before

```
boolean hasDiscount(Order order) {
  double basePrice = order.basePrice();
  return basePrice > 1000;
}
```

After

```
boolean hasDiscount(Order order) {
  return order.basePrice() > 1000;
}
```

Before

```
bool HasDiscount(Order order)
{
  double basePrice = order.BasePrice();
  return basePrice > 1000;
}
```

After

```
bool HasDiscount(Order order)
{
  return order.BasePrice() > 1000;
}
```

Before

```
$basePrice = $anOrder->basePrice();
return $basePrice > 1000;
```

After

```
return $anOrder->basePrice() > 1000;
```

Before

```
def hasDiscount(order):
    basePrice = order.basePrice()
    return basePrice > 1000
```

After

```
def hasDiscount(order):
    return order.basePrice() > 1000
```

Before

```
hasDiscount(order: Order): boolean {
  let basePrice: number = order.basePrice();
  return basePrice > 1000;
}
```

After

```
hasDiscount(order: Order): boolean {
  return order.basePrice() > 1000;
}
```

### Why Refactor

Inline local variables are almost always used as part of [Replace Temp with Query](https://refactoring.guru/replace-temp-with-query) or to pave the way for [Extract Method](https://refactoring.guru/extract-method).

### Benefits

* This refactoring technique offers almost no benefit in and of itself. However, if the variable is assigned the result of a method, you can marginally improve the readability of the program by getting rid of the unnecessary variable.

### Drawbacks

* Sometimes seemingly useless temps are used to cache the result of an expensive operation that’s reused several times. So before using this refactoring technique, make sure that simplicity won’t come at the cost of performance.

### How to Refactor

1. Find all places that use the variable. Instead of the variable, use the expression that had been assigned to it.
2. Delete the declaration of the variable and its assignment line.

### Helps other refactorings

[Replace Temp with Query](https://refactoring.guru/replace-temp-with-query)

[Extract Method](https://refactoring.guru/extract-method)