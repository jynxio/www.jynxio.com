---
title: "Avoid using TypeScript's Enums, use 'as const' instead"

abstract: "尽管这已是常识，但再讲一遍也不过时。另外，TypeScript 5.8 推出了一个新的规则，来鼓励你禁用 Enums。"

publishedDate: "2025-05-31T00:00:00+08:00"

updatedDate: "2025-05-31T00:00:00+08:00"

tags: ["TypeScript"]

hero: "hero.png"
---

TypeScript 的 Enums 是复杂的和不协调的，这种混乱时常让我感到烧脑，直至某天，我停了下来，然后开始怀疑「Enums 是不是不良特性」。

是的，Enums 是不良特性，因为 Enums 做的事，别的特性也能做，但 Enums 却额外的让人感到混乱。

## Enums 的混乱

Enums 是复杂的和不协调的，为什么？因为 Enums 的用法真的很多，而且 Numeric Enums 和 String Enums 的行为还有很多差别。

> TypeScript 将 Enums 分类为 Numeric Enums、String Enums、Heterogeneous Enums，其中的 Heterogeneous Enums 是前两者的混合物。

第一，Numeric Enums 有「自增」和「双向映射」，但 String Enums 没有：

```ts
/**
 * { "0": "Admin", "1": "Sales", "Admin": 0, "Sales": 1 }
 */
enum NumericRole {
  Admin, // 0
  Sales, // 1
}


/**
 * { "Admin": "admin", "Sales": "sales" }
 */
enum StringRole {
  Admin = 'admin', // "admin"
  Sales = 'sales', // "sales"
}
```

第二，在 Numeric Enums 中，互为逆映射的 2 个键值对是不对称，比如 `"Admin": 0` 的逆映射是 `"0": "Admin"` 而不是 `0: "Admin"`，这是因为 JavaScript Object 的键只接受 string 或 symbol。

第三，Heterogeneous Enums 也有自增和双向映射，但只有一部份：

```ts
/**
 * { "2": "Admin", "3": "Sales", Admin: 2, Sales: 3, Client: "Client" }
 */
enum HeterogeneousRole {
  Admin = 2,         // 2
  Sales,             // 3
  Client = "Client", // "Client"
}
```

第四，Enums 既是值，也是类型。如果你想取 `NumericRole` 的键的联合类型，那么 `NumericRole` 要作为值还是类型？取到的联合类型会有 2 个成员（`"Admin" | "Sales"`）还是 4 个成员（`"0" | "1" | "Admin" | "Sales"`）？

```ts
type K = keyof typeof NumericRole; // "Admin" | "Sales"
```

第五，如果用 Enums 来作为类型，那么类型会严格的过分，而且 Numeric Enums 和 String Enums 的严格程度还不一样：

```ts
// 🙋🏻 Correct
0 satisfies NumericRole.Admin;
1 satisfies NumericRole.Sales;

// 🙅🏻 Type Error
"admin" satisfies StringRole.Admin;
"sales" satisfies StringRole.Sales;
```

```ts
enum SameNumericRole { Admin, Sales }
enum SameStringRole { Admin = "admin", Sales = "sales" }

// 🙅🏻 Type Error
SameStringRole.Sales satisfies StringRole.Sales;
SameNumericRole.Admin satisfies NumericRole.Admin;
```

最后，还有 `const enums`，一个可被擦除的 Enums，库开发中的老陷阱。

## Enums 的上位替代

Enums 的上位替代就是对象常量，对象常量是指那些使用了类型断言 `as const` 的对象，就像下面这样：

```ts
const role = { admin: 0, sales: 1 } as const;
```

为什么是对象常量？因为对象常量有 Enums 的核心功能——存储常量的字典，而且还没有 Enums 的混乱，虽然少了很多特性，比如自增、双向映射、直接作为类型等，但这些特性本就是混乱之源。

```ts
enum Role { Admin, Sales };
const role = { admin: 0, sales: 1 } as const;

fetch(`/data?role=${role.admin}`); // 🙋🏻
fetch(`/data?role=${Role.Admin}`); // 🙅🏻
```

用对象常量，而不是 Enums，这已经是不言自明的常识了。

## 禁用 Enums：erasableSyntaxOnly

TypeScript 5.8 推出了一个新的规则 `erasableSyntaxOnly`，其字面意思就是「仅启用可擦除的语法」，它的作用是禁用掉那些会对值空间产生影响的特性，即 Enums、Namespaces、Classes。

```json
{
  "compilerOptions": {
    "erasableSyntaxOnly": true
  }
}
```

这代表了 TypeScript 官方的计划——在未来废除它们。
