---
title: 手写符合 Promises/A+ Spec 的 Promise
abstract: 我一直都想知道 Promise 是怎么工作的，于是我去阅读了 Promises/A+ Spec，并实现了一个通过测试的 Polyfill，这让我很受益。
publishedDate: 2022-07-29T00:00:00+08:00
updatedDate: 2022-07-29T00:00:00+08:00
tags:
  - JavaScript
hero: hero.png
---

我一直想知道 Promise 究竟是怎么工作的，于是我去阅读了 [Promises/A+ Spec](https://github.com/promises-aplus/promises-spec)，并实现了一个通过 [Promises/A+ Tests](https://github.com/promises-aplus/promises-tests) 的 Polyfill —— [Inshin](https://github.com/jynxio/inshin)。

> Inshin 的读音（[ˈɪnʃɪn]）近似粤语的承诺（应承）一词。

这在当初只花费了几天时间，却让我受益至今。

## 源码

我将源码板书在此，也托管在 [这个仓库](https://github.com/jynxio/inshin)。

> 这种排版松散的编码风格来自 three.js，它很漂亮，我喜欢它，并且还专门定义了一套 [ESLint 规则](https://github.com/jynxio/loose-style-eslint)，直到我向 Prettier 屈服。

```js
const PENDING_STATE = "pending";
const FULFILLED_STATE = "fulfilled";
const REJECTED_STATE = "rejected";

/**
 * 通过 Promises/A+ 测试的 Promise polyfill。
 * @param   { Function } execute - 该入参等同于原生Promise的入参。
 * @returns { Object } - Inshin实例，等同于Promise实例。
 */
function Inshin ( execute ) {

    /* Inshin实例的内部数据。 */
    const self = this;

    self._state = PENDING_STATE;

    self._fulfilled_value = undefined;
    self._rejected_value  = undefined;

    self._fulfilled_events = [];
    self._rejected_events  = [];

    /*  */
    execute( resolve, reject );

    /**
     * resolve函数，用于敲定Inshin实例。
     * @param   { * } fulfilled_value Inshin实例的fulfilled值，代表敲定后的值。
     * @returns { undefined } - undefined。
     */
    function resolve ( fulfilled_value ) {

        if ( self._state !== PENDING_STATE ) return;

        self._state = FULFILLED_STATE;
        self._fulfilled_value = fulfilled_value;

        self._fulfilled_events.forEach( function ( handleThen ) {

            const microtask = _ => handleThen( self._fulfilled_value );

            globalThis.queueMicrotask( microtask );

        } );
    };

    /**
     * rejecte函数，用于拒绝Inshin实例。
     * @param   { * } rejected_value - Inshin实例的rejected值，代表被拒绝的原因。
     * @returns { undefined } - undefined。
     */
    function reject ( rejected_value ) {

        if ( self._state !== PENDING_STATE ) return;

        self._state = REJECTED_STATE;
        self._rejected_value = rejected_value;

        self._rejected_events.forEach( function ( handleThen ) {

            const microtask = _ => handleThen( self._rejected_value );

            globalThis.queueMicrotask( microtask );

        } );

    };

}

/**
 * then方法。
 * @param { Function } handleFulfilled - Inshin实例的fulfilled订阅函数。
 * @param { Function } handleRejected  - Inshin实例的rejected订阅函数。
 * @returns { Object } - 一个新的Inshin实例或一个新的thenable对象。
 */
Inshin.prototype.then = function then ( handleFulfilled, handleRejected ) {

    /*  */
    let inshinResolve;
    let inshinReject;

    const inshin = new Inshin( ( resolve, reject ) => {

        inshinResolve = resolve;
        inshinReject = reject;

    } );

    /*  */
    this._fulfilled_events.push( handleFulfilledAndInshin );

    if ( this._state === FULFILLED_STATE ) {

        const microtask = _ => handleFulfilledAndInshin( this._fulfilled_value );

        globalThis.queueMicrotask( microtask );

    }

    /**
     * handleFulfilled函数的代理者。
     * @param { * } fulfilled_value - Inshin实例的fulfilled值。
     * @returns { undefined } - undefined。
     */
    function handleFulfilledAndInshin ( fulfilled_value ) {

        if ( typeof handleFulfilled === "function" ) {

            let x;

            try {

                x = handleFulfilled( fulfilled_value );

            } catch ( error ) {

                inshinReject( error );

            }

            inshinResolutionProcedure( inshin, x );

        } else {

            inshinResolve( fulfilled_value );

        }

    }

    /* */
    this._rejected_events.push( handleRejectedAndInshin );

    if ( this._state === REJECTED_STATE ) {

        const microtask = _ => handleRejectedAndInshin( this._rejected_value );

        globalThis.queueMicrotask( microtask );

    }

    /**
     * handleRejected函数的代理者
     * @param { * } rejected_value - Inshin实例的rejected值。
     * @returns { undefined } - undefined。
     */
    function handleRejectedAndInshin ( rejected_value ) {

        if ( typeof handleRejected === "function" ) {

            let x;

            try {

                x = handleRejected( rejected_value );

            } catch ( error ) {

                inshinReject( error );

            }

            inshinResolutionProcedure( inshin, x );

        } else {

            inshinReject( rejected_value );

        }

    }

    /* [[Resolve]]( inshin, x ) */
    /**
     * The Promise Resolution Procedure，详见规范的2.3。
     * @param { Object } inshin - Inshin实例或thenable对象。
     * @param { * } x - handleFulfilled函数或handleRejected函数的返回值。
     * @returns { undefined } - undefine。
     */
    function inshinResolutionProcedure ( inshin, x ) {

        if ( x === null ) {

            inshinResolve( x );

            return;

        }

        if ( typeof x !== "object" && typeof x !== "function" ) {

            inshinResolve( x );

            return;

        }

        if ( x === inshin ) {

            inshinReject( new TypeError( "Chaining cycle detected for promise" ) );

            return;

        }

        if ( typeof x === "object" || typeof x === "function" ) {

            let then;

            try {

                then = x.then;

            } catch ( error ) {

                inshinReject( error );

            }

            if ( typeof then === "function" ) {

                let is_finish = false;

                const resolve = function resolve ( y ) {

                    if ( is_finish ) return;

                    is_finish = true;

                    inshinResolutionProcedure( inshin, y )

                };
                const reject = function reject ( r ) {

                    if ( is_finish ) return;

                    is_finish = true;

                    inshinReject( r )

                };

                try {

                    then.call( x, resolve, reject );

                } catch ( error ) {

                    if ( ! is_finish ) inshinReject( error );

                }

                return;

            }

            inshinResolve( x );

        }

    }

    /*  */
    return inshin;

}

module.exports = Inshin;
```

## 测试

如果你想知道自己的实现是否符合 Promises/A+ Spec，那么就用 [Promises/A+ Tests](https://github.com/promises-aplus/promises-tests)，这是 Promises/A+ 的测试套件。

如果你读不懂 Promises/A+ Tests 的用法，那么请参考 [Inshin 的 test.js 文件](https://github.com/jynxio/inshin/blob/main/test.js)。

## 使用

如果你需要 Promise 的 Polyfill，那么请使用社区的实现，比如 [core-js](https://github.com/zloirock/core-js)，而不要使用 Inshin，因为前者更加健壮。
