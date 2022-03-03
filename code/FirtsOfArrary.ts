/*
  14 - First of Array
  -------
  by Anthony Fu (@antfu) #easy #array
  
  ### Question
  
  Implement a generic `First<T>` that takes an Array `T` and returns it's first element's type.
  
  For example
  
  ```ts
  type arr1 = ['a', 'b', 'c']
  type arr2 = [3, 2, 1]
  
  type head1 = First<arr1> // expected to be 'a'
  type head2 = First<arr2> // expected to be 3
  ```
  
  > View on GitHub: https://tsch.js.org/14
*/

/* _____________ Your Code Here _____________ */

// 如下,一个字面量数组,可以通过下标去访问对应位置的类型，也可以根据key去访问它的类型
// 这不要跟值搞混了，这是类型操作
type Tup = ["a", "b", "c"];
type a = Tup[0];
// length属性的类型,字面量
type length = Tup["length"];

// 字面量extends
type b = 1;
type c = 0;
// 这里0、1都是类型，不要将其认为是值
type d = b extends c ? 1 : 0;

// 方式2: T['length'] extends 0 ? never : T[0]
type First<T extends any[]> = T extends never[] ? never : T[0];

/* _____________ Test Cases _____________ */
import { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<First<[3, 2, 1]>, 3>>,
  Expect<Equal<First<[() => 123, { a: string }]>, () => 123>>,
  Expect<Equal<First<[]>, never>>,
  Expect<Equal<First<[undefined]>, undefined>>
];
