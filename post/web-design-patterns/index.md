---
title: "Web 开发的设计模式"

abstract: "设计模式是编程的公式，我将那些学到的东西写在这里，作为 Cheatsheet。"

publishedDate: "2022-10-31T00:00:00+08:00"

updatedDate: "2025-05-10T00:00:00+08:00"

tags: ["JavaScript", "React"]

hero: "hero.png"
---

设计模式是编程的公式，我将那些学到的东西写在这里，作为 Cheatsheet。

## 模块模式

在 JavaScript 中，模块模式（Module Pattern）是开箱即用的，ES Modules 就是模块模式的产物。

## 原型模式

在 JavaScript 中，原型模式（Prototype Pattern）是开箱即用的，原型链就是原型模式的产物，你可以在 [这里](https://weizmangal.com/ProtoTree/) 找到完整原型链。

## 工厂模式

在 JavaScript 中，工厂模式（Factory Pattern）就是使用函数来封装数据的生产过程，以便于让调用者只关注生产的结果。

工厂函数应当被设计成普通函数，而不能被设计成构造函数，因为 JavaScript 的 `new` 会给调用者增加心智负担。

```ts
const user1 = createUser('Alice');
const user2 = createUser('Bob', 'admin');

function createUser(name: string, role: 'guest' | 'admin' = 'guest') {
  return {
    name: name,
    role: role,
    get canAccess() {
      return this.role === 'admin';
    },
  };
}
```

## 享元模式

享元模式（Flyweight Pattern）：通过共享相似的内容来降低内存占用和计算负荷。

```js
import TreeModel from 'somewhere';

const createTreeModel = (function factory() {
  const cache = new Map();

  return (x, y, treeName) => {
    if (!cache.has(treeName)) {
      const model = new TreeModel(treeName); // Expensive recalculations
      cache.set(treeName, model);
    }

    return { x, y, model: cache.get(treeName) };
  };
})();

const treeModels = [];
const treeNames = ['oak', 'elm', 'fir', 'ash'];

for (let i = 0; i < 100000; i++) {
  const x = Math.random() * 1000;
  const y = Math.random() * 1000;
  const i = Math.floor(Math.random() * treeNames.length);
  const treeName = treeNames[i];

  treeModels.push(createTreeModel(x, y, treeName));
}
```

## 中介者模式

中介者模式（Mediator Pattern）：使用中介者来管理组件之间的通信以降低组件之间的耦合，并且由于通信逻辑都被聚合在了一起所以更好维护，缺点则是增加了复杂度。

比如 MVC 框架就使用了中介者模式，其中 C（Controller）是中介者，它负责管理 V（View）和 M（Model）之间的通信。再比如，聊天服务器是网友之间的中介者，塔台是飞机之间的中介者，智能家居的中控系统是智能设备之间的中介者。

```js
class User {
  constructor(name) {
    this.name = name;
    this.uuid = crypto.randomUUID();
    this.chartroom = undefined;
  }

  send(msg, to) {
    this.chatroom.send(msg, this.uuid, to);
  }

  receive(msg) {
    alert(msg);
  }
}

class Chatroom {
  constructor() {
    this.users = new Map();
  }

  register(user) {
    user.chartroom = this;
    this.users.set(user.uuid, user);
    return this;
  }

  send(msg, from, to) {
    // 💡 Complex logic can be inserted here (e.g., authorization, message formatting, user status checks).
    const sender = this.users.get(from);
    const newMsg = `message from ${sender.name}: ${msg}`;
    const receivers = to
      ? [this.users.get(to)] // Private message
      : this.users.filter(user => user.uuid !== from); // Broadcast to all other users

    receivers.forEach(item => item.receive(newMsg));
  }
}

const josh = new User('Josh');
const matt = new User('Matt');
const jynx = new User('Jynx');
const chatroom = new Chatroom();

chatroom.register(josh).register(matt).register(jynx);
jynx.send('Hello world!');

// -> (to josh) message from jynx: Hello world!
// -> (to matt) message from jynx: Hello world!
```

## 观察者模式

观察者模式（Observer Pattern）：在组件之间建立依赖关系，一旦上游组件更新了，就通知所有下游组件。

比如 Vue 3 的 `computed` 和 Solid 的 `createComputed` 就采用了观察者模式。

```js
class Observable {
  constructor() {
    this.observers = new Set();
  }

  subscribe(observer) {
    this.observers.add(observer);
  }

  unsubscribe(observer) {
    this.observers.delete(observer);
  }

  notify(data) {
    this.observers.forEach(item => item.update(data));
  }
}

class Observer {
  update(date) {}
}

const observable = new Observable();
const observerA = new Observer();
const observerB = new Observer();

observable.subscribe(observerA);
observable.subscribe(observerB);
observable.notify('good news everyone!');
```

## 代理模式

代理模式（Proxy Pattern）：通过给目标安装拦截器来施加更多的控制。在 JavaScript 中，我们可以用 `Proxy & Reflect` 来实现代理模式。as

比如，我们可以使用代理模式来实现值空间类型检查。

```js
const person = new Proxy(
  { name: 'Jynxio' },
  {
    set(target, prop, value, receiver) {
      if (prop === 'name' && typeof value !== 'string') return false;

      return Reflect.set(target, prop, value, receiver);
    },
  },
);
```

## 提供者模式

比如 React 的 Context 和 Vue 的 Provide 就用了提供者模式（Provider Pattern），它们被用来解决 Prop Drilling 问题。

```vue
// Ancestor.vue
<script setup>
const theme = ref('dark');
const toggle = _ => (theme.value = theme.value === 'dark' ? 'light' : 'dark');

provide('theme', { theme: readonly(theme), toggle });
</script>

<template>
  <Child />
</template>

// Descendant.vue
<script setup>
const { theme, toggle } = inject('theme');
</script>

<template>
  <button @click="toggle">{{ theme }}</button>
</template>
```

## 混合模式

混合模式（Mixin Pattern）：通过组合而非继承的方式来让组件们共享 Mixin 对象的方法，从而既实现了复用又避免了来自继承的复杂性，其中 Mixin 对象是共享功能的提供商。

在 JavaScript 中，混合模式就是简单的将一些方法拷贝到另一个对象或对象的原型链中去。

```js
class Person {
  constructor(name) {
    this.name = name;
  }
}

class Robot {
  constructor(name) {
    this.name = name;
  }
}

const speakerMixin = { speak() {} };
const moverMixin = { walk() {}, run() {} };

Object.assign(Robot.prototype, speakerMixin);
Object.assign(Person.prototype, speakerMixin, moverMixin);
```

## 命令模式

命令模式（Command Pattern）：让通信双方使用指令来通信，而不是让调用者直接调用接收者的方法，以解耦双方的交互。并且还可以扩展出更高级的能力，比如通过将指令存储在栈中来实现撤销和前进功能、通过组合多个指令和实现复合动作。

在命令模式中，有 3 个不可或缺的角色，分别是：调用者（Invoker）、接收者（Receiver）、指令（Command）。

下面是一个用 React 实现的简易编辑器，它可以编辑、重做、撤回。

```jsx
// Receiver
class TextEditor {
  constructor() {
    this.text = '';
  }

  getText() {
    return this.text;
  }

  setText(text) {
    this.text = text;
  }
}

// Invoker
class Toolbar {
  constructor() {
    this.undoHistory = [];
    this.redoHistory = [];
  }

  execute(command) {
    command.execute();
    this.redoHistory = [];
    this.undoHistory.push(command);
  }

  undo() {
    if (!this.undoHistory.length) return;

    const command = this.undoHistory.pop();

    command.undo();
    this.redoHistory.push(command);
  }

  redo() {
    if (!this.redoHistory.length) return;

    const command = this.redoHistory.pop();

    command.redo();
    this.undoHistory.push(command);
  }
}

// Command
class WriteCommand {
  constructor(receiver, text) {
    this.text = text;
    this.previousText = '';
    this.receiver = receiver;
  }

  execute() {
    this.previousText = this.receiver.getText();
    this.receiver.setText(this.text);
  }

  undo() {
    this.receiver.setText(this.previousText);
  }

  redo() {
    this.execute();
  }
}

function App() {
  const invoker = useMemo(() => new Toolbar(), []);
  const editor = useMemo(() => new TextEditor(), []);
  const [text, setText] = useState(editor.getText());

  return (
    <>
      <section>
        <button onClick={undo}>撤回</button>
        <button onClick={redo}>前进</button>
      </section>

      <textarea value={text} onChange={write} />
    </>
  );

  function write(event) {
    const newText = event.target.value;
    const writeCommand = new WriteCommand(editor, newText);

    invoker.execute(writeCommand);
    setText(editor.getText());
  }

  function redo() {
    invoker.redo();
    setText(editor.getText());
  }

  function undo() {
    invoker.undo();
    setText(editor.getText());
  }
}

```

## 单例模式

单例模式（Singleton Pattern）：提供给全局的实例始终都是同一个，比如 `localStorage` 就是一个单例。

> 单例的例是指实例（复杂数据类型），所以如果提供给全局的东西是一个原始数据类型，那么就不算是单例模式，但这种做法确实达到了单例模式的目的。

因为 JavaScript 有 ES Modules，所以单例模式实现起来很简单。

```js
let count = 0;

const get = () => count;
const increase = () => ++count;
const decrease = () => --count;

export { decrease, get, increase };
```

## ⚛️ 高阶组件

高阶组件（Higher Order Component, HOC）是装饰器函数，也是高阶函数，仅此而已。HOC 和 Hooks 的作用都是复用代码，Hooks 在多数场景下都会更便捷。

```jsx
const Primitive = props => <p {...props} />;
const Decoration = decorate(Primitive);

/* HOC */
function decorate(Comp) {
  return props => <Comp className="preset" />;
}
```

## ⚛️ 复合组件

比如 Modal UI 组件就是典型的复合组件（Compound Pattern），它把相关状态聚合内部，然后对外提供一个开箱即用的黑箱组件。

```jsx
<Modal>
  <ModalTrigger />

  <ModalContent>
    <ModalHeader />
    <ModalFooter />
    
    <p>Type something here.</p>
  </ModalContent>
</Modal>
```

`Modal` 的内部可能是这样实现的：

```jsx
function Modal({ children }) {
  const state = useState(false);

  return <Ctx value={state}>{children}</Ctx>;
}

function ModalTrigger({ children }) {
  const [, setAvailable] = use(Ctx);
  const fn = () => setAvailable(true);

  return <div onClick={fn}>{children}</div>;
}

function ModalContent({ children }) {
  const [available] = use(ModalContent);

  return available ? children : undefined;
}
```

## ⚛️ 渲染时更新

「渲染时更新」就是在渲染的过程中做条件式的更新，虽然这会让组件不纯，但它确实好用。

```jsx
function Query() {
  const [type, setType] = useState(0);
  const [page, setPage] = useState(0);

  const prevTypeRef = useRef(type);
  const prevType = prevTypeRef.current;

  if (type === prevType) return <Result />;

  setPage(0);
  prevTypeRef.current = type;
}
```

## ⚛️ Ref 订阅模式

我们可以用 Ref 来绑定事件监听器，这会比 `useEffect` 的方案更简洁。

需要注意的是，如果 `div` 的入参改变了，那么 `div` 就会更新，然后 `handleRef` 就会重新执行。

```tsx
function Comp() {
  const handleRef = dom => {
    const fn = () => {};

    dom.addEventListener('click', fn);
    return () => dom.removeEventListener('click', fn);
  };

  return <div ref={handleRef} />;
}
```

## ⚛️ 内容提升

请查看下述示例，如果提升组件 `<Flag />` 的位置，那么就可以避免入参 `region` 的 Prop Drilling，这种技巧就叫做内容提升（Lifting Content Up）。

```jsx
// Before
<ul>
  {userList.map(({ uuid, name, region }) => (
    <User key={uuid} name={name} region={region} />
  ))}
</ul>

const User = ({ name, region }) => (
  <div>
    <span>{name}</span>
    <Flag region={region} />
  </div>
);

// After
<ul>
  {userList.map(({ uuid, name, region }) => (
    <User key={uuid} name={name}>
      <Flag region={region} />
    </User>
  ))}
</ul>;

const User = ({ name, children }) => (
  <div>
    <span>{name}</span>
    {children}
  </div>
);
```

## ⚛️ 草稿模式

如果你要实现一个编辑功能，那么你大概率会用到草稿模式（Draft Pattern）。

```jsx
function Discussion() {
  const [version, setVersion] = useState(0);
  const [comment, setComment] = useComment('');

  const handleCommit = nextComment => {
    setComment(nextComment);
    setVersion(version + 1);
  };

  return <Comment key={version} comment={comment} onCommit={handleCommit} />;
}

function Comment({ comment, onCommit }) {
  const [draftComment, setDraftContent] = useState(comment);

  const handleChange = e => setDraftContent(e.target.value);
  const handleCommit = () => onCommit(draftComment);

  return (
    <div>
      <textarea value={draftComment} onChange={handleChange} />
      <button onClick={handleCommit}>Commit</button>
    </div>
  );
}
```

