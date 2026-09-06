# Decompose Conditional

> Source: [https://refactoring.guru/decompose-conditional](https://refactoring.guru/decompose-conditional)

---

# Decompose Conditional

### Problem

You have a complex conditional (`if-then`/`else` or `switch`).

### Solution

Decompose the complicated parts of the conditional into separate methods: the condition, `then` and `else`.

Before

```
if (date.before(SUMMER_START) || date.after(SUMMER_END)) {
  charge = quantity * winterRate + winterServiceCharge;
}
else {
  charge = quantity * summerRate;
}
```

After

```
if (isSummer(date)) {
  charge = summerCharge(quantity);
}
else {
  charge = winterCharge(quantity);
}
```

Before

```
if (date < SUMMER_START || date > SUMMER_END) 
{
  charge = quantity * winterRate + winterServiceCharge;
}
else 
{
  charge = quantity * summerRate;
}
```

After

```
if (isSummer(date))
{
  charge = SummerCharge(quantity);
}
else 
{
  charge = WinterCharge(quantity);
}
```

Before

```
if ($date->before(SUMMER_START) || $date->after(SUMMER_END)) {
  $charge = $quantity * $winterRate + $winterServiceCharge;
} else {
  $charge = $quantity * $summerRate;
}
```

After

```
if (isSummer($date)) {
  $charge = summerCharge($quantity);
} else {
  $charge = winterCharge($quantity);
}
```

Before

```
if date.before(SUMMER_START) or date.after(SUMMER_END):
    charge = quantity * winterRate + winterServiceCharge
else:
    charge = quantity * summerRate
```

After

```
if isSummer(date):
    charge = summerCharge(quantity)
else:
    charge = winterCharge(quantity)
```

Before

```
if (date.before(SUMMER_START) || date.after(SUMMER_END)) {
  charge = quantity * winterRate + winterServiceCharge;
}
else {
  charge = quantity * summerRate;
}
```

After

```
if (isSummer(date)) {
  charge = summerCharge(quantity);
}
else {
  charge = winterCharge(quantity);
}
```

### Why Refactor

The longer a piece of code is, the harder it’s to understand. Things become even more hard to understand when the code is filled with conditions:

* While you’re busy figuring out what the code in the `then` block does, you forget what the relevant condition was.
* While you’re busy parsing `else`, you forget what the code in `then` does.

### Benefits

* By extracting conditional code to clearly named methods, you make life easier for the person who’ll be maintaining the code later (such as you, two months from now!).
* This refactoring technique is also applicable for short expressions in conditions. The string `isSalaryDay()` is much prettier and more descriptive than code for comparing dates.

### How to Refactor

1. Extract the conditional to a separate method via [Extract Method](https://refactoring.guru/extract-method).
2. Repeat the process for the `then` and `else` blocks.

### Eliminates smell

[Long Method](https://refactoring.guru/smells/long-method)