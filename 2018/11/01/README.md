## 掌握RxJS系列(02)：介绍RxJS以及Observable

上一篇文章给大家大概地讲解了一下什么是响应式编程，这一篇文章我们来了解一下[`RxJS`](https://github.com/ReactiveX/rxjs)，`RxJS`是响应式编程的一种具体的实现方式；还有一些其他也实现了响应式编程的库，比如[Cycle.js](https://github.com/cyclejs/cyclejs)，[Bacon.js](https://github.com/baconjs/bacon.js)，[most.js](https://github.com/cujojs/most)，[xstream](https://github.com/staltz/xstream)等。
我们为什么要学习`RxJS`而不学习其他的那些库呢？主要原因有以下几点：
- **符合标准**：`RxJS`的实现方式符合当前[Observable的提案](https://tc39.github.io/proposal-observable/)（以后可能会在新版本的JavaScript中实现的一些关于响应式编程的功能）
- **流行**：`RxJS`是[`Rx`](http://reactivex.io/)JavaScript版本的实现，还有其他一些语言的实现；比如：[RxJava](https://github.com/ReactiveX/RxJava)， [RxSwift](https://github.com/ReactiveX/RxSwift)等；这些库的API都是相同的，所以你学会了一个库的使用，等于同时学会了很多个不同语言的这种库的用法。
对前端开发者来说，如果要学习响应式编程的话；选择使用[`RxJS`](https://github.com/ReactiveX/rxjs)会是一个好的选择，直观一点来讲，`RxJS`在github上的`star`数量要比其他JavaScript实现的响应式编程的库要多得多，而且现在主流的三个前端框架`Angular`，`React`，`Vue`都有与`RxJS`的结合使用，其中`Angular`的结合最深（[Angular - The RxJS library](https://angular.io/guide/rx-library)），所以学习`Angular`的开发者，更有必要把`RxJS`学好。
接下来我们就开始进入`RxJS`的学习啦。`RxJS`有一个核心和三个重点，一个核心指的是`Observable`，三个重点分别是`Observer`，`Subject`，`Scheduler`；在后面的内容中我会逐步和大家一起把这些内容都来实践一下。我们先从`Observable`开始学习起来吧。
在介绍`Observable`之前我们先来熟悉两个概念：在数据从生产到使用的过程中，有这样两个角色；一个是数据的生产者（`Producer`），另一个是数据的消费者（`Consumer`）；消费者和生产者之间需要一种“通信”的方式，来满足数据从生产者传递到消费者那里。现在有两种方式：
- **Pull**： 这种方式是指`Consumer`直接从`Producer`那里去拿取数据；在这种方式下，`Consumer`是主动的，它决定何时去`Producer`那里获取数据，`Producer`不知道`Consumer`什么时候会来拿取数据。
- **Push**：这种方式是指`Producer`主动把数据传递给`Consumer`，在这种方式下，`Producer`是主动的，他决定什么时候把数据发送给`Consumer`，`Consumer`并不知道`Producer`什么时候会把数据传递给自己。
**Pull**和**Push**就是我们要理解的两个概念，我们可以用下面的表格来表示这两个概念：

|       |  Producer(数据的生产者)  | Consumer(数据的消费者) |
| ----------- | ----------- | ------ |
| **Pull**      | **被动的**：当消费者请求数据的时候才生产数据      | **主动的**：决定什么时候需要数据 |
| **Push**   | **主动的**：按照自己的节奏生产数据       | **被动的**：接收数据并作出反应 |
在**JavaScript**中属于`Pull`类型的有[`Function`](https://developer.mozilla.org/en-US/docs/Glossary/Function)和[`Iterator `](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)，其中`Function`每次只能同步返回一个结果，而[`Generator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)(它符合[`可迭代协议`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)和[`迭代器协议`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterator))在每次迭代的时候可以同步返回多个结果；属于`Push`类型的有[`Promise`](https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise)，`Promise`可以异步的返回一个结果，但是不可以异步返回多个结果；所以在`RxJS`中，有[`Observable`](https://rxjs-dev.firebaseapp.com/guide/observable)这个对象，`Observable`可以**同步**或者**异步**的返回多个结果，相当于在`Push`这个方式中，添加了一种可以返回多个值的情况。
我们也可以使用下面的表格来表示上面说的内容：

|       |  SINGLE(返回单个值) | MULTIPLE(返回多个值) |
| --- | ---- | --- |
| **Pull**  |   [Function](https://developer.mozilla.org/en-US/docs/Glossary/Function) | [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) |
| **Push** | [Promise](https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise)  | [Observable](https://rxjs-dev.firebaseapp.com/class/es6/Observable.js~Observable.html) |
还有一点需要注意的是：**`Function`，`Iterator`，`Observable`都是延迟计算的，也就是说函数只有在被调用的时候才会进行运算，迭代器只有进行迭代的时候才会进行计算，`Observable`(可观察对象)只有在被`subscribe`(订阅)的时候才会进行运算。**
下面我们开始创建一个`Observable`，并且订阅这个`Observable`；代码如下：
```javascript
import { Observable } from "rxjs";

const observable = Observable.create(observer => {
  observer.next(1);
  observer.next(2);
  setTimeout(() => {
    observer.next(3);
  }, 100);
});

console.log("before subscribe");
const subscription = observable.subscribe(val => {
  console.log(`val: ${val}`);
});
console.log("after subscribe");
```
控制台的输出结果如下：

```console
before subscribe
val: 1
val: 2
after subscribe
val: 3
```
从控制台的结果我们可以看到，我们创建的这个`observable`在`订阅`之后先是`同步`的发送出了`1`和`2`这两个值，然后等待`100ms`后又发送出了`3`这个值；并且我们在这个`observable`订阅之前和之后都添加了额外的代码，方便我们观察`observable`发送值的情况。到目前为止我们可以知道的是：`observable`不仅可以`同步`的发送值还可以`异步`的发送值。
这本篇文章对`RxJS`和`Observable`做了简单的介绍，下一篇文章我们会深入的研究一下`Observable`。

参考资料：
[Observable](https://rxjs-dev.firebaseapp.com/guide/observable)
