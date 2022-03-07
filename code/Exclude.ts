/*
  43 - Exclude
  -------
  by Zheeeng (@zheeeng) #简单 #built-in
  
  ### 题目
  
  > 欢迎 PR 改进翻译质量。
  
  实现内置的Exclude <T，U>类型，但不能直接使用它本身。
  >从联合类型T中排除U的类型成员，来构造一个新的类型。
  
  > 在 Github 上查看：https://tsch.js.org/43/zh-CN
*/


/* _____________ 你的代码 _____________ */
// 未认真看题,这里联合类型 extends 满足分配率
export type MyExclude<T, U> = T extends U ? never: T;


/* _____________ 测试用例 _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
    Expect<Equal<MyExclude<"a" | "b" | "c", "a">, Exclude<"a" | "b" | "c", "a">>>,
    Expect<Equal<MyExclude<"a" | "b" | "c", "a" | "b">, Exclude<"a" | "b" | "c", "a" | "b">>>,
    Expect<Equal<MyExclude<string | number | (() => void), Function>, Exclude<string | number | (() => void), Function>>>,
]


// 如下是错误示范,这里将Omit和Exclude搞混了，Exclude是用于联合类型中排除指定的内容，返回的是联合类型
type A = Exclude<"a" | "b" | "c", "a">;

interface Ia {
    a:string,
    b:string,
    c:number
}

type B = Exclude<Ia,'a' | 'b'>
