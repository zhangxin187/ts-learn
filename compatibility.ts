/** 类型兼容性 */
/** 相关文章：
 * https://zhuanlan.zhihu.com/p/143054881
 * https://juejin.cn/post/6994102811218673700
 * https://zhuanlan.zhihu.com/p/378358006
 * https://zhuanlan.zhihu.com/p/422196078
 */

// 协变逆变概念：具有父子关系的多个类型，在通过某种构造关系构造成的新的类型，如果还具有父子关系则是协变的，而关系逆转了（子变父，父变子）就是逆变的。
// A < B 代表A类型是B的子类型  由基础类型生成的复杂类型用表达式 com<T>表示
// 协变: A < B  => com<A> < com<B>
// 逆变: A < B  => com<A> > com<B>
// 双向协变：复杂类型互相是对方的子类型，双向兼容
// 不变：双向不兼容，互相不是对方子类型

// 子类型比父类型更加具体,父类型比子类型更宽泛
interface Animal {
  name: string;
}
interface Dog extends Animal {
  wang: () => void; // 狗叫
}

// compatibility
// Dog一定是Animal，但Animal不一定是Dog，故Dog是Animal的子类，Dog比Animal更加具体，
let Animal: Animal = { name: "cat" };
let Dog: Dog = { name: "dog", wang: () => {} };
// 子类型可以赋值给父类型,赋值这个词其实不太准确，赋值是值操作，而这里是类型，为了更好表达两个类型的关系，这里用赋值来表示
Animal = Dog;
// Freshness特性，结构化报错，使用断言 或 变量声明可去除Freshness
Animal = {
  name: "dog",
  wang: () => {},
};

// Covariant 协变
// Animal[] 和 Dog[]，Dog[]是Animal[]的子类，Dog值可以推入Animal数组，反过来就不行了
type Covariant<T> = T[];
let coAnimal: Covariant<Animal> = [];
let coDog: Covariant<Dog> = [];
coAnimal = coDog;

// Contravariant --strictFunctionTypes true  逆变，需要开启strictFunctionTypes，否则是双向协变，类型可以互相赋值
type Contravariant<T> = (p: T) => void;
let contraAnimal: Contravariant<Animal> = function (p) {
  p.name;
};

let contraDog: Contravariant<Dog> = function (p) {
  p.wang();
};
// 与类型 Dog < Animal的关系相反
contraDog = contraAnimal;
// 这里会报错,Animal中缺少Dog中的属性
contraAnimal = contraDog;

// 理解：从值的角度看，contraAnimal的参数的类型是Animal,它只能访问Animal下的属性,将contraDog赋值给了contraAnimal,在函数体中访问p.wang(),而参数的Animal类型中是没有wang属性的，故这里不安全，会报错！
// 反之将contraAnimal赋值给contraDog,此时方法体需要访问p.name,而函数参数是Dog，Dog中一定有Animal的属性，故这个操作是安全的！

// Bivariant --strictFunctionTypes false
// 双向协变,要将strictFunctionTypes置为false，将函数类型设为双向协变
// 下面两个不报错
contraDog = contraAnimal;
contraAnimal = contraDog;

// Invariant --strictFunctionTypes true
// 不变
type Invariant<T> = { a: Covariant<T>; b: Contravariant<T> };
let inAnimal: Invariant<Animal> = { a: coAnimal, b: contraAnimal };
let inDog: Invariant<Dog> = { a: coDog, b: contraDog };
// both are not ok
// 这个例子中，对象中的属性a是协变，b是逆变，在赋值时，则ts无法识他们的关系，故是`不变`
// 若将strictFunctionTypes置为false，此时 inAnimal = inDog 是成立的，因为b现在是双向协变了。
inDog = inAnimal;
inAnimal = inDog;

/** 双向协变的例子,ts默认是双向协变的。js中的事件监听 */
interface EventListener1 {
  (evt: Event): void;
}

// 简化后的Event
interface Event {
  readonly target: EventTarget | null;
  preventDefault(): void;
}
// 简化合并后的MouseEvent
interface MouseEvent extends Event {
  readonly x: number;
  readonly y: number;
}

// 简化后的Window接口
interface Window1 {
  // 简化后的addEventListener
  addEventListener(type: string, listener: EventListener): void;
}

declare const window1: Window1;

// 若strictFunctionTypes置为true，此时(e: MouseEvent) => {} 它的类型 是 EventListener的父类，逆变，这里赋值操作会报错
// 若将strictFunctionTypes置为false(默认)，此时为双向协变，故不报错
window1.addEventListener("aaa", (e: Event) => {});
window1.addEventListener("mouseover", (e: MouseEvent) => {});

/** 协变的不安全性，逆变同样不安全，ts无法监视到引用赋值的操作 */
(function () {
  class Animal {}

  class Cat extends Animal {
    meow() {
      console.log("cat meow");
    }
  }

  class Dog extends Animal {
    wow() {
      console.log("dog wow");
    }
  }

  let catList: Cat[] = [new Cat()];
  let animalList: Animal[] = [new Animal()];
  let dog = new Dog();

  // covariance is not type safe
  // 将catList赋值给了annimaList,后续它的类型仍是Animal[]，执行push(dog),是允许的。
  // 但由于catList和animaList共同指向一个引用空间，故修改animalList同时catList也会变，在下面执行cat.meow()会报错,数组中存在dog这个对象。
  animalList = catList;
  animalList.push(dog);
  // 这个错ts并不能识别出来，但实际在代码执行时会报错！
  catList.forEach((cat) => cat.meow()); // cat.meow is not a function

  // contravariance is also not type safe, if it exist here
  catList = animalList;
  animalList.push(dog);
  catList.forEach((cat) => cat.meow());
})();
