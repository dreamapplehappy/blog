## 掌握RxJS系列(03)：剖析Observable

### 前言

这是**掌握RxJS系列**的第三篇文章，这篇文章主要是和大家一起来剖析一下`RxJS`中的`Observable`。

### 初步了解

+ 创建一个`Observable`

    我们首先看一下下面创建一个Observable的代码：
    ```javascript
    import { Observable } from "rxjs";

    // 创建一个Observable
    const observable = Observable.create(function subscribe(observer) {
      observer.next("Hello, World!");
    });
    // 订阅一个Observable
    observable.subscribe(val => {
      console.log(val);
    });
    ```
    我们首先从`rxjs`库里面导出`Observable`，然后通过它的`create`方法创建了一个`observable`;
    在`observable`对象上面调用`subscribe`方法就完成了对`observable`的订阅。

    运行上面的代码，控制台就会打印出：
    ```
    Hello, World!
    ```

    ~~到此为止，你已经学会了如何使用`rxjs`了，本次讲解到这里就结束了。~~ 开个玩笑😁

    说起创建一个`Observable`除了使用`Observable.create`我们还可以使用**RxJS**提供的[创建操作符](https://github.com/ReactiveX/rxjs/blob/master/src/index.ts#L42)
    在平时的工作中，我们使用这些创建操作符会更加频繁一些。

    从`rxjs`中导出的`Observable`其实是一个**类**，我们上面使用的`Observable.create`，这个类的静态方法的内部直接调用了`Observable`的构造器，可以看一下它的[源码](https://github.com/ReactiveX/rxjs/blob/master/src/internal/Observable.ts#L55)或者这部分的[文档](https://rxjs-dev.firebaseapp.com/api/index/class/Observable#create)；
    我们也可以将上面代码中的`Observable.create`替换为`new Observable`。

    传递给`Observable.create`的是一个**subscribe**函数，这个函数对于我们了解一个`Observable`是非常重要的，下文会有一些详细的讲解；
    这个函数有一个默认的参数`observer`，通过调用`observer`的`next`方法，我们可以把一个值传递给`observable`的订阅者。

+ 订阅一个`Observable`

    上面的代码也演示了如何订阅一个`Observable`对象，通过调用`observable`的`subscribe`方法，我们就可以订阅`observable`对象；
    `observable.subscribe`方法的参数可以是一到三个函数，还可以是一个[`observer`](https://rxjs-dev.firebaseapp.com/api/index/interface/Observer)类型的对象。
    详情可以看[subscribe](https://rxjs-dev.firebaseapp.com/api/index/class/Observable#subscribe-)

    你也许会注意到`observable.subscribe`中的**subscribe**和`Observable.create(function subscribe(observer) {...}`中作为参数的**subscribe**函数的名字一样，
    这不是一个巧合；虽然在代码层面，它们确实是不一样的，但是出于实用目的，你可以认为它们在概念上是相同的。

    我们需要注意的是，对于一个`Observable`对象可能会有多个订阅(`subscribe`)，但是这些订阅都是独立的，它们之间没有任何的共享；也就是说，`observable`的每一次订阅，
    与之对应的`Observable.create`里面的**subscribe**函数里面的程序就会重新运行一次；

    我们修改修改一下上面的代码，修改后如下：
    ```javascript
    // 创建一个Observable
    const observable = Observable.create(function subscribe(observer) {
      console.log("------>");
      observer.next("Hello, World!");
    });
    // 第一个订阅
    observable.subscribe(val => {
      console.log(val);
    });
    // 第二个订阅
    observable.subscribe(val => {
      console.log(val);
    });
    ```

    我们可以看到控制台的输出如下所示，`------>`打印了两遍，说明`Observable.create`里作为参数的`subscribe`函数运行了两次。
    ```
    ------>
    Hello, World!
    ------>
    Hello, World!
    ```

    还有，我们需要知道，**对于一个`Observable`的订阅，就像是调用一个函数那样；数据将会传递到它提供的回调函数里面。**

    我们接下来在`Observable.create`里面添加一个异步的操作，修改后的代码如下所示：
    ```javascript
    const observable = Observable.create(function subscribe(observer) {
      observer.next("Hello, World!");
      setTimeout(() => {
        observer.next("setTimeout");
      });
    });
    console.log("observable.subscribe begin ------>");
    observable.subscribe(val => {
      console.log(val);
    });
    console.log("observable.subscribe end ------>");

    ```

    上面代码的运行结果如下：
    ```
    observable.subscribe begin ------>
    Hello, World!
    observable.subscribe end ------>
    setTimeout
    ```

    代码的运行结果也表明了我们上面所说的，在传入`Observable.create`的`subscribe`函数中：
    如果通过`observer.next`传递给外面的值是**同步**传递的，那么我们在订阅这个`Observable`的时候也会**同步**得到这个值；
    如果通过`observer.next`传递给外面的值是**异步**传递的，那么我们在订阅这个`Observable`的时候也会**异步**得到这个值；

    还有一些需要知道的是：`observable.subscribe`与`addEventListener`和`removeEventListener`等一些事件处理的API是不一样的；
    对于`Observable`对象的`subscribe`我们传递的是一个[`observer`](https://rxjs-dev.firebaseapp.com/api/index/interface/Observer)，
    但是这个`observer`并不是作为一个事件监听器注册在`Observable`中，`Observable`甚至都不会维护附加的`observer`列表。

    对一个`Observable`对象的订阅，是一种启动**Observable execution**的简单方法，然后把相应的值和事件传递到相应的订阅函数中。

+ 执行一个`Observable`

    在`Observable.create(function subscribe(observer) {...})`中省略的代码，代表一个`Observable execution`；`Observable execution`是延迟计算的，
    只有当一个`Observable`对象被订阅的时候`Observable execution`才会被计算运行。`Observable execution`会同步或者异步的产生许多值。

    `Observable execution`可以产生三种类型的通知：
    - `Next`类型的通知：发送`Number`，`String`，`Object`等类型的值。
    - `Error`类型的通知：发送`JavaScript`的异常或者错误。
    - `Complete`类型的通知：不发送任何值。

    `Next`类型的通知是最重要和最常用的，这种类型的通知把数据传递给相应的`Observer`；`Error`和`Complete`这两种类型的通知
    在`Observable execution`的执行过程中，只会发送一种；要么是`Error`类型，要么是`Complete`类型；并且只会发送一次。
    因为一旦`Error`或者`Complete`类型的通知发送完毕，整个`Observable execution`就结束了。

    这三种通知的关系，我们可以使用`Observable`风格的约定来表示，表示如下：
    ```
    next*(error|complete)?
    ```

    我们接下来使用代码来实践一下上面所说的内容：
    ```javascript
    const observable = Observable.create(function subscribe(observer) {
        observer.next(1);
        observer.next(2);
        observer.complete();
        observer.next(3) // 3 不会被打印出来
    });
    observable.subscribe(val => {
        console.log(val);
    });
    ```

    上面代码的运行结果如下所示：
    ```
    1
    2
    ```
    这表明了，在`Observable execution`在发出一个`Complete`通知后，整个`Observable execution`执行结束，后面的代码不会再执行了。

    接下来我们来通过`Observable execution`发送一个`Error`通知，代码如下所示：
    ```javascript
    const observable = Observable.create(function subscribe(observer) {
        observer.next(1);
        observer.next(2);
        observer.error(0);
        observer.next(3) // 3 不会被打印出来
    });
    observable.subscribe(val => {
        console.log(val);
    });
    ```
    代码的运行结果如下所示：
    ```
    1
    2
    Uncaught 0 // 这一行在控制台显示为红色
    ```
    从上面的结果我们可以看出，当一个`Observable execution`发出一个`Error`通知之后，整个`Observable execution`执行结束，接下来的代码也就不会执行了。
    但是控制台抛出了一个错误`Uncaught 0`，这是因为我们没有捕获这个错误，所以控制台就抛出了这个错误。关于这部分我们在下面的文章中有详细的说明。

    **最佳实践：** 我们可以使用`try/catch`来包裹我们`Observable execution`里面的代码；这样一来当我们的代码抛出错误的时候，就会发送一个`Error`类型的通知，
    我们就可以及时地捕获到这个错误，方便我们下一步的处理。

+ 取消`Observable Execution`的执行

    因为有些`Observable Execution`的执行是无限的，所以我们需要一些方法取消`Observable Execution`的执行；先看下面的代码：
    ```javascript
    import { interval } from "rxjs";
    const observable = interval(1000);
    const subscription = observable.subscribe(val => {
      console.log(val);
    });
    setTimeout(() => subscription.unsubscribe(), 4000);
    ```
    上面的代码，先从`rxjs`中导出[`interval`](https://rxjs-dev.firebaseapp.com/api/index/function/interval)**创建操作符**，它可以直接生成一个`Observable`对象；`const observable = interval(1000);`这条语句表明
    我们生成的这个`Observable`对象每一秒会往外面发送一个`Next`类型的通知，并且会传递一个升序整数，从`0`开始，每秒增加1，一直持续下去。
    如果我们想在一段时间后取消这个`Observable Execution`执行过程，我们应该怎么做呢？

    `observable.subscribe`方法会返回一个[`Subscription`](https://rxjs-dev.firebaseapp.com/api/index/class/Subscription)类型的对象，
    它代表着对应的持续运行的`Observable Execution`，这个对象上面有一个`unsubscribe`方法，通过调用这个方法，我们可以实现对`Observable Execution`执行过程的取消。

    一般情况下，我们通过创建操作符生成的`Observable`，通过调用其`subscription`的`unsubscribe`方法我们可以取消其`Observable Execution`的执行过程。
    但是如果我们是通过`Observable.create`生成`Observable`对象的话，我们就需要自己定义如何取消`Observable Execution`执行的方法；我们可以通过返回一个`unsubscribe`
    函数，来取消`Observable Execution`的执行。下面的代码是一个相应的例子：
    ```javascript
    import { Observable } from "rxjs";
    const observable = Observable.create(observer => {
      const intervalId = setInterval(() => {
        console.log("inner interval");
        observer.next("hello, world!");
      }, 1000);
      return function unsubscribe() {
        clearInterval(intervalId);
      };
    });
    const subscription = observable.subscribe(val => {
      console.log(val);
    });

    setTimeout(() => {
      subscription.unsubscribe();
    }, 4000);
    ```
    运行的结果如下：
    ```
    inner interval
    hello, world!
    inner interval
    hello, world!
    inner interval
    hello, world!
    inner interval
    hello, world!
    ```
    从上面的结果我们可以看到，通过返回一个`unsubscribe`函数(在这个函数里面我们需要手动的取消上面定义的定时器)，
    当外部的`subscription`调用`unsubscribe`方法的时候，我们就可以取消整个`Observable execution`的执行过程。如果我们没有返回
    这个`unsubscribe`函数，那么我们上面所定义的定时器会一直运行，就不会被清除。然后我们就看到控制台上会一直打印`inner interval`。

    实际上，如果我们移除包裹在代码外层的`ReactiveX`类型，我们就可以得到如下所示很直观的**JavaScript**代码：
    ```javascript
    const subscribe = observer => {
      const intervalId = setInterval(() => {
        console.log("inner interval");
        observer.next("hello, world!");
      }, 1000);
      return function unsubscribe() {
        clearInterval(intervalId);
      };
    };

    const unsubscribe = subscribe({
      next: val => {
        console.log(val);
      }
    });

    setTimeout(() => {
      unsubscribe();
    }, 4000);
    ```
    大家可能会想，为什么要在这么直观的代码上包裹一层`ReactiveX`类型的代码？主要原因是因为有了这层包裹，
    我们就获得和**RxJS类型的操作符一起使用**的安全性和可组合性。

### 深入了解

接下来我们来深入了解一下我们上面学习到的一些内容，首先是[`Observable`](https://rxjs-dev.firebaseapp.com/api/index/class/Observable)，
这是一个类，用来创建`Observable`；我们一般会使用它的[`create`](https://rxjs-dev.firebaseapp.com/api/index/class/Observable#create)
方法来创建一个`Observable`对象；`create`方法其实调用的是`Observable`的构造器[`constructor()`](https://rxjs-dev.firebaseapp.com/api/index/class/Observable#constructor())

那我们来看一下这个构造器需要传递的参数是什么，看下面的[代码](https://github.com/ReactiveX/rxjs/blob/master/src/internal/Observable.ts#L37)
```
...
constructor(subscribe?: (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic)
...
```
我们可以知道，传递的参数是一个`subscribe`，它是一个函数；这个函数会在`Observable`对象调用`subscribe`方法的时候执行；这个函数有一个[`Subscriber`](https://rxjs-dev.firebaseapp.com/api/index/class/Subscriber)类型的值，
然后我们可以通过这个`subscriber`，发送三种类型的通知，并且可以传递值给外面的[`observer`](https://rxjs-dev.firebaseapp.com/api/index/class/Observable#subscribe-)，
或者相应接收值的函数。

`Observable`对象的[`subscribe`](https://rxjs-dev.firebaseapp.com/api/index/class/Observable#subscribe-)方法的参数可以是一个[`Observer`](https://rxjs-dev.firebaseapp.com/api/index/interface/Observer)类型的对象，
或者一到三个函数；如果是一个对象的话，需要满足[`Observer`](https://rxjs-dev.firebaseapp.com/api/index/interface/Observer)接口的一些属性；
一般情况下这个对象上面至少有一个`next`方法，来接收相应的`Observable`传递过来的值。如果给`subscribe`方法传递的参数是函数的话，那么可以传递一到三个，
第一个接收`Next`类型通知，第二个接收`Error`类型的通知，第三个接收`Complete`类型的通知；如果相应的通知可以传递值的话，那么我们函数的参数就是相应要传递的值。

`Observable`对象调用`subscribe`方法之后，返回的是一个[`Subscription`](https://rxjs-dev.firebaseapp.com/api/index/class/Subscription)类型的对象，它有一个[`unsubscribe`](https://rxjs-dev.firebaseapp.com/api/index/class/Subscription#unsubscribe)方法，可以取消`Observable execution`的执行过程。

### 结束语

到这里我们这一篇文章就算是结束啦，如果文章中有什么不正确的地方，也希望大家指出来；以免误导别的读者。如果你有什么建议，反馈或者想法可以写在[这里](https://github.com/dreamapplehappy/blog/issues/2)。

版权声明：[![知识共享许可协议](https://i.creativecommons.org/l/by-nc-nd/3.0/80x15.png)](http://creativecommons.org/licenses/by-nc-nd/3.0/) [共享-保持署名-非商业性使用-禁止演绎](http://creativecommons.org/licenses/by-nc-nd/3.0/)
