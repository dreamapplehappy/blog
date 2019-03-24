/**
 * 查找P不同匹配长度下需要向后移动的位数
 * @param P
 * @returns {Array}
 */
function computeMoveSteps(P) {
  // 计算P的长度
  const pLen = P.length;
  // 不同匹配长度下需要移动的值
  const f = [];
  // 初始值f[0] = 0
  f[0] = 0;

  // 当前位置下已经匹配的字符串的最后一个字符的下标
  let k0;
  // 当前位置下，如果后面的字符不匹配；已经匹配的字符串需要向后移动的值
  let kLen;

  for (let k = 1; k < pLen; k++) {
	// 获取最后一个字符的下标
	k0 = k - 1;
	kLen = f[k0];

	while (P[k] !== P[kLen]) {
	  // k0是匹配长度是kLen情况下的最后一个字符的下标
	  k0 = kLen - 1;
	  // 终止条件
	  if (k0 < 0) {
		break;
	  }
	  // 获取匹配长度是kLen情况下可以移动的数值
	  kLen = f[k0];
	}

	// 如果k0小于0 说明在一直没有找到匹配
	if (k0 < 0) {
	  f[k] = 0;
	} else {
	  // 说明在已经匹配了k0长度的情况下 找到了匹配
	  f[k] = f[k0] + 1;
	}
  }

  return f;
}

// 测试
console.log(computeMoveSteps("abababa")); // [ 0, 0, 1, 2, 3, 4, 5 ]

/**
 * KMP算法的JavaScript版本表示
 * @param T
 * @param P
 * @returns {number}
 */
function findPatternIndex(T, P) {
  // 计算T和P的长度
  const tLen = T.length;
  const pLen = P.length;
  // 不同匹配长度下可以向后移动的位数数组
  const f = computeMoveSteps(P); // computeMoveSteps函数上面已经有了
  // T中匹配P的位置
  let index = 0;
  // 用i和j分别表示T和P要比较的字符的下标，初始值都为0
  let i = 0;
  let j = 0;
  // P可以向后移动的位置
  let step;

  while(i < tLen) {
	// 如果T[i]和P[j]的值相等，那么i和j都各自加1
	if(T[i] === P[j]) {
	  i++;
	  j++;
	  // 如果j的值等于pLen那就说明已经找到了
	  if(j === pLen) {
		return index;
	  }
	} else {
	  // 如果j等于0 那么说明刚开始就不匹配
	  if(j === 0) {
		// index的值加1
		index++;
		// 重新初始化i和j的值
		i = index;
		j = 0;
	  } else {
		// 这个时候我们有可能直接将j向后移动几个位置
		step = f[j-1];
		j = step;
		index = i - step;
	  }
	}
  }

  // 如果中途没有返回值，那么就是没有找到，返回-1
  return -1;
}

// 测试
console.log(findPatternIndex("njhjhasuduadhjababajkjasduiuiqwehjnb", "ababa")); // 14