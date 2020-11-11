# 设计模式大冒险第三关：工厂模式，封装和解耦你的代码

![cover](./images/cover.png)

这篇文章是关于**设计模式系列**的第三篇文章，这一系列的每一篇文章都会通过生活中的小例子以及一些简单的比喻让大家明白每一个设计模式要**解决的是什么问题，然后通过什么方式解决的**。希望大家在看过每篇文章之后都能够理解文章中讲解的设计模式，然后有所收获。话不多说，让我们开始今天的冒险吧。

## 工厂模式的第一印象

对于初次听说这个设计模式的同学来说，你们的第一印象是什么呢？**既然是工厂模式，那么肯定跟工厂的一些功能或者行为有关系**。那么工厂都有哪些功能和行为呢？首先工厂收集原始材料，然后将原始的材料进行加工，处理，设计之后就变成了一个完整的产品或者部件。

**这个过程对于产品的销售店，或者用户来说是不可见的**。对于商家来说如果你想卖这个产品，你只需要去跟厂家沟通买一批这样的产品就行了。那对于用户来说，你想使用这个产品，只需要到卖这个产品的店里把它买回来就好了。

所以根据上面的推论，类比到代码中我们可以得出一些初步的结论：**工厂模式封装了对象的创建过程，把创建和使用对象的过程进行了分离，解耦代码中对具体对象创建类的依赖。让代码更好维护，更方便扩展**。

当然，如果想要知道这个设计模式是如何封装了对象的创建过程，并且减少了对具体类的依赖的话，我们还是要实践一下，通过一些例子或者开发中的场景学习如何使用好这个设计模式。那就让我们开始吧。

## 简单工厂

根据对代码**封装**和**抽象**的程度，工厂模式的实现方式有三种，它们分别是：**简单工厂**，**工厂方法**，以及**抽象工厂**。

我们首先来学习和了解一下简单工厂吧，假如你现在接手了一个生产蛋糕的程序，程序的部分代码如下：

```javascript
// 泡芙蛋糕
const PUFF_CAKE = "PUFF_CAKE";
// 奶酪蛋糕
const CHEESE_CAKE = "CHEESE_CAKE";

class PuffCake {
  constructor() {
    this.name = "(泡芙蛋糕)";
  }
}
class CheeseCake {
  constructor() {
    this.name = "(奶酪蛋糕)";
  }
}

class CakeMaker {
  constructor(type) {
    if (type === PUFF_CAKE) {
      this.cake = new PuffCake();
    } else {
      this.cake = new CheeseCake();
    }
  }

  // 搅拌原料
  stirIngredients() {
    console.log(`开始搅拌${this.cake.name}`);
  }

  // 倒入模具中
  pourIntoMold() {
    console.log(`将${this.cake.name}倒入模具`);
  }

  // 烘烤蛋糕
  bakeCake() {
    console.log(`开始烘焙${this.cake.name}蛋糕`);
  }
}

// 制作蛋糕
const cakeMaker = new CakeMaker(PUFF_CAKE);
cakeMaker.stirIngredients();
cakeMaker.pourIntoMold();
cakeMaker.bakeCake();
```

现在这个制作蛋糕的程序需要新添加一种海绵蛋糕，你要怎么去修改这个程序，让它能够支持生产海绵蛋糕呢？也许你的第一反应就是将`CakeMaker`的**构造函数**进行修改，新增加一个类型的判断，比如像下面这样：

```javascript
// ...
constructor(type) {
    if (type === PUFF_CAKE) {
      this.cake = new PuffCake();
    } else if (type === CHEESE_CAKE) {
      this.cake = new CheeseCake();
    } else {
      this.cake = new SpongeCake();
    }
}
// ...
```

这时，我们可以思考一下，虽然上面的方法的确可以帮助我们实现添加海绵蛋糕的功能，但是这样做会有一些问题。会有哪些问题呢？

![](./images/1.png)

首先，如果按照这个方式的话，我们以后只要添加新种类的蛋糕或者移除不受欢迎的蛋糕就必须要**修改**`CakeMaker`的**构造函数**。

这样做实在不是一个好的方案，而且**每当我们在`CakeMaker`中新增加一个具体的蛋糕类的话，就相当于给这个类新增加了一个依赖**。这样我们`CakeMaker`的依赖会越来越多，**任何一个依赖类发生改变都可能导致我们的`CakeMaker`类不能够正常工作，出错的几率大大增加**。

那么我们应该如何修改呢？我们应该减少`CakeMaker`类中对具体类的依赖，然后将生成蛋糕种类的过程从`CakeMaker`中移除。我们可以这样做：

```javascript
// ...
// 封装蛋糕的创建过程
function cakeCategoryMaker(type) {
  let cake;
  if (type === PUFF_CAKE) {
    cake = new PuffCake();
  } else if (type === CHEESE_CAKE) {
    cake = new CheeseCake();
  } else {
    cake = new SpongeCake();
  }
  return cake;
}
// ...
class CakeMaker {
  constructor(type) {
    this.cake = cakeCategoryMaker(type);
  }
  // ...
}
// ...
```

当你看完了上面的代码，你可能会说，这不只是把代码从一个地方移到了另一个地方，好像没有发生什么根本的变化呀。的确是这样，但是我们来看一下，一旦我们把生成蛋糕种类的代码移到外面，我们的`CakeMaker`是不是减少了对具体蛋糕类的依赖。现在对于`CakeMaker`类来说，它的依赖只有`cakeCategoryMaker`。`CakeMaker`不需要管你给我的蛋糕是什么类型的，我只负责对其进行加工制作，并不关心蛋糕的原料和种类。

而且，**我们的`cakeCategoryMaker`还可以被其它的蛋糕加工程序所共享**；如果以后还需要增加或者移除蛋糕种类的话，我们只需要在这一个地方修改就可以了。而不需要在每个加工蛋糕的代码中分别进行修改。这就是一个很好的编码习惯。

![](./images/2.png)


在实际的开发中，**我们的程序中可能存在需要根据不同场景创建不同类型对象的功能，但是这些对象具有同样的属性和接口，或者需要根据不同的数据源创建相同的对象**。那么这个时候，**我们就可以把这一部分的逻辑抽离出来，然后在全局中进行使用**。

这就是我们所说的**简单工厂**了，当然严格意义上来说，简单工厂不算是一个真正的设计模式。但是它很有用，**它封装了根据不同类型来创建不同对象的过程，将我们的程序进行了解耦，这样便于程序的维护和扩展。是一个不错的编程习惯和技巧，值得我们学习和使用**。


## 工厂方法

接下来我们来了解并学习**工厂方法**这种更高一级别的封装和抽象。在实际的开发中我们有时会写一些通用的组件，方便我们后续的业务开发使用。假如下面两个组件是已经开发好的组件：

```javascript
class Toast {
  constructor(text) {
    this.text = text;
  }
  show() {
    console.log(`toast show: ${this.text}`);
  }
  hide() {
    console.log("toast hide");
  }
}

class Modal {
  constructor(text) {
    this.text = text;
  }
  show() {
    console.log(`modal show: ${this.text}`);
  }
  hide() {
    console.log("modal hide");
  }
}

const toast = new Toast("hello");
toast.show();
toast.hide();
// modal
const modal = new Modal("world");
modal.show();
modal.hide();
```

上面关于组件的代码是没有什么太大问题的，但是我们再仔细思考一下也许会觉得好像这两个组件都有`show`和`hide`这两个方法。那么这就相当于是重复代码了，一般情况下如果出现了重复的代码那么说明我们还是有优化的地方的。

![](./images/3.png)


**并且如果在不改变现有的思路的情况下**，我们要再开发一个新的提示类型的组件的话，还是会在代码中重复这两个方法。那么有没有办法解决这个问题呢？当然有办法了，我们知道这种类型的组件都有`show`和`hide`这两个方法。**那么我们可以通过继承的方式从父类那里继承这两个方法，关于组件的具体创建过程我们可以在子类中进行实现**。

具体实现的代码如下：

```javascript
class CustomComponent {
  createComponent() {
    // TODO 需要被子类实现
  }
  show() {
    this.concreteComponent = this.createComponent();
    console.log(
      `this ${this.concreteComponent.name} show: ${this.concreteComponent.text}`
    );
  }
  hide() {
    console.log(`this component hide`);
  }
}

class ToastComponent extends CustomComponent {
  createComponent() {
    return {
      name: "toast",
      text: "hello",
    };
  }
}

class ModalComponent extends CustomComponent {
  createComponent() {
    return {
      name: "modal",
      text: "world",
    };
  }
}

const toast = new ToastComponent();
toast.show();
toast.hide();
const modal = new ModalComponent();
modal.show();
modal.hide();
```

这个解决方案的思路就是：**我们在父类中把子类的一些通用的操作进行实现。然后具体组件的创建细节交给子类去解决。那么这样做就相当于把组件创建的过程进行了封装，父类不需要知道这个组件是如何创建的，被谁创建的。但是这个子类组件已经继承了父类的那些方法，所以可以直接使用父类的方法进行展示和隐藏。**

![](./images/4.png)


因为在**JavaScript**中暂时还没有实现**抽象类**的功能，所以我们上面代码中的`CustomComponent`类从严格意义上说还不是一个抽象的父类。不过关系不是很大，思路和功能还是能够实现的。

那我们来总结一下工厂方法的特性：

+ **父类通过一个抽象的方法封装了对象的创建过程，对象的创建过程被延迟到子类中进行创建**
+ **子类因为是从父类继承而来，所以可以使用父类已经实现好的方法**
+ **工厂方法将我们的代码进行了解耦，创建组件的时候不需要再给父类传递对象的类型，由子类决定创建的对象的类型**

## 抽象工厂

接下来我们来讲解一下抽象程度最高的**抽象工厂**，看过上一篇文章👉[**设计模式大冒险第二关：装饰者模式，煎饼果子的主场**](https://mp.weixin.qq.com/s/KVy81rtB0YMeaHaem1PYMw)的同学应该知道，由于上次你给煎饼果子的老板帮了个忙。所以他知道你的编程水平不错，今天又来找你帮忙啦。

这次的问题是这样的，老板说他那边有一个获取煎饼果子原材料的程序，但是最近附近的一个菜市场提供的蔬菜不是很新鲜。所以想换一个菜市场去买原材料，但是更换菜市场的话，之前程序一些统计的数据就不准确了，所以需要让你帮忙修改一下现有的程序。现在的程序部分代码如下：

```javascript
class PanCakeMaterials {
  constructor(vegetableMarketName) {
    this.vegetableMarketName = vegetableMarketName;
  }

  getEgg() {
    if (this.vegetableMarketName === "VEGETABLE_MARKET_NAME_A") {
      return "a_market_egg";
    }
    if (this.vegetableMarketName === "VEGETABLE_MARKET_NAME_B") {
      return "b_market_egg";
    }
  }

  // ... 其它的原料
}

const panCakeMaterials = new PanCakeMaterials("VEGETABLE_MARKET_NAME_A");
console.log(panCakeMaterials.getEgg());  // a_market_egg
```

我们可以看到现在这个获取原材料的程序**虽然实现了获取原材料的功能，但是现在的扩展性太差。如果添加了新的菜市场或者移除不使用的菜市场的话，就需要修改程序**。所以又到了你大展身手的时候了，巧的是你刚刚学习完工厂模式的**抽象工厂**这个解决方案。所以你知道该如何重构现在的代码了。

首先原来的代码太依赖我们给的类型值了，如果输入的类型值有问题的话，那么整个获取原材料的程序就没有办法运行起来。**所以我们需要将每种食材获取的过程封装起来，由一个`VegetableMarketProvider`类来负责，然后对于`PanCakeMaterials`来说，我们只需要将`VegetableMarketProvider`子类的实例化对象当做传给`PanCakeMaterials`类的参数进行初始化就可以了**。

实现的代码如下所示：

```javascript
class VegetableMarketProvider {
  provideEgg() {}
}

class FirstVegetableMarketProvider extends VegetableMarketProvider {
  provideEgg() {
    return "a_market_egg";
  }
}

class SecondVegetableMarketProvider extends VegetableMarketProvider {
  provideEgg() {
    return "b_market_egg";
  }
}

class PanCakeMaterials {
  constructor(vegetableMarketProvider) {
    this.vegetableMarketProvider = vegetableMarketProvider;
  }

  getEgg() {
    return this.vegetableMarketProvider.provideEgg();
  }

  // ... 其它的原料
}

const firstVegetableMarketProvider = new FirstVegetableMarketProvider();
const secondVegetableMarketProvider = new SecondVegetableMarketProvider();
const panCakeMaterials = new PanCakeMaterials(firstVegetableMarketProvider);
console.log(panCakeMaterials.getEgg());  // a_market_egg
const secondPanCakeMaterials = new PanCakeMaterials(
  secondVegetableMarketProvider
);
console.log(secondPanCakeMaterials.getEgg());  // b_market_egg
```

我们来分析一下优化后的代码，首先我们写了一个抽象的`VegetableMarketProvider`类，这个类里面的所有方法也都是抽象的，需要由子类去实现具体的方法。**每一个子类对应一个具体的菜市场，这样的话每一个菜市场提供的原材料也就知道是什么了**。

![](./images/5.png)


对于`PanCakeMaterials`类来说，**我们不再传递一个表示菜市场类型的字符串了；取而代之的是，传递一个菜市场的实例。这样的话当我们初始化`PanCakeMaterials`的时候，对应的菜市场也就确定了，那对应的原材料也就确定了**。

这样的好处有哪些呢？**首先如果我们要更换菜市场，再也不需要改变`PanCakeMaterials`类的代码了，只需要更换传给`PanCakeMaterials`类的参数就可以了。然后如果需要添加新的菜市场的话，只需要新加一个`VegetableMarketProvider`的子类，在子类里面实现相应原材料的获取。这就体现了我们程序设计中的一个原则，对修改关闭，对扩展开放**。

我们通过上面的优化，把获取原材料的过程封装到`VegetableMarketProvider`的子类中，**然后通过对象组合的方式实现了对菜市场的更换**，这样的方式进一步解耦了我们的代码，**每一个类都各司其职，保证了职责的单一**。

那我们再来简单总结一下**抽象工厂**这个方式吧。

+ **通过使用一个抽象类，把相关的接口进行了定义，然后继承这个抽象类的子类都具有相同的接口和属性。这样用到这些子类的类可以对这些类进行接口编程，而不是在针对具体的类**。
+ **对象的创建过程被封装在子类中，这样实现了代码的封装以及类依赖的解耦**。
+ **使用不同的子类，通过对象的组合，我们可以实现我们想要的创建不同对象的功能**。

文章到这里就结束了，如果大家有什么问题和疑问欢迎大家在文章下面留言，或者在[这里](https://github.com/dreamapplehappy/blog/issues/18)提出来。也欢迎大家关注我的公众号[关山不难越](https://image-static.segmentfault.com/426/094/4260948368-54aad325bf3af665_articlex)，获取更多关于设计模式讲解的内容。

下面是这一系列的其它的文章，也欢迎大家阅读，希望大家都能够掌握好这些设计模式的使用场景和解决的方法。**如果这篇文章对你有所帮助，那就点个赞，分享一下吧~**

+ [设计模式大冒险第二关：装饰者模式，煎饼果子的主场](https://mp.weixin.qq.com/s/KVy81rtB0YMeaHaem1PYMw)
+ [设计模式大冒险第一关：观察者模式](https://mp.weixin.qq.com/s/ehrBQkjtBTyyiuUo8KiBLg)
