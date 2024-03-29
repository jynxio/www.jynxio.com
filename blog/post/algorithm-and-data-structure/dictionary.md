---
typora-root-url: ./..\..\image
---

# 字典

## 概述

字典是指用键值对来存储数据的数据结构，它又称为映射、符号表、关联数组，JavaScript 的普通对象 `{}` 就是字典。

> 字典有多种实现方式，比如可以使用树、二维数组、散列函数来实现，其中使用散列函数来实现的字典被称为散列表。

## 实现

我们实现的字典将会拥有以下方法和属性。

| 方法名              | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| `has( key )`        | 检查字典中是否存在键为 `key` 的键值对，然后返回一个代表其是否存在的布尔值 |
| `get( key )`        | 从字典中获取一个键为 `key` 的键值对的值                      |
| `set( key, value )` | 向字典添加一个键为 `key` 值为 `value` 的键值对（若已存在则修改该键值对），然后返回更新后的字典 |
| `delete( key )`     | 从字典中移除一个键为 `key` 的键值对，然后返回一个代表其是否移除成功的布尔值 |
| `toArray()`         | 按照键值对的插入顺序来将键值对以 `[key, value]` 的格式存入一个数组，然后返回这个数组 |
| `clear()`           | 清空字典，然后返回更新后的字典                               |

| 属性名 | 描述         |
| ------ | ------------ |
| `size` | 键值对的数量 |

在这里，我们选择使用双向链表 `DoublyLinkedList` 来存储字典中的键值对，`DoublyLinkedList` 是一个已经实现好的双向链表的类，你可以通过本博客的另一篇文章《链表》来了解它。

具体来说，我们会使用 2 个 `DoublyLinkedList` 来实现一个字典，其中一个用于存储键，另一个用于存储值，最后通过节点的序号来将两个双向链表关联在一起。

![两个双向链表](/algorithm-and-data-structure/dictionary/two-double-linked-list.png)

不过，这样实现的字典的性能不高，比如它的 `has`、`get`、`set`、`delete`、`toArray` 方法的时间复杂度都是 `O(n)`，并且它也需要占用比较多的内存空间。

最后，它的实现代码如下。

```js
class Dictionary {

    #key_table;
    #value_table;

    /**
     * @returns { Object } - Dictionary实例。
     */
    constructor () {

        this.#key_table = new DoublyLinkedList();
        this.#value_table = new DoublyLinkedList();

    }

    /**
     * 检查字典中是否存在键为key的键值对，然后返回一个代表其是否存在的布尔值。
     * @param { * } element - 键。
     * @returns { boolean } - 若该集合中存在键为key的键值对，则返回true，否则返回false。
     */
    has ( key ) {

        return this.#key_table.getNodeByData( key ).success;

    }

    /**
     * 从字典中获取一个键为key的键值对的值。
     * @param { * } key - 键。
     * @returns { * } - 键对应的值。
     */
    get ( key ) {

        const { success: has_key, data: index } = this.#key_table.getIndexByData( key );

        if ( ! has_key ) return;

        return this.#value_table.getNodeByIndex( index ).data.data;

    }

    /**
     * 向字典添加一个键为key值为value的键值对（若已存在则修改该键值对），然后返回更新后的字典。
     * @param { * } key - 键。
     * @param { * } value - 值。
     * @returns { Object } - 更新后的字典。
     */
    set ( key, value ) {

        const { success: has_key, data: index } = this.#key_table.getIndexByData( key );

        if ( has_key ) {

            this.#value_table.getNodeByIndex( index ).data.data = value;

            return this;

        }

        this.#key_table.push( key );
        this.#value_table.push( value );

        return this;

    }

    /**
     * 从字典中移除一个键为key的键值对，然后返回一个代表其是否移除成功的布尔值。
     * @param { * } key - 键。
     * @returns { boolean } - 若移除成功，则返回true，否则返回false。
     */
    delete ( key ) {

        const { success: has_key, data: index } = this.#key_table.getIndexByData( key );

        if ( ! has_key ) return false;

        this.#key_table.remove( index );
        this.#value_table.remove( index );

        return true;

    }

    /**
     * 按照键值对的插入顺序来将键值对以[key, value]的格式存入一个数组，然后返回这个数组。
     * @returns { Array } - 以[key, value]的格式来存储字典键值对的数组。
     */
    toArray () {

        const key_array = this.#key_table.toArray().data;
        const value_array = this.#value_table.toArray().data;

        return key_array.map( ( key, index ) => [ key, value_array[ index ] ] );

    }

    /**
     * 清空字典，然后返回更新后的字典。
     * @returns { Object } - 更新后的字典。
     */
    clear () {

        this.#key_table.clear();
        this.#value_table.clear();

        return this;

    }

    get size () {

        return this.#key_table.size;

    }

}
```

## Map 和 WeakMap

`Map` 是 ECMAScript 2015 的 API，它是比普通对象更加强大的字典，比如它可以使用任意数据类型的值来作为键、可以按照键值对的插入顺序来迭代、拥有更高的增删性能等，你可以通过阅读 [这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map) 来进一步了解这个 API。

另外，`WeakMap` 是一个类似于 `Map` 的 API，它同样源自于 ECMAScript 2015，它的特别之处在于只能使用复杂数据类型的值来作为键，并且它的键都是 “弱引用” 的，你可以通过阅读 [这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 来进一步了解这个 API。
