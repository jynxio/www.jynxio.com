---
typora-root-url: ./..\..\image
---

# 链表

## 数组

在介绍链表之前，我们需要先了解一下数组。数组是一种非常方便的数据结构，我们可以通过 `[]` 语法来快速的访问数组中的元素，不过数组有 2 个明显的缺点：

- 数组的长度是固定的，如果我们需要变长的数组，那么问题就会变得棘手。
- 数组的增删成本很高，如果我们需要增加或移除数组的元素，那么我们就需要重排后续所有元素的位置。

幸运的是，在 JavaScript 中似乎不存在这 2 个问题，因为 JavaScript 中的数组是变长的，我们可以在不声明数组长度的情况下就创建数组，并任意的增加数组的长度，另外 JavaScript 也提供了 `Array.prototype.splice`  来帮助我们轻松的增删元素，而无需关注增删元素的实现细节。

不过，JavaScript 中的类型数组还是定长的，并且从 JavaScript 引擎的角度来看，所有的数组也都是定长的。另外 `Array.prototype.splice` 只是简化了增删操作，而没有优化增删操作，从 JavaScript 引擎的角度来看，增加或移除数组的元素仍然需要重排后续所有元素的位置。

## 链表

链表是节点的集合，节点是值与指针的集合，其中指针用于指向其它的节点，比如前一个节点或后一个节点。链表有许多种形式，本文将会介绍单向链表、双向链表、循环链表、有序链表。

相比于数组，链表的好处是其在增删元素时不需要重排后续元素的位置，并且链表可以任意的扩展自身的长度，链表的坏处是其不能直接访问目标位置的节点，如果链表想要访问某个节点，就必须从起点开始向后遍历，直至找到目标节点。

## 单向链表

单向链表的特点是它只能沿着一个方向来遍历节点，具体来说，单向链表只能沿着从头到尾的方向来遍历节点。

单向链表就像一列火车，火车由一个车头和零至多节车厢组成，车头可以通过其尾部的钩子来连接第一节车厢，车厢可以装载货物并用其尾部的钩子来连接下一节车厢。这列火车就代表单向链表，其中车头代表链表的 `head`，车厢代表链表的节点，车厢上的货物代表节点的数据，车厢尾部的钩子代表节点的指针，这个指针用来指向下一个节点。

![单向链表的结构](/algorithm-and-data-structure/linked-list/singly-linked-list-structure.png)

## 双向链表

双向链表的特点是它既能沿着从头到尾的方向来遍历节点，也能沿着从尾到头的方向来遍历节点，这是因为双向链表的节点同时具有指针 `next` 和指针 `prev`，其中前者用于指向后一个节点，后者用于指向前一个节点。

另外，我们还为这个双向链表添加了一个 `tail` 指针，它用来指向链表中的最后一个节点，当我们需要查找链表上的某个节点时，如果目标节点的序号大于 `size / 2`，那么我们就应该从尾部开始朝着头部方向去查找，否则我们就应该从头部开始朝着尾部方向去查找，这样可以减少遍历的次数。

> 你可以自由的决定是否为你的双向链表添加 `tail` 指针，因为 `tail` 指针不是双向链表的必需品。另外，其实你也可以给你的单向链表添加 `tail` 指针。

![双向链表的结构](/algorithm-and-data-structure/linked-list/doubly-linked-list-structure.png)

## 循环链表

循环链表的特点是其尾节点的指针会指向头节点。循环链表既可以基于单向链表来实现，也可以基于双向链表来实现。

![循环链表的结构](/algorithm-and-data-structure/linked-list/circular-linked-list-structure.png)

## 有序链表

有序链表的特点是其节点是按照顺序来排列的，具体来说，有序链表的节点们会根据自身的值与某种排序规律来进行排列，比如下图就是一个有序链表，这个链表中的节点是按照 `data` 值从小到大的顺序来排列的。

![有序链表的结构](/algorithm-and-data-structure/linked-list/ordered-linked-list-structure.png)

因为有序链表的节点的排列顺序是有要求的，所以我们还需要在插入新节点之前就计算出新节点的插入位置，为此我们可以通过遍历并比较链表上节点来找到合适的位置，再把新节点插入到这个位置上，此时有序链表的插入操作的时间复杂度是 `O(n)`。不过，我们还可以使用其它的方法来计算新节点的插入位置，比如二分查找，这样就可以将插入操作的时间复杂度降低到 `O(logn)`。

![有序链表插入节点的原理](/algorithm-and-data-structure/linked-list/ordered-linked-list-insert.png)

有序链表的优点是可以快速的移除极值节点，因为只需要移除头节点或尾节点即可，因此有序链表适用于那些需要频繁存取极值且不怎么需要存取中间值的场景。

有序链表可以基于单向链表、双向链表、循环链表或其它类型的链表来实现。

## 实现单向链表

### 方法和属性

我们实现的单向链表将会有以下方法和属性：

| 方法名                    | 描述                                                         |
| ------------------------- | ------------------------------------------------------------ |
| `getNodeByIndex( index )` | 获取序号为 `index` 的节点                                    |
| `getNodeByData( data )`   | 获取第一个值为 `data` 的节点                                 |
| `getIndexByData( data )`  | 获取第一个值为 `data` 的节点的序号                           |
| `remove( index )`         | 移除 `index` 号节点，然后返回这个被移除的节点                |
| `insert( index, data )`   | 在 `index` 位置插入一个值为 `data` 的新节点，然后返回更新后的链表 |
| `push()`                  | 在链表的末尾插入一个值为 `data` 的新节点，然后返回更新后的链表 |
| `unshift()`               | 在链表的头部插入一个值为 `data` 的新节点，然后返回更新后的链表 |
| `pop()`                   | 移除链表末尾的节点，然后返回这个被移除的节点                 |
| `shift()`                 | 移除链表头部的节点，然后返回这个被移除的节点                 |
| `toArray()`               | 沿着从头到尾的方向来将节点的值存入一个数组，然后返回这个数组 |
| `clear()`                 | 清空链表，然后返回更新后的链表                               |

| 属性名 | 描述       |
| ------ | ---------- |
| `size` | 节点的数量 |

注意事项：

1. 节点的序号是从零起算的，链表的 `head` 所指向的节点就是零号节点。
2. 上述所有方法的返回值都是一个 `{success, data}` 格式的对象，其中 `success` 的值为 `true` 或 `false`，它代表方法是否执行成功，仅当方法执行成功时才会返回有效的 `data` 字段，`data` 则代表该方法执行成功后的真正返回值，比如节点的序号、被移除的节点、更新后的链表等。

### 遍历、插入、移除节点

遍历、插入、移除节点是实现单向链表的主要难点。关于遍历节点，其具体实现如下。

```js
let current_node = head;

while ( current_node ) {

    console.log( current_node );
    
    current_node = current_node.next;
    
}
```

关于插入节点，其对应的方法是 `insert`、`push`、`unshift`，其中后两者都是基于 `insert` 来实现的，插入节点的核心逻辑如下。

![单向链表插入节点的原理](/algorithm-and-data-structure/linked-list/singly-linked-list-insert.png)

关于移除节点，其对应的方法是 `remove`、`pop`、`shift`，其中后两者都是基于 `remove` 来实现的，移除节点的核心逻辑如下。

![单向链表移除节点的原理](/algorithm-and-data-structure/linked-list/singly-linked-list-remove.png)

### 实现 SinglyNode

在正式开始实现 `SinglyLinkedList` 之前，我们需要先实现一个关于单向节点的类 `SinglyNode`，它用于构造具有 `data` 和 `next` 属性的对象，这可以让我们在实现链表的过程中更轻松、更清晰的创建节点。

```js
class SinglyNode {

    constructor ( data ) {

        this.data = data;
        this.next = undefined;

    }

}
```

### 实现 SinglyLinkedList

现在，我们可以开始实现单向链表了，简明的代码比啰嗦的语言更加易懂，所以请通过阅读下述代码来了解如何实现一个单向链表吧。

```js
class SinglyLinkedList {

    /**
     * @returns { Object } - SinglyLinkedList实例。
     */
    constructor() {

        this.size = 0;
        this.head = undefined;

    }

    /**
     * 获取序号为index的节点。
     * @param { number } index - 节点的序号，从零起算。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为节点对象，即SinglyNode实例。
     */
    getNodeByIndex ( index ) {

        if ( this.size === 0 ) return { success: false };                 // 链表无节点可查
        if ( index < 0 || index >= this.size ) return { success: false }; // index不合理

        let node = this.head;

        for ( let i = 0; i < index; i ++ ) node = node.next;

        return { success: true, data: node };

    }

    /**
     * 获取第一个值为data的节点。
     * @param { * } data - 节点的data属性的值。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为节点对象，即SinglyNode实例。
     */
    getNodeByData( data ) {

        if ( this.size === 0 ) return { success: false }; // 链表无节点可查

        let node = this.head;

        do {

            if ( node.data === data ) return { success: true, data: node };

        } while ( node = node.next );

        return { success: false };

    }

    /**
     * 获取第一个值为data的节点的序号。
     * @param { * } data - 节点的data属性的值。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为节点对象，即SinglyNode实例。
     */
    getIndexByData ( data ) {

        if ( this.size === 0 ) return { success: false }; // 链表无节点可查

        let index = 0;
        let node = this.head;

        do {

            if ( node.data === data ) return { success: true, data: index };

            index ++;

        } while ( node = node.next );

        return { success: false };

    }

    /**
     * 移除index号节点，然后返回这个被移除的节点。
     * @param { number } index - 节点的序号，从零起算。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为被移除的节点，即SinglyNode实例。
     */
    remove ( index ) {

        const { success: has_target_node, data: target_node } = this.getNodeByIndex( index );

        if ( ! has_target_node ) return { success: false };          // 目标位置无节点可删

        const { success: has_previous_node, data: previous_node } = this.getNodeByIndex( index - 1 );
        const { success: has_next_node, data: next_node } = this.getNodeByIndex( index + 1 );

        if ( has_target_node && has_previous_node && has_next_node ) // 有前有后
            previous_node.next = next_node;
        else if ( has_target_node && has_previous_node )             // 有前无后
            previous_node.next = undefined;
        else if ( has_target_node && has_next_node )                 // 无前有后
            this.head = next_node;
        else                                                         // 无前无后
            this.head = undefined;

        this.size --;

        return { success: true, data: target_node };

    }

    /**
     * 在index位置插入一个值为data的新节点，然后返回更新后的链表。
     * @param { number } index - 节点的序号，从零起算。
     * @param { * } data - 新节点的data属性的值。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为调用该方法的SinglyLinkedList实例。
     */
    insert ( index, data ) {

        if ( index < 0 || index > this.size ) return { success: false }; // index不合理

        const node = new SinglyNode( data );
        const { success: has_current_node, data: current_node } = this.getNodeByIndex( index );
        const { success: has_previous_node, data: previous_node } = this.getNodeByIndex( index - 1 );

        if ( has_current_node && has_previous_node ) {                   // 有前有后

            previous_node.next = node;
            node.next = current_node;

        } else if ( has_current_node && ! has_previous_node ) {          // 无前有后

            this.head = node;
            this.head.next = current_node;

        } else if ( ! has_current_node && has_previous_node ) {          // 有前无后

            previous_node.next = node;

        } else {                                                         // 无前无后

            this.head = node;

        }

        this.size ++;

        return { success: true, data: this };

    }

    /**
     * 在链表的末尾插入一个值为data的新节点，然后返回更新后的链表。
     * @param { * } data - 新节点的data属性的值。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为调用该方法的SinglyLinkedList实例。
     */
    push ( data ) {

        const response = this.insert( this.size, data );

        if ( ! response.success ) return { success: false };

        return { success: true, data: this };

    }

    /**
     * 移除链表末尾的节点，然后返回这个被移除的节点。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为被移除的节点，即SinglyNode实例。
     */
    pop () {

        const response = this.remove( this.size - 1 );

        if ( ! response.success ) return { success: false };

        return { success: true, data: response.data };

    }

    /**
     * 在链表的头部插入一个值为data的新节点，然后返回更新后的链表。
     * @param { * } data - 新节点的data属性的值。
     * @returns { Object }  - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为调用该方法的SinglyLinkedList实例。
     */
    unshift ( data ) {

        const response = this.insert( 0, data );

        if ( ! response.success ) return { success: false };

        return { success: true, data: this };

    }

    /**
     * 移除链表头部的节点，然后返回这个被移除的节点。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为被移除的节点，即SinglyNode实例。
     */
    shift () {

        const response = this.remove( 0 );

        if ( ! response.success ) return { success: false };

        return { success: true, data: response.data };

    }

    /**
     * 沿着从头到尾的方向来将节点的值存入一个数组，然后返回这个数组。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为有序的存储了所有节点的值的数组。
     */
    toArray () {

		let node = this.head;
		const result = { success: true, data: [] };

        while ( node ) {

            result.data.push( node.data );
            node = node.next;

        }

		return result;

    }

    /**
     * 清空链表，然后返回更新后的链表。
     * @returns { Object }  - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为调用该方法的SinglyLinkedList实例。
     */
    clear () {

        this.size = 0;
        this.head = undefined;

        return { success: true, data: this };

    }

}
```

## 实现双向链表

接下来，我们会实现一个名为 `DoublyLinkedList` 的类，它代表双向链表的构造器。双向链表应当继承单向链表的属性和方法，为此我们会令 `DoublyLinkedList` 继承 `SinglyLinkedList`。

相比于单向链表的节点，双向链表的节点拥有额外的 `prev` 指针，所以我们需要实现一个 `DoublyNode` 来替代 `SinglyNode`。我们既可以从头实现 `DoublyNode`，也可以在 `SinglyNode` 的基础上实现 `DoublyNode`，本文选择后者。

```js
class DoublyNode extends SinglyNode {

    constructor ( data ) {

        super( data );

        this.prev = undefined;

    }

}
```

如果我们插入或移除了节点，那么我们就需要更新相关节点的 `prev` 指针，为此我们需要重写与移除和插入节点相关的方法，即 `insert`和 `remove` 方法。

> 我们不需要重写 `push`、`pop`、`shift`、`unshift` 方法，因为它们是完全基于 `insert` 或 `remove` 来实现的。

另外，我们的双向链表还拥有 `tail` 指针，我们可以利用它来提升 `getNodeByIndex` 的效率，具体来说，当目标节点的序号大于 `size / 2` 时便从尾部开始向头部搜索，否则就从头部开始向尾部搜索，所以我们还应该重写 `getNodeByIndex` 方法。

最后，我们还要重写 `clear` 方法来让它可以重置 `tail` 指针。`DoublyLinkedList` 的实现代码如下。

```js
class DoublyLinkedList extends SinglyLinkedList {

    /**
     * @returns { Object } - SinglyLinkedList实例。
     */
    constructor () {

        super();

        this.tail = undefined;

    }

    /**
     * 获取序号为index的节点。
     * @param { number } index - 节点的序号，从零起算。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为节点对象，即SinglyNode实例。
     */
    getNodeByIndex ( index ) {

        if ( this.size === 0 ) return { success: false };                 // 链表无节点可查
        if ( index < 0 || index >= this.size ) return { success: false }; // index不合理

        let node, count, pointer;

        if ( index < this.size / 2 ) {

            node = this.head;
            count = index;
            pointer = "next";

        } else {

            node = this.tail;
            count = this.size - 1 - index;
            pointer = "prev";

        }

        while ( count -- ) node = node[ pointer ];

        return { success: true, data: node };

    }

    /**
     * 移除index号节点，然后返回这个被移除的节点。
     * @param { number } index - 节点的序号，从零起算。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为被移除的节点，即SinglyNode实例。
     */
    remove ( index ) {

        const { success: has_target_node, data: target_node } = this.getNodeByIndex( index );

        if ( ! has_target_node ) return { success: false };            // 目标位置无节点可删

        const { success: has_previous_node, data: previous_node } = this.getNodeByIndex( index - 1 );
        const { success: has_next_node, data: next_node } = this.getNodeByIndex( index + 1 );

        if ( has_target_node && has_previous_node && has_next_node ) { // 有前有后

            previous_node.next = next_node;
            next_node.prev = previous_node;

        } else if ( has_target_node && has_previous_node ) {           // 有前无后

            this.tail = previous_node;
            this.tail.next = undefined;

        } else if ( has_target_node && has_next_node ) {               // 无前有后

            this.head = next_node;
            this.head.prev = undefined;

        } else {                                                       // 无前无后

            this.head = this.tail = undefined;

        }

        this.size --;

        return { success: true, data: target_node };

    }

    /**
     * 在index位置插入一个值为data的新节点，然后返回更新后的链表。
     * @param { number } index - 节点的序号，从零起算。
     * @param { * } data - 新节点的data属性的值。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为调用该方法的SinglyLinkedList实例。
     */
    insert ( index, data ) {

        if ( index < 0 || index > this.size ) return { success: false }; // index不合理

        const node = new DoublyNode( data );
        const { success: has_current_node, data: current_node } = this.getNodeByIndex( index );
        const { success: has_previous_node, data: previous_node } = this.getNodeByIndex( index - 1 );

        if ( has_current_node && has_previous_node ) {                   // 有前有后

            previous_node.next = node;
            node.prev = previous_node;

            node.next = current_node;
            current_node.prev = node;

        } else if ( has_current_node && ! has_previous_node ) {          // 无前有后

            node.next = current_node;
            current_node.prev = node;

            this.head = node;

        } else if ( ! has_current_node && has_previous_node ) {          // 有前无后

            previous_node.next = node;
            node.prev = previous_node;

            this.tail = node;

        } else {                                                          // 无前无后

            this.head = node;
            this.tail = node;

        }

        this.size ++;

        return { success: true, data: this };

    }

    /**
     * 清空链表，然后返回更新后的链表。
     * @returns { Object }  - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为调用该方法的SinglyLinkedList实例。
     */
    clear () {

        this.size = 0;
        this.head = undefined;
        this.tail = undefined;

        return { success: true, data: this };

    }

}
```

## 实现循环链表

循环链表既可以基于单向链表来实现，也可以基于双向链表来实现。基于单向链表来实现的循环链表与单向链表的区别在于前者的尾节点的 `next` 指针会指向头节点，而不是 `undefined`。基于双向链表来实现的循环链表与双向链表的区别在于前者的尾节点的 `next` 指针会指向头节点，而不是 `undefined`，并且前者的头节点的 `prev` 指针会指向尾节点，而不是 `undefined`。

接下来我们会基于双向链表来实现循环链表，我们把它称为 `CircularLinkedList`，显然 `CircularLinkedList` 会继承 `DoublyLinkedList`，并且我们需要重写 `CircularLinkedList` 的 `insert` 和 `remove` 方法。最后的实现代码如下。

```js
class CircularLinkedList extends DoublyLinkedList {

    /**
     * @returns { Object } - SinglyLinkedList实例。
     */
    constructor () {

        super();

    }

    /**
     * 移除index号节点，然后返回这个被移除的节点。
     * @param { number } index - 节点的序号，从零起算。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为被移除的节点，即SinglyNode实例。
     */
    remove ( index ) {

        const { success: has_target_node, data: target_node } = this.getNodeByIndex( index );

        if ( ! has_target_node ) return { success: false };            // 目标位置无节点可删

        const { success: has_previous_node, data: previous_node } = this.getNodeByIndex( index - 1 );
        const { success: has_next_node, data: next_node } = this.getNodeByIndex( index + 1 );

        if ( has_target_node && has_previous_node && has_next_node ) { // 有前有后

            previous_node.next = next_node;
            next_node.prev = previous_node;

        } else if ( has_target_node && has_previous_node ) {           // 有前无后

            this.tail = previous_node;
            this.tail.next = this.head;
            this.head.prev = this.tail;

        } else if ( has_target_node && has_next_node ) {               // 无前有后

            this.head = next_node;
            this.head.prev = this.tail;
            this.tail.next = this.head;

        } else {                                                       // 无前无后

            this.head = this.tail = undefined;

        }

        this.size --;

        return { success: true, data: target_node };

    }

    /**
     * 在index位置插入一个值为data的新节点，然后返回更新后的链表。
     * @param { number } index - 节点的序号，从零起算。
     * @param { * } data - 新节点的data属性的值。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为调用该方法的SinglyLinkedList实例。
     */
    insert ( index, data ) {

        if ( index < 0 || index > this.size ) return { success: false }; // index不合理

        const node = new DoublyNode( data );
        const { success: has_current_node, data: current_node } = this.getNodeByIndex( index );
        const { success: has_previous_node, data: previous_node } = this.getNodeByIndex( index - 1 );

        if ( has_current_node && has_previous_node ) {                   // 有前有后

            previous_node.next = node;
            node.prev = previous_node;

            node.next = current_node;
            current_node.prev = node;

        } else if ( has_current_node && ! has_previous_node ) {          // 无前有后

            node.next = current_node;
            current_node.prev = node;

            this.head = node;
            this.head.prev = this.tail;
            this.tail.next = this.head;

        } else if ( ! has_current_node && has_previous_node ) {          // 有前无后

            previous_node.next = node;
            node.prev = previous_node;

            this.tail = node;
            this.tail.next = this.head;
            this.head.prev = this.tail;

        } else {                                                          // 无前无后

            this.head = node;
            this.tail = node;
            this.head.prev = this.tail;
            this.tail.next = this.head;

        }

        this.size ++;

        return { success: true, data: this };

    }

}
```

## 实现有序链表

有序链表是一种节点会按照某种规律来排列的链表，比如按照数值大小来排列、按照 Unicode 大小来排列或者按照其它规则来排列。在这里，我们将基于双向链表来实现一个有序链表，这个有序链表的节点将会按照数值从小到大的顺序来排列。我们之所以选用了双向链表，是因为我们实现的有序链表会用到 `prev` 和 `next` 指针，且又不会用到循环链表的“首位相连”的特性。

因为有序列表会自动的根据预定义的排列规则与新节点的值来决定新节点的插入位置，所以我们就不再需要在插入节点时指定插入的位置了，为此我们需要重写 `insert` 方法，令其只接受一个唯一的参数，这个参数用于设置新节点的 `data`。实现代码如下。

```js
class SortedLinkedList extends DoublyLinkedList {

    constructor () {

        super();

    }

    /**
     * 在index位置插入一个值为data的新节点，然后返回更新后的链表。
     * @param { number } number - 新节点的data属性的值。
     * @returns { Object } - {success, data}格式的对象，仅当success为true时，才代表执行成功，此时data为调用该方法的SinglyLinkedList实例。
     */
    insert ( number ) {

        if ( typeof( number ) !== "number" ) return { success: false }; // data不合理

        const insert_node = new DoublyNode( number );

        if ( this.size === 0 ) {

            this.head = this.tail = insert_node;
            this.size ++;

            return { success: true, data: this };

        }

        if ( number <= this.head.data ) {

            const first_node = insert_node;
            const second_node = this.head;

            first_node.next = second_node;
            second_node.prev = first_node;

            this.head = first_node;
            this.size ++;

            return { success: true, data: this };

        }

        if ( number > this.tail.data ) {

            const first_to_last_node = insert_node;
            const second_to_last_node = this.tail;

            second_to_last_node.next = first_to_last_node;
            first_to_last_node.prev = second_to_last_node;

            this.tail = first_to_last_node;
            this.size ++;

            return { success: true, data: this };

        }

        let current_node = this.head.next;

        while ( current_node ) {

            if ( number > current_node.data ) {

                current_node = current_node.next;

                continue;

            }

            const previous_node = current_node.prev;

            previous_node.next = insert_node;
            insert_node.prev = previous_node;

            insert_node.next = current_node;
            current_node.prev = insert_node;

            this.size ++;

            return { success: true, data: this };

        }

        return { success: false };

    }

}
```

另外，显然的是，有序链表不应该拥有 `push` 和 `unshift` 方法，所以我们需要禁用原型链上的 `push` 和 `unshift`。

```js
SortedLinkedList.prototype.push = undefined;
SortedLinkedList.prototype.unshift = undefined;
```

## 基于链表的栈

在这里，我们将会用双向链表来重新实现栈。如果可以基于已经实现了的双向链表来实现栈，那么就可以大大的简化栈的实现步骤。这里实现的栈将会拥有如下的方法和属性。

| 方法名            | 描述                                         |
| ----------------- | -------------------------------------------- |
| `push( element )` | 向栈顶添加一个元素，然后返回更新后的栈       |
| `pop()`           | 从栈顶移除一个元素，然后返回这个被移除的元素 |
| `clear()`         | 清空栈，然后返回更新后的栈                   |
| `peek()`          | 查询位于栈顶的元素                           |

| 属性名 | 描述       |
| ------ | ---------- |
| `size` | 元素的个数 |

本文之所以选用双向链表来实现栈，是因为如此实现的栈的 `push` 和 `pop` 方法的时间复杂度都会是 `O(1)`。具体来说，我们会使用双向链表的 `push` 和 `pop` 方法来实现栈的 `push` 和 `pop` 方法，得益于 `DoublyLinkedList` 的 `tail` 指针，`DoublyLinkedList` 的 `push` 和 `pop` 方法的时间复杂度都是 `O(1)`，所以基于 `DoublyLinkedList` 来实现的栈的 `push` 和 `pop` 方法的时间复杂度都将会是 `O(1)`。

实际上，我们也可以通过为 `SinglyLinkedList` 添加 `tail` 指针来将它的 `push` 和 `pop` 方法的时间复杂度降低到 `O(1)`，然后基于改造后的 `SinglyLinkedList` 来实现的栈的 `push` 和 `pop` 方法也将会是 `O(1)`。

> 在本博客的另一篇文章《栈》中，提到了一种基于对象来实现的栈，这种栈的 `push` 和 `pop` 方法的时间复杂度也是 `O(1)`。

基于 `DoublyLinkedList` 的栈的实现代码如下。

```js
class Stack {

    #elements;

    constructor () {

        this.#elements = new DoublyLinkedList();

    }

    push ( element ) {

        this.#elements.push( element );

        return this;

    }

    pop () {

        return this.#elements.pop().data.data;

    }

    clear () {

        this.#elements.clear();

        return this;

    }

    peek() {

        return this.#elements.getNodeByIndex( 0 ).data.data;

    }

    get size() {

        return this.#elements.size;

    }

}
```

## 基于链表的普通队列

在这里，我们将会用双向链表 `DoublyLinkedList` 来重新实现普通队列，选用 `DoublyLinkedList` 的原因与上文一致。这里实现的普通队列将会拥有如下的方法和属性。

| 方法名               | 描述                                         |
| -------------------- | -------------------------------------------- |
| `enqueue( element )` | 向队尾添加一个元素，然后返回更新后的队列     |
| `dequeue()`          | 从队首移除一个元素，然后返回这个被移除的元素 |
| `clear()`            | 清空队列，然后返回更新后的队列               |
| `peek()`             | 查询位于队首的元素                           |

| 属性名 | 描述       |
| ------ | ---------- |
| `size` | 元素的数量 |

基于 `DoublyLinkedList` 的普通队列的实现代码如下。

```js
class Queue {

    #elements;

    constructor () {
        
        this.#elements = new DoublyLinkedList();
        
    }

    enqueue ( element ) {

        this.#elements.push( element );

        return this;

    }

    dequeue () {

        return this.#elements.shift().data.data;

    }

    clear () {

        this.#elements.clear();

        return this;

    }

    peek () {

        return this.#elements.getNodeByIndex( 0 ).data.data;

    }

    get size () {

        return this.#elements.size;

    }

}
```

## 基于链表的双端队列

在这里，我们将会用双向链表 `DoublyLinkedList` 来重新实现双端队列，选用 `DoublyLinkedList` 的原因与上文一致。这里实现的双端队列将会拥有如下的方法和属性。

| 方法名                | 描述                                         |
| --------------------- | -------------------------------------------- |
| `addFront( element )` | 向队首添加一个元素，然后返回更新后的队列     |
| `addBack( element )`  | 向队尾添加一个元素，然后返回更新后的队列     |
| `removeFront()`       | 从队首移除一个元素，然后返回这个被移除的元素 |
| `removeBack()`        | 从队尾移除一个元素，然后返回这个被移除的元素 |
| `peekFront()`         | 查询位于队首的元素                           |
| `peekBack()`          | 查询位于队尾的元素                           |
| `clear()`             | 清空队列，然后返回更新后的队列               |

| 属性名 | 描述       |
| ------ | ---------- |
| `size` | 元素的数量 |

基于 `DoublyLinkedList` 的双端队列的实现代码如下。

```js
class Deque {

    #elements;

    constructor () {

        this.#elements = new DoublyLinkedList();

    }

    addFront ( element ) {

        this.#elements.unshift( element );

        return this;

    }

    addBack ( element ) {

        this.#elements.push( element );

        return this;

    }

    removeFront () {

        return this.#elements.shift().data.data;

    }

    removeBack () {

        return this.#elements.pop().data.data;

    }

    peekFront () {

        return this.#elements.getNodeByIndex( 0 ).data.data;

    }

    peekBack () {

        return this.#elements.getNodeByIndex( this.#elements.size - 1 ).data.data;

    }

    clear () {

        this.#elements.clear();

        return this;

    }

    get size () {

        return this.#elements.size;

    }

    print () {

        console.log( this.#elements.toArray().data );

    }

}
```

## 源码

本文已将实现链表的源码上传至该 [库](https://github.com/jynxio/leetcode-everyday) 的 [LinkedList.js](https://github.com/jynxio/leetcode-everyday/blob/main/LinkedList.js) 文件中。

