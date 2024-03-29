---
typora-root-url: ./..\..\image
---

# 栈

## 概念

栈是一种遵从后进先出（LIFO）原则的有序集合，“后进先出”是指最先入栈的数据会最后出栈、最后入栈的数据会最先出栈。

举例来说，筒装的薯片只有一个开口，薯片只能从这一个开口进入，也只能从这一个开口离开，先入筒的薯片会被放在下面，后入筒的薯片会被放在上面，当我们要把薯片从筒中拿出来时，由于后入筒的薯片更靠近开口，所以后入筒的薯片会比先入筒的薯片更早出筒，而这就是后进先出，其中薯片筒代表栈，薯片代表数据。

事件循环的调用栈、浏览器的后退、编辑器的撤回就是使用栈这一数据结构来实现的。

## 实现基于数组的栈

我们将基于 JavaScript 的数组来实现栈这一数据结构，它将拥有下述方法和属性：

| 方法名 | 描述                                         |
| ------ | -------------------------------------------- |
| push   | 向栈顶添加一个至多个元素，然后返回更新后的栈 |
| pop    | 从栈顶移除一个元素，然后返回这个元素         |
| clear  | 清空栈，然后返回更新后的栈                   |
| peek   | 查询位于栈顶的元素                           |

| 属性名 | 描述       |
| ------ | ---------- |
| size   | 元素的数量 |

由于它的实现非常简单，所以我们直接来看它的实现代码吧。

```js
class Stack {
    
    #elements = [];
    
    constructor( ... elements ) {
        
        this.push( ... elements );
        
    }
    
	push( ... elements ) {
        
		this.size = this.#elements.push( ... elements );
        
        return this;
        
    }
    
    pop() {
       
        if ( this.size ) this.size --;

        return this.#elements.pop();
        
    }
    
    clear() {
        
		this.size = 0;
        
        return this.#elements = [];
        
    }
    
    peek() {
        
        return this.#elements.slice( - 1 )[ 0 ];
        
    }
    
}
```

## 实现基于对象的栈

我们将基于 JavaScript 的普通对象来实现栈这一数据结构，它拥有和上文所述一样的方法，由于它的实现也非常简单，所以我们直接来看它的实现代码吧。

```js
class Stack {

    #elements = {};
    
 	constructor( ... elements ) {
     
        this.size = 0;
        this.push( ... elements );
        
    }
    
    push( ... elements ) {
        
        elements.forEach( ( element, index ) => {
            
            this.#elements[ this.size + index ] = element;
            
        } );
        
        this.size += elements.length;
        
        return this;
        
    }
    
    pop() {

        if ( ! this.size ) return;
        
        this.size --;
        
		const element = this.#elements[ this.size ];

        delete this.#elements[ this.size ];
        
        return element;
        
    }
    
    clear() {
        
		this.size = 0;
        
        return this.#elements = {};
        
    }
    
    peek() {
        
        return this.#elements[ this.size - 1 ];
        
    }
    
}
```

## 用栈解决问题

### 十进制转二进制

十进制转二进制有这样一个规律：将一个十进制数不断的除以 2 来获得整数商和整数余，直至商数为 0 为止，然后按照计算的先后顺序来将每一轮计算得到的余数依次压入栈中，最后以连接字符串的形式来连接栈顶至栈底的数字就能得到转换后的二进制数了。将十进制数 10 转换为二进制数的过程就如下图所示。

![十进制转二进制的原理](/algorithm-and-data-structure/stack/decimal-to-binary.png)

易得，该公式的实现代码如下。

```js
function decimalTobinary( decimal_number ) {
    
    let quotient = decimal_number;
    const remainder_stack = new Stack(); // Stack是由前文实现的
    
	do {
        
        const remainder = quotient % 2;
        
		remainder_stack.push( remainder );
        quotient = Math.floor( quotient / 2 );
        
    } while ( quotient )
        
    let binary_string = "";
    
    while ( remainder_stack.size ) {
        
        binary_string += remainder_stack.pop();
        
    }
    
    return binary_string;
    
}
```

### 十进制转任意进制

我们可以修改之前的代码，来实现一个将十进制转换为 2～36 进制的函数，需要修改的地方只有 2 处：

- 将除数由 2 改为 base，其中 base 代表进制数。
- 如果余数大于 9，则开始使用大些阿拉伯字母来替代余数，比如 A 代表 10、B 代表 11、...、Z 代表 35。

将十进制数 65432 转换为十六进制数的过程就如下图所示。

![十进制转十六进制](/algorithm-and-data-structure/stack/decimal-to-hex.png)

该公式的实现代码如下：

```js
function decimalToAnyBase( decimal_number, base ) {
    
    let quotient = decimal_number;
    const remainder_stack = new Stack(); // Stack是由前文实现的
    
	do {
        
        let remainder = quotient % base;
        
        if ( remainder >= 10 ) remainder = String.fromCodePoint( remainder - 10 + 0x41 );
        
		remainder_stack.push( remainder );
        quotient = Math.floor( quotient / base );
        
	} while ( quotient )
        
    let binary_string = "";
    
    while ( remainder_stack.size ) {
        
        binary_string += remainder_stack.pop();
        
    }
    
    return binary_string;
    
}
```

