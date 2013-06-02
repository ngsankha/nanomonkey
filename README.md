# Nanomonkey

A JavaScript to JavaScript experimental compiler.

---
**Current Status:** Working on [spec](https://github.com/sankha93/nanomonkey/wiki/Spec).

---

The aim of this compiler is to take annotated JavaScript source and then output JavaScript. The role of this compiler will be to help developers catch bugs, both by detecting bugs during compilation and by inserting runtime checks that will be executed only in debug mode.

Example Input:

```javascript
/**
 * @precondition {y != 0}
 */
function divide(x, y) {
  return x / y;
}
```

Corresponding output:

```javascript
function divide(x, y) {
  if (y != 0) {
    throw new Error("Precondition failed: (y != 0)"); 
  }
  return x / y;
}
```

Original idea inspired from a [Mozilla student project](https://github.com/Yoric/Mozilla-Student-Projects/issues/40).

## Why Nanomonkey?

Because nano is an anagram of anno, and Nanomonkey works on annotated JavaScript.

## Contribute

Help is always welcome. Just contribute to the source (there is none now though) or help in writing the [spec](https://github.com/sankha93/nanomonkey/wiki/Spec).
