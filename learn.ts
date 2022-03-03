/** keyof
 * keyof T 会得到由 T 上已知的公共属性名组成的联合类型。
 */
interface Person1 {
  name: string;
  age: number;
  phoneNum: number;
}
type Person1Property = keyof Person1;
// 相当于
// type Person1Property = "name" | "age" | "phoneNum"

const p1: Person1 = {
  name: "zx",
  age: 12,
  phoneNum: 123,
};
/** 经典泛型使用 */
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const name1 = getProperty(p1, "name");

/** ts中也可以使用访问操作符，获取interface中对应属性的类型*/
const name2: Person1["name"] = "123";

/** in */
enum Letter {
  A,
  B,
  C,
}

type LetterMap = {
  [key in Letter]: string;
};
// 相当于如下
// type LetterMap = {
//     0: string;
//     1: string;
//     2: string;
// }
type Property = "name" | "age" | "phoneNum";

type PropertyObject = {
  [key in Property]: string;
};
// 相当于如下
// type PropertyObject = {
//     name: string;
//     age: string;
//     phoneNum: string;
// }

/** 数字枚举可以反向映射，其原理如下 */
enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}
// 编译后的代码
//   (function (Direction) {
//     Direction[(Direction["NORTH"] = 0)] = "NORTH";
//     Direction[(Direction["SOUTH"] = 1)] = "SOUTH";
//     Direction[(Direction["EAST"] = 2)] = "EAST";
//     Direction[(Direction["WEST"] = 3)] = "WEST";
//   })(Direction || (Direction = {}));

// 编译后的枚举是一个对象，如下，故可以反向映射
// var Direction = {
//     NORTH:0,
//     SOUTH:1,
//     EAST:2,
//     WEST:3,
//     0:'NORTH',
//     1:'SOUTH',
//     2:'EAST',
//     3:'WEST'
// }

/** is类型谓词，类型保护 */
function isString(value: any): value is string {
  return typeof value === "string";
}
const s = isString("1");

function doSometing(value: string | number) {
  if (isString(value)) {
    console.log(value);
    // TS 可以识别这个分支中 value 是 string 类型的参数（这就叫类型保护）
    // 这是返回boolean做不到的
  } else {
    console.log(value);
    // TS 可以识别这个分支中 value 是 number 类型的参数
  }
}

/** 索引  */
interface ITest1 {
  [key: string]: number;
}
interface ITest2 {
  [key: number]: number;
}
type Test1 = keyof ITest1;

type Test2 = keyof ITest2;

const obj1: ITest1 = {
  a: 1,
  1: 2,
};

/** extends的用法 */
// 1.interface继承
// 2.泛型约束
interface MyInter {
  length: number;
}

// 这里的extends是约束的意思
// 要求指定的泛型类型必须有Length属性才可以
function test<T extends MyInter>(arg: T): number {
  return arg.length;
}
test({ a: 1, length: 10 });

// 3.条件判断,判断一个类型是不是可以分配给另一个类型
// SomeType extends OtherType ? TrueType : FalseType;

type Human1 = {
  name: string;
};
type Duck1 = {
  name: string;
};
type Bool1 = Duck1 extends Human1 ? "yes" : "no"; // Bool => yes

// A extends B，是指类型A可以分配给类型B，而不是说类型A是类型B的子集!!!
type Human2 = {
  name: string;
  age: number;
};
type Duck2 = {
  name: string;
};
type Bool2 = Duck2 extends Human2 ? "yes" : "no"; // Bool => no

/** test */
type Length<T extends readonly any[]> = T["length"];
// 这是字面量类型，而不是数组，是个类型！！！故上面的length也是一个类型
type Arr = [1, 1, 2, 3, 4, 5];
type arrLength = Length<Arr>;

const arr: Arr = [1, 1, 2, 3, 4, 5];

type MyOmit<T, K extends keyof T> = keyof T extends K ? never : T;
type A = MyOmit<Person1, "age">;
const obj2: A = {
  name: "zx",
  phoneNum: 123,
};

/** 箭头函数泛型 */
const f = <T1 extends {}>(arg1: T1) => {
  return { arg1 };
};

/** 接口定义函数 */
interface ReturnString {
  (arg: number): string;
}
const fn: ReturnString = (arg) => {
  return arg + "";
};
fn(1);

/** 函数重载例子 */
// 重载函数的类型必须用接口来实现，且不能使用箭头函数
interface Overloaded {
  (foo: string): string; // 这里在interface里无法用 ()=> 这样的来定义函数类型
  (foo: number): number;
}

// 实现接口的一个例子：
function stringOrNumber(foo: number): number;
function stringOrNumber(foo: string): string;
function stringOrNumber(foo: any): any {
  if (typeof foo === "number") {
    return foo * foo;
  } else if (typeof foo === "string") {
    return `hello ${foo}`;
  }
}

const overloaded: Overloaded = stringOrNumber;

// 使用
const str = overloaded(""); // str 被推断为 'string'
const num = overloaded(123); // num 被推断为 'number'

/** 可实例化仅仅是可调用的一种特殊情况，它使用 new 作为前缀。它意味着你需要使用 new 关键字去调用它： */
interface CallMeWithNewToGetString {
  new (): string; // 约束constructor,返回值是实例成员的类型，需要在实例化时通过new去调用
}

// 使用
declare const Foo: CallMeWithNewToGetString;
const bar = new Foo(); // bar 被推断为 string 类型

/** 类型断言 */
// 1. <>法,不推荐使用
let foo: any;
let bar1 = <string>foo; // 现在 bar 的类型是 'string'

// 2. as，推荐使用


/** Freshness
 * 概念：https://jkchao.github.io/typescript-book-chinese/typings/freshness.html#%E5%85%81%E8%AE%B8%E9%A2%9D%E5%A4%96%E7%9A%84%E5%B1%9E%E6%80%A7
 * 总结：Freshness可以更严格检查字面量类型，以捕获多余或拼写错误的属性。添加类型断言或对象字面量赋值给变量可关闭Freshness。
 * 每个对象文字最初都被认为是“新鲜的”。
 * 当一个新的对象字面量分配给一个变量或传递给一个非空目标类型的参数时，对象字面量指定目标类型中不存在的属性是错误的。
 * 当类型断言或对象字面量的类型扩大时，新鲜度会消失。
 */
function logName(something: { name: string }) {
  console.log(something.name);
}
const person = { name: "matt", job: "being awesome" };
const randow = { note: `I don't have a name property` };
// 如下将对象字面量赋值给了变量，关闭了Freshness,故多传字段`job`并不报错
logName(person); // ok
logName(randow); // Error: 没有 `name` 属性

// 传了对象字面量，触发了Freshness,由于多传属性，故报错
logName({ name: "matt", job: "123" }); // Error: 多传了`job`属性

let o7: { x: number } = { x: 1 };
let o8: { x: number; y: number } = { x: 1, y: 2 };

o7 = o8; // 变量属性可以多
o8 = o7;
o7 = { x: 1, y: 2 }; // freshness,ts以结构的形式去检查类型

/** 可以使用interface定义array */
interface IA {
  [key: number]: string;
}
const arr1: IA = ["1", "2"];
// 同如下
const arr2: string[] = ["1"];

/** readonly的注意点 */
const foo1: {
  readonly bar: number;
} = {
  bar: 123,
};

function iMutateFoo(foo: { bar: number }) {
  foo.bar = 456;
}
foo1.bar = 999; // Error,readonly的属性不能修改

// 在iMutateFoo函数中,foo.bar的值被修改了
// readonly只能确保“我”不能修改属性，但是当你把这个属性交给其他并没有这种保证的使用者（允许出于类型兼容性的原因），他们能改变它。
// 当然，如果 iMutateFoo 明确的表示，他们的参数不可修改，那么编译器会发出错误警告：
iMutateFoo(foo1);
console.log(foo1.bar); // 456

//当函数(消费方)明确表示参数只读，则这时修改会报错
function iTakeFoo(foo: { readonly bar: number }) {
  foo.bar = 456; // Error: bar 属性只读
}

iTakeFoo(foo1);

/** 索引签名 */
// 当你声明一个索引签名时，所有明确的成员都必须符合索引签名：
// 这可以给你提供安全性，任何以字符串的访问都能得到相同结果。
// ok
interface Foo {
  [key: string]: number;
  x: number;
  y: number;
}

// Error
interface Bar {
  [key: string]: number;
  x: number;
  y: string; // Error: y 属性必须为 number 类型
}

/** interface定义函数
 *  函数本质上是一个特殊的对象，我们也可以用接口来定义函数的参数和返回值。
 */
interface IF1 {
  (arg: number): number;
}
const fn7: IF1 = (arg: number) => arg;

// 这与上面又不同
// 若是一个匿名函数则该interface声明的是函数，若是一个具名函数写法，则该interface声明的是一个对象，具名函数是对象下面的方法
interface IF2 {
  fn(arg: number): number;
}

const fn8: IF2 = {
  fn: (arg: number) => arg,
};

// 下面与上面又不同，由于函数本质是一个对象，故这里可以约束属性,这个属性是函数的静态属性
interface IF3 {
  aa: number;
  (arg: number): number;
}
// 报错，缺少函数实现
const fn9: IF3 = {
  aa: 123,
};

// 这里用的类型断言,明确fn11中有静态属性aa
const fn11 = <IF3>(a: number) => a;
fn11.aa = 456;
console.log(fn11.aa);
// fn的类型没约束bb，故报错
fn.bb = 123;

// interface里函数类型不能用箭头函数
// interface IF4 {
//   (number) => number //直接报错，接口用来约束对象，但是这里没有key
// }

// 这个不是用来约束函数，而是约束一个对象，对象的属性是fn,值的类型应该是函数
interface IF5 {
  fn: (number) => number; //直接报错，接口用来约束对象，但是这里没有key
}
const fn10: IF5 = {
  fn: (arg: number) => arg,
};

/** class实现interface */
interface IC3 {
  name: string;
}

// class即是一个值(供实例化)，又是一个类型，实例对象的类型,类实例化返回值的类型
class C1 implements IC1 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
const c1 = new C1("123");

interface IC2 {
  name: string;
  log(): void;
  new (name: string): IC2; // new关键字约束constructor,需要在实例化时通过new去调用
}
// 如下会报错,C2中未实现new (name: string): IC1，ts是结构化类型
class C2 implements IC2 {
  name = "123";
  constructor(name) {
    this.name = name;
  }
  log(): void {
    console.log(this.name);
  }
}

// 一个类中的属性和方法是有静态部分与实例部分之分的。当一个类去实现某个接口时，只会检查这个类的实例部分是否满足接口的要求，而不会去检查类的静态部分。construtor是静态方法。
// 实现类静态、实例成员的方法，再创建一个interface直接约束类的变量，约束类的静态成员
interface DogInterface {
  name: string;
  age: number;
  say(): void;
}

// 用于约束类的静态部分的接口
interface DogConstructorInterface {
  new (name: string): DogInterface;
  age2: number;
}
// 然后声明一个类，这个类实现了实例部分的接口，
// 并且声明一个实现变量，这个变量实现了静态部分的接口，
// 再将这个类赋值到这个变量
// 在这个类中, 需要静态与实例的属性、方法

const Dogg: DogConstructorInterface = class Dog implements DogInterface {
  name: string;
  age: number = 1;
  say(): void {
    console.log(`${this.name}wang wang wang`);
  }
  constructor(name: string) {
    this.name = name;
  }
  static age2: number = 2;
};
let dog = new Dogg("旺财");
dog.say(); //‘旺购wang wang wang'
console.log(dog.age); // 1
console.log(Dogg.age2); // 2
