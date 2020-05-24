# 深入理解JS对象隐式类型转换的过程

在平时的开发工作中，我们有时会遇到需要将一个对象转换成基本类型的情况。很多情况下这个过程都是自动完成的，我们不需要手动处理。但是每当遇到这种情况的时候，你是否有思考过其背后的逻辑是怎样的？这篇文章会跟大家一起探讨一下这个问题。

在开始这篇文章之前，大家可以尝试思考一下下面问题的答案，看看自己对这部分知识的掌握程度怎么样。

```javascript
let a = {
    [Symbol.toPrimitive] (hint) {
        if (hint === 'number') {
            console.log('   >>> a hint number');
            return 10;
        }
        if (hint === 'string') {
            console.log('   >>> a hint string');
            return '10';
        }
        console.log('   >>> a hint default');
        return 'a';
    }
};
let b = {
    toString() {
        console.log('   >>> b hint string');
        return 'b';
    },
    valueOf() {
        console.log('   >>> b hint number');
        return 20;
    }
};

console.log(+a);
console.log(`${a}`);
console.log(a + '');
console.log(a == b);
console.log(a + b);
console.log(a * b);
```
如果你能够全部回答正确，那么恭喜你，这一部分你掌握得很不错。可以不用继续往下看了，当然你也可以继续看下去，看看实际的转换过程跟你想想的过程是不是一样的。如果有回答错误的，那正好可以借这个机会好好学习一下，查漏补缺。

接下来我们来深入探讨一下，将一个对象转换为基本类型的值需要经过那些过程。如果问大家，将一个对象转换为一个基本类型，会调用那些方法。大部分同学首先会想到`Object.toString`和`Object.valueOf`，如果对**ES6**了解比较深入的话，你可能还会想到`Object[Symbol.toPrimitive]`。当然只知道这些还是不够的，我们还需要知道每一个方法会在哪些情况下被调用，如果某一个或多个方法不存在，那么它们的调用顺序是怎样的。

## ToPrimitive

想要回答上面的问题，我们就要从官方的文档入手，从源头上了解关于对象类型转换为基本类型的定义。[文档](https://tc39.es/ecma262/#sec-toprimitive)上是这么定义的，如果将一个对象转换为基本类型，那么这个过程可以使用一个抽象的操作`ToPrimitive`来表示，`ToPrimitive`接收一个`input`参数（也就是当前需要被转换的对象）和一个可选的`PreferredType`参数，这个操作会把`input`转换为一个非对象类型的基本类型值，如果这个对象可以被转换为多种基本类型值，那么这个时候就可以根据对象所处的上下文环境使用可选的提示参数`PreferredType`，来转换为符合这个上下文环境的基本类型。具体的过程如下：

1. 断言：首先我们需要确定传入的input值是JavaScript的一种[数据类型](https://tc39.es/ecma262/#sec-ecmascript-language-types)
2. 判断`input`的类型是否是对象，如果是继续下一步
    - 如果`PreferredType`没有出现，那么将`hint`赋值为`default`
    - 如果`PreferredType`暗示是字符串，那么将`hint`赋值为`string`
    - 否则
      + 断言：这个时候可以确定`PreferredType`暗示是数字类型
      + 将`hint`赋值为`number`
    - 声明`exoticToPrim`，如果`input`上面的`toPrimitive`方法不为空，将`exoticToPrim`赋值为这个方法
    - 如果`exoticToPrim`不是`undefined`，那么进行下面的步骤
      + 声明`result`，将`input`和`hint`作为参数传递给`exoticToPrim`，并且运行这个函数。如果运行的结果不为空，将`result`赋值为这个结果
      + 如果`result`类型不是对象，那么返回这个值
      + 抛出类型错误
    - 如果`hint`的值是`default`，那么将`hint`赋值为`number`
    - 运行`OrdinaryToPrimitive(input, hint)`，如果运行的结果不为空就返回这个结果
3. 直接返回基本类型


可以看到上面的转换过程包含一个`OrdinaryToPrimitive`的操作，我们暂时先不考虑这个操作，这部分的讲解会在文章的后面给出。如果暂时不考虑`OrdinaryToPrimitive`操作，我们会发现，上面的过程中有一个`exoticToPrim`函数，这个函数对应的就是对象上面定义的`Symbol.toPrimitive`属性，`Symbol.toPrimitive`是一个内置的`Symbol`值，这个属性是一个函数属性。当将一个对象转换为原始值的时候会优先调用这个函数。

`Symbol.toPrimitive`接收一个参数值也就是上面转换过程中的`hint`，这个参数有三个固定值分别是`default`, `string`, `number`。`hint`的值由对象在转换过程中的上下文决定，比如在`${obj}`中，`hint`的值就为`string`，如果是在`+obj`中，`hint`的值就为`number`, 如果是在`obj + obj`中, 这个时候`hint`的值就是`default`了，因为`+`可以用作字符串的连接以及数字求和。我们来实践一下吧。

练习[Symbol.toPrimitive]

```javascript
let obj = {
   [Symbol.toPrimitive](hint) {
      if (hint === 'string') {
         console.log('当前上下文需要一个 string 类型的值');
         return 'hello world!';
      } else if (hint === 'number') {
         console.log('当前上下文需要一个 number 类型的值');
         return 100;
      } else {
         console.log('当前上下文无法确定需要转换的基本类型');
         return 0;
      }
   },
};
console.log('--- 测试: ${obj} ---');
console.log(`${obj}`);
console.log('\n--- 测试: +obj ---');
console.log(+obj);
console.log('\n--- 测试: obj + obj ---');
console.log(obj + obj);
```

看了上面的解释，相信大家应该都可以回答出上面输出的内容了；如果有哪里还不明白，可以再看看上面的解释。

还有一些需要我们注意的细节，当`ToPrimitive`操作被调用的时候，如果没有`hint`，那么这时候通常这个操作的表现就像是`hint`的值是`number`。对象可以通过定义`Object[Symbol.toPrimitive]`来覆写这个行为。规范中定义的对象只有**Date**类型和**Symbol**类型的对象覆写了这个默认的方法。其中Date类型对待没有`hint`的表现就像`hint`的值是`string`一样。

## OrdinaryToPrimitive

接下来我们要讲一讲`OrdinaryToPrimitive`操作的过程了，我们继续看一下官方文档上面关于[`OrdinaryToPrimitive`](https://tc39.es/ecma262/#sec-ordinarytoprimitive)的解释。

这个抽象的操作需要两个参数，分别是`O`和`hint`，当被调用的时候会执行下面的过程：

1. 断言：`O`是一个对象。
2. 断言：`hint`是一个字符串，它的值只能是`string`或者`number`（通过上面的解释我们可以知道，在没有调用`OrdinaryToPrimitive`之前，如果`hint`的值是`default`的话，会把`hint`的值更新为`number`，然后再开始调用`OrdinaryToPrimitive`）。
3. 如果`hint`的值是`string`，那么：
    + 声明`methodNames`列表，它的值为« "toString", "valueOf" »
4. 否则
    + 声明`methodNames`列表，它的值为« "valueOf", "toString" »
5. 遍历`methodNames`列表中的每一个`name`，做下面的操作：
    + 声明`method`方法，赋值为对象的上面的`name`方法
    + 如果`method`是可以调用的，那么进行下面的操作：
      - 声明`result`，将其赋值为在对象上运行`name`函数的结果
      - 只要`result`的类型不是一个对象，那就返回这个结果
6. 抛出类型错误异常

看了上面的过程，我们对`OrdinaryToPrimitive`的操作也有了比较深入的理解，那么我们接下来也做一个简单的实践，来验证一下上面的过程。

```javascript
let obj = {
    toString() {
        console.log('执行obj的toString方法');
        return 'hello world!';
    },
    valueOf() {
        console.log('执行obj的valueOf方法');
        return 100;
    }
};

console.log('--- 测试: ${obj} ---');
console.log(`${obj}`);
console.log('\n--- 测试: +obj ---');
console.log(+obj);
console.log('\n--- 测试: obj + obj ---');
console.log(obj + obj);
```

细心的你会发现`console.log(obj + obj)`与之前的不太一样，它的输出结果是`200`。这是为什么呢？上面我们有讲到说，在`obj + obj`这个上下文环境中，`hint`的值是`default`，在进行`OrdinaryToPrimitive`操作之前，`hint`的值会更新为`number`。所以当`hint`的值为`number`的时候就可以轻松的得到上面的结果。

到这里为止，关于对象转换为原始值的大部分内容都已经讲解完了。**总结来说就是，如果需要将一个对象转换为原始类型的值，首先要判断这个对象所处的上下文环境，看一下需要将对象转换为什么类型的原始值，然后首先会调用对象上面的`Symbol.toPrimitive`方法，如果有基本类型的返回值，就返回这个值。如果没有正确的返回值，接下来由上下文环境决定调用对象上面的`valueOf`和`toString`方法的顺序，只要这两个方法有一个方法的返回是一个基本类型，那么该对象就会被转换成这个基本值，否则就会抛出错误。**

## 拓展与思考

###  ++[[]][+[]]+[+[]]的输出为什么是10

相信很多同学都看过上面这个表达式，你可能也会对它的输出为什么是`10`感到诧异。我们今天也顺便来分析一下这个表达式的值为什么是`10`。

就像你看一个魔术一样，如果你不知道魔术背后的秘密，那么魔术对你来说就是一个谜。但是对于表演的魔术师来说，那只不过是在道具的帮助下，做了一连串迅速而又不出错的动作而已。

同样，对于上面这个表达式，我们只需要一步一步的分析，找到一些关键点，化繁为简。最后的结果也就呼之欲出了。

首先我们需要给这个表达式做一下格式的优化，这需要我们知道操作符优先级的相关知识，详情可以看[运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)。按照操作符的优先级我们可以把上面的表达式变为：
```javascript
++[[]][+[]] + [+[]]
```
因为`[[]][+[]]`属于成员访问，**[[]][+[]] `+` [+[]]** 中的`+`属于加法运算符，它的作用是数值求和，或者字符串拼接，`++`为前置递增运算符。他们的优先级是`成员访问`优先级高于`前置递增运算符`，`前置递增运算符`的优先级高于`加法运算`。

那接下来的问题就是简化这个表达式，我们看到表达式中`[+[]]`出现了两次，那么`[+[]]`如何简化呢？对于`[+[]]`重要的就是里面的`+[]`，我们上面也解释过了，对于`+`我们知道这是一个一元操作符，会把`[]`转换为一个数字，这时候会首先调用数组的`valueOf`方法，因为数组的`valueOf`方法返回的是数组本身，不是一个基本类型。所以接下来要调用数组的`toString`方法。`toString`方法返回的是`""`一个空字符串，是一个基本类型。因为`+`会把`""`转换为一个数字，那么把`""`转换为数字是数字`0`。所以上面的`[+[]]`其实就是`[0]`，所以最初的表达式可以转换为`++[[]][0] + [0]`。

我们继续把上面的表达式转换为更简单的形式，`[[]][0]`其实就是获取`[[]]`数组的第一个元素，也就是`[]`，所以`++[[]][0] + [0]`到这里为止就被转换为了`++[] + [0]`。到这里已经比最初的版本精简很多了。但是这里还有一个知识点，`++`在这里是[前置递增运算符](https://www.ecma-international.org/ecma-262/10.0/index.html#sec-prefix-increment-operator)。它会把`++a`表达式中的`a`先转换为一个数字，然后将这个数字加1，最后返回这个新值。所以上面的的表达式就变为了`1 + [0]`。其实如果你在浏览器的控制台运行一下`++[]`，你会发现会报错`Uncaught SyntaxError: Invalid left-hand side expression in prefix operation`，这是因为`++`运算符
                                                                                                                                                                                                                                                                                                                   作用的表达式需要是一个引用，而不是一个字面量。所以如果你运行`let a = []; ++a`，那么a的值就会变为`1`。而`[[]][0]`就是一个引用，所以我们可以把表达式转换为`1 + [0]`。

对于`1 + [0]`，`[0]`需要被转换为基本类型，因为在这个上下文环境中，`+`可以用作两个数字相加或者两个字符串的拼接。所以对于`[0]`在执行上面的`ToPrimitive`抽象过程的时候，`hint`值由最初的`default`被转换为了`number`，但是因为数组对象默认的`Symbol.toPrimitive`属性为空，所以要继续进行`OrdinaryToPrimitive`抽象操作，所以`[0]`最终被转换为了`"0"`字符串。

所以上面的表达式又被转换为了`1 + "0"`，这时候结果就显而易见了，就是字符串`"10"`。因为当`+`左右两侧只要有一个操作数是字符串的时候，`+`运算符执行的就是字符串的拼接。关于`+`运算符的规则可以看[这里](https://www.ecma-international.org/ecma-262/10.0/index.html#sec-addition-operator-plus)。

至此，上面那个复杂的表达式就这样一步一步被我们攻破了。如果你对这一部分很有兴趣，推荐你看看[Write any JavaScript with 6 Characters: \[\]()!+](https://github.com/aemkei/jsfuck)。


### 在比较的过程中抛出错误

学习了上面的知识，我们可以很容易的在有对象参与比较的时候抛出错误，比如你可以这样：
```javascript
let a = { valueOf: undefined, toString: undefined} 
a == 1 // 报错
let d = { valueOf: () => ({}), toString: undefined}
d == 1 // 也会报错
```

如果大家对上面的内容有什么疑问和建议，都可以在[这里](https://github.com/dreamapplehappy/blog/issues/5)提出来，我们可以继续讨论一下。
