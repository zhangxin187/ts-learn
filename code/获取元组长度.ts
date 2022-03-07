/*
  18 - 获取元组长度
  -------
  by sinoon (@sinoon) #简单 #tuple
  
  ### 题目
  
  > 欢迎 PR 改进翻译质量。
  
  创建一个通用的`Length`，接受一个`readonly`的数组，返回这个数组的长度。
  
  例如：
  
  ```ts
  type tesla = ['tesla', 'model 3', 'model X', 'model Y']
  type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']
  
  type teslaLength = Length<tesla> // expected 4
  type spaceXLength = Length<spaceX> // expected 5
  ```
  
  > 在 Github 上查看：https://tsch.js.org/18/zh-CN
*/


/* _____________ 你的代码 _____________ */

// 实在没想到，这里约束必须加
export type Length<T extends readonly any[]> = T["length"];


/* _____________ 测试用例 _____________ */
import { Equal, Expect } from '@type-challenges/utils'

// 这里 as const 变为了readonly？
const tesla = ['tesla', 'model 3', 'model X', 'model Y'] as const
const spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT'] as const

type cases = [
  Expect<Equal<Length<typeof tesla>, 4>>,
  Expect<Equal<Length<typeof spaceX>, 5>>,
  // @ts-expect-error
  Length<5>,
  // @ts-expect-error
  Length<'hello world'>,
]


// const断言会将对象中的属性全部变为只读，会将数组变为只读元组
// https://juejin.cn/post/6844903848939634696
const obj = {
    a:1
} as const;

const arr = [1,2,3] as const;

// 若用const声明简单类型，这里就为字面量，后续不可更改
const a = '1';

// 若用let、var声明,这里的类型为string
let b ='2';