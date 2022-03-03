/*
  11 - 元组转换为对象
  -------
  by sinoon (@sinoon) #简单 
  
  ### 题目
  
  > 欢迎 PR 改进翻译质量。
  
  传入一个元组类型，将这个元组类型转换为对象类型，这个对象类型的键/值都是从元组中遍历出来。
  
  例如：
  
  ```ts
  const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
  
  type result = TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
  ```
  
  > 在 Github 上查看：https://tsch.js.org/11/zh-CN
*/

/* _____________ 你的代码 _____________ */

// [K in T[number]] 用来遍历数组的，K就是字面量value，ts的语法记住就行了。
// [K in keyof T] 这样也是遍历，但是K是索引
type TupleToObject<T extends readonly any[]> = { [K in  T[number]]: K };

/* _____________ 测试用例 _____________ */
import { Equal, Expect } from "@type-challenges/utils";

const tuple = ["tesla", "model 3", "model X", "model Y"] as const;

type cases = [
  Expect<
    Equal<
      TupleToObject<typeof tuple>,
      {
        tesla: "tesla";
        "model 3": "model 3";
        "model X": "model X";
        "model Y": "model Y";
      }
    >
  >
];





