/** --- 如下报错如何解决 --- */
enum EA {
  a,
  b,
  c,
}
type a = typeof EA;

const config1 = {
  [EA.a]: "1",
  [EA.b]: "2",
};

const config2 = {
  [EA.c]: "3",
};

type abc = keyof EA;

// 只有type 才可以用 in关键字，interface不可以
type T1 = {
  [k in EA]: string;
};

const fn = <T, K extends keyof T>(config: T, key: K) => {
  console.log(config[key]);
};
fn(config1, EA.a);
/** ---end--- */

/** --- 泛型，函数第一个参数的类型决定第二个参数,如果第一个参数是number,则第二参数是string --- */
const f1 = <T, K extends T extends number ? string : never>(
  arg1: T,
  arg2: K
): void => {
  console.log(arg1, arg2);
};
f1(1, 2);

type T2 = number;
type T3 = T2 extends number ? string : never;
/** ---end--- */

/** --- 如何获取函数返回值类型 --- */
const fn2 = (): number => {
  return 1;
};
type T5 = typeof fn2;
type T4 = ReturnType<typeof fn2>;
/** ---end--- */

/** --- 如何判断一个值的类型是否属于某个interface --- */
interface I1 {
  name: string;
  common: number;
}

interface I2 {
  age: number;
  common: number;
}

const o1: I1 = { name: "zx", common: 1 };

// 如下是常犯问题，这里将两个类型作为值来进行比较，类型不能当作值使用，一定要区分
typeof o1 === I1;

// 自定义类型保护
const isI1 = (value: any): value is I1 => {
  return value.name;
};

function fn3(arg: I1 | I2) {
  if (isI1(arg)) {
    // I1
    console.log(arg.name);
  } else {
    // I2
    console.log(arg.age);
  }
}

// 用in关键字
// 此处的in代表这个字段是否在该对象中,ts的关键字
function fn4(arg: I1 | I2) {
  if ("name" in arg) {
    // I1
    console.log(arg.name);
  } else {
    // I2
    console.log(arg.age);
  }
}
// 还有好几种方法，具体看ts类型保护
/** ---end--- */

/** --- 怎么从枚举剔除一个,如下报错如何解决 --- */
enum E1 {
  a,
  b,
}
const map1 = {
  [E1.a]: 11,
};

const o2 = {
  a: E1.a,
};
const o3 = {
  b: E1.b,
};

// 这里将o2.a的类型识别为E1
map1[o2.a];

// 这里是可以知道它具体的类型，故用as
map1[o2.a as E1.a];

/** ---end--- */

/** --- 如下这个表达式啥意思？下面两个有何不同？ --- */
// <type>{} 这样的写法同as，声明一个空对象，让它的类型断言为xx
// 这是一种早起的类型断言
const o4 = <I1>{};
// 推荐用as
const o6 = {} as I1;
// 如下跟上面是不同的,它会报错
const o5: I1 = {};
// <>断言法
let foo: any;
let bar = <string>foo; // 现在 bar 的类型是 'string'

export function extend<T extends object, U extends object>(
  first: T,
  second: U
): T & U {
  const result = <T & U>{};
  for (let id in first) {
    (<T>result)[id] = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<U>result)[id] = second[id];
    }
  }

  return result;
}

const x = extend({ a: "hello" }, { b: 42 });

// 现在 x 拥有了 a 属性与 b 属性
const a = x.a;
const b = x.b;
/** ---end--- */

/** --- 如下为啥不报错？ --- */
interface Point2D {
  x: number;
  y: number;
}
interface Point3D {
  x: number;
  y: number;
  z: number;
}

let iTakePoint2D = (point1: Point2D) => {};
let iTakePoint3D = (point2: Point3D) => {};

let o7: Point3D = { x: 1, y: 2, z: 3 };
let o8: Point2D = { x: 1, y: 2 };

o7 = o8;
o8 = o7; 
o8 = { x: 1, y: 2, z: 3 };// freshness

iTakePoint3D = iTakePoint2D; // ok, 这是合理的
iTakePoint2D = iTakePoint3D; // 为啥报错

/** ---end--- */
