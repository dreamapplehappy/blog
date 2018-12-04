// use babel transform

"use strict";

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * author dreamapplehappy
 */

var MAX_LEVEL = 16;

var Node = function Node() {
    _classCallCheck(this, Node);

    this.data = -1;
    this.maxLevel = 0;
    this.refer = new Array(MAX_LEVEL);
};

var SkipList = (function() {
    function SkipList() {
        _classCallCheck(this, SkipList);

        this.levelCount = 1;
        this.head = new Node();
    }

    _createClass(
        SkipList,
        [
            {
                key: "insert",
                value: function insert(value) {
                    var level = SkipList.randomLevel();
                    var newNode = new Node();
                    newNode.data = value;
                    newNode.maxLevel = level;
                    var update = new Array(level).fill(new Node());
                    var p = this.head;
                    for (var i = level - 1; i >= 0; i--) {
                        while (p.refer[i] !== undefined && p.refer[i].data < value) {
                            p = p.refer[i];
                        }
                        update[i] = p;
                    }
                    for (var _i = 0; _i < level; _i++) {
                        newNode.refer[_i] = update[_i].refer[_i];
                        update[_i].refer[_i] = newNode;
                    }
                    if (this.levelCount < level) {
                        this.levelCount = level;
                    }
                }
            },
            {
                key: "find",
                value: function find(value) {
                    if (!value) {
                        return null;
                    }
                    var p = this.head;
                    for (var i = this.levelCount - 1; i >= 0; i--) {
                        while (p.refer[i] !== undefined && p.refer[i].data < value) {
                            p = p.refer[i];
                        }
                    }

                    if (p.refer[0] !== undefined && p.refer[0].data === value) {
                        return p.refer[0];
                    }
                    return null;
                }
            },
            {
                key: "remove",
                value: function remove(value) {
                    var _node = void 0;
                    var p = this.head;
                    var update = new Array(new Node());
                    for (var i = this.levelCount - 1; i >= 0; i--) {
                        while (p.refer[i] !== undefined && p.refer[i].data < value) {
                            p = p.refer[i];
                        }
                        update[i] = p;
                    }

                    if (p.refer[0] !== undefined && p.refer[0].data === value) {
                        _node = p.refer[0];
                        for (var _i2 = 0; _i2 <= this.levelCount - 1; _i2++) {
                            if (
                                update[_i2].refer[_i2] !== undefined &&
                                update[_i2].refer[_i2].data === value
                            ) {
                                update[_i2].refer[_i2] = update[_i2].refer[_i2].refer[_i2];
                            }
                        }
                        return _node;
                    }
                    return null;
                }
            },
            {
                key: "printAll",
                value: function printAll() {
                    var a = []
                    var p = this.head;
                    while (p.refer[0] !== undefined) {
                        // console.log(p.refer[0].data)
                        a.push(p.refer[0].data)
                        p = p.refer[0];
                    }
                    console.log(a)
                }
            }
        ],
        [
            {
                key: "randomLevel",
                value: function randomLevel() {
                    var level = 1;
                    for (var i = 1; i < MAX_LEVEL; i++) {
                        if (Math.random() < 0.5) {
                            level++;
                        }
                    }
                    return level;
                }
            }
        ]
    );

    return SkipList;
})();

// test case

var skipList = new SkipList();
var testTotalNum = 200;

var generateOdd = function(range) {
    var randomNum = Math.ceil(Math.random() * range);
    randomNum = randomNum % 2 ? randomNum : randomNum - 1;
    randomNum = randomNum > 0 ? randomNum : randomNum + 2;
    return randomNum
};

var generateEven = function(range) {
    var randomNum = Math.ceil(Math.random() * range);
    randomNum = randomNum % 2 ? randomNum - 1 : randomNum;
    randomNum = randomNum > 0 ? randomNum : randomNum + 2;
    return randomNum
};

var findNum = generateEven(testTotalNum);
var removeNum = generateEven(testTotalNum);
var insertNum = generateOdd(testTotalNum);

console.log(insertNum, findNum, removeNum);

for (var i = 0; i < testTotalNum; i += 2) {
    skipList.insert(i);
}

// skipList.printAll();

console.time("Find data: " + findNum);
var findResult = skipList.find(findNum);
console.timeEnd("Find data: " + findNum);

console.time("Insert data: " + insertNum);
skipList.insert(insertNum);
console.timeEnd("Insert data: " + insertNum);

console.time("Remove data: " + removeNum);
skipList.remove(removeNum);
console.timeEnd("Remove data: " + removeNum);

console.log(findResult)
