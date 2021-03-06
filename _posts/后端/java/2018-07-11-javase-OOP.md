---
layout: article
title: javase 面向对象
categories: [后端]
tags: [java]
---

## 类与对象
- **类**: 用于描述多个对象的共同特征，它是对象的模板。
- **对象**: 用于描述现实中的个体，它是类的实例。
- 定义类
    ```txt
    class 类名 {
        //属性
        数据类型 变量名;
        …
        //方法
        修饰符 返回值类型 方法名(参数){   }
        …
    }
    ```
- 创建对象
    ```txt
    类名 对象名 = new 类名();
    ```

## 封装

把对象的属性与方法的实现细节隐藏，仅对外提供一些公共的访问方式

### 封装的体现
- 变量: 使用`private`修饰变量，然后提供`get`和`set`方法供外界访问，这就是变量的封装
- 方法: 也是一种封装，封装了多条代码
- 类: 也是一种封装，封装了多个方法(功能)

## 继承

**继承**是指在一个现有类的基础上去构建一个新的类，构建出来的新类被称作`子类`，现有类被称作`父类`，子类会自动拥有父类所有。

### 好处
- 提高了代表的可维护性
- 提高了代码的复用性
- 让类与类之间产生了继承关系，为多态提供基础

### 弊端
类与类之间的耦合度过高

### java中继承的特点
- java中类只能够单继承，不能多继承，可以多层继承
    ```java
    class Yy extends Object {}
    class Fu extends Yy{}
    class Zi extends Fu {}
    ```
- 所有的类都直接或者间接的继承了`Object`类，Object类称为祖宗类。

### 注意事项
1. 使用关键字`extends`让类与类之间产生继承关系
2. 父类私有的成员，子类不能继承，因为根本看不到
3. 不能为了继承某个功能而随意进行继承操作， 必须要符合`IS A`的关系
    ```txt
	苹果 IS A 水果
	男人 IS A 人
	狗   IS A 人 , 这种情况就不能继承了
    ```

### 继承中的成员变量关系
- 不同名的变量： 子类直接继承使用
- 同名的变量： 默认访问的是子类自己的成员变量, 想访问父类中的同名变量，请使用`super.成员变量`

### 继承中的成员方法关系：
- 不同名的方法： 子类直接继承使用
- 同名的方法： 默认访问的是子类自己的成员方法，想访问父类中的同名方法，请使用`super.成员方法()`

### 方法覆盖/重写(override)

指在子父类中，出现了方法声明相同的情况，也叫做`方法覆盖/方法重写`。

- 注意事项
    1. 子类的方法声明要与父类相同
    2. 子类要重写方法的方法，方法的权限修饰符不能比父类的更低; 返回值类型是与父类中相同或是其子类
    3. 父类私有的方法，子类不能够进行方法重写
- 对比
    * `方法重载`(`overload`)：指在同一个类中，多个方法名称相同，它们的参数列表不同(个数不同，数据类型不同)

## 抽象

### 抽象方法

方法只有声明部分，没有方法体

### 抽象类
- 包含抽象方法的类，一定是抽象类
- 使用`abstract`修饰的类，是抽象类

### 抽象类的特点
- 抽象类与抽象方法都必须使用 abstract来修饰
- 抽象类不能直接创建对象
- 抽象类中可以有抽象方法，也可以没有抽象方法
- 抽象类的子类
    * 全部实现了父类抽象方法的具体类
    * 未实现或未完全实现父类抽象方法的抽象类
- 没有抽象方法的抽象类的意义
    * 可以通过这种方式禁止该类被实例化

## 接口

### 概述

理解为是一个特殊的抽象类，但它不是类，是一个接口

- 定义一个接口用interface关键字,`interface Inter{}`
- 一个类实现一个接口，使用implements关键字,`class Demo implements Inter{}`
- 接口不能直接创建对象，通过多态的方式，由子类来创建对象(接口多态)

### 接口中的成员特点
- 成员变量
	* 只能是`final`修饰的常量
	* 默认修饰符： `public static final`
- 构造方法
	* 无
- 成员方法
	* 只能是抽象方法
	* 默认修饰符: `public abstract`

###	类与类，类与接口，接口与接口之间的关系
- 类与类之间：继承关系，单继承，可以是多层继承
- 类与接口之间: 实现关系，单实现，也可以多实现
- 接口与接口之间：继承关系，单继承，也可以是多继承
- Java中的类可以继承一个父类的同时，实现多个接口

## 多态

理解为同一种物质的多种形态

### 使用的前提
- 有继承或者实现关系
- 要方法重写
- 父类引用指向子类对象

### 成员访问特点
- 编译期看引用类型是否有该成员
- 运行期成员属性必须是该引用类型成员，而方法则可能是被具体子类覆盖过的

### 好处
提高了程序的扩展性

### 弊端
不能访问子类的特有功能

### 多态的分类
- (抽象)类的多态
    ```java
    abstract class Fu {
                    public abstract void method();
    }
    class Zi extends Fu {
    public void method(){
                        System.out.println(“重写父类抽象方法”);
    }
    }
    //类的多态使用
    Fu fu= new Zi();
    ```
- 接口的多态
    ```java
    interface Fu {
        public abstract void method();
    }
    class Zi implements Fu {
        public void method(){
            System.out.println(“重写接口抽象方法”);
        }
    }
    //接口的多态使用
    Fu fu = new Zi();
    ```

## 构造方法

用来给类的成员进行初始化操作

- 格式 
    ```txt
    修饰符 类名 (参数列表) {
        ...
    }
    ```
- 构造方法的特点
    * 方法名与类名相同
    * 没有返回值，也没有返回值类型，连void也没有
- 构造方法什么时候会被调用执行？
    * 只有在创建对象的时候才可以被调用

### 构造方法注意事项
- 如果我们手动给出了构造方法，编译器不会再给我们提供默认的空参数构造方法；如果我们没写任何的构造方法，编译器提供给我们一个空参数构造方法
- 在构造方法中，默认的第一条语句为 super();它是用来访问父类中的空参数构造方法，进行父类成员的初始化操作
- 当父类中没有空参数构造方法的时候，怎么办？
    * 通过`super(参数)`访问父类有参数的构造方法
    * 通过`this(参数)`访问本类中其他构造方法[该方法已经能够正常访问父类构造方法]
- `super(参数)`与`this(参数)`不能同时在构造方法中存在

## 相关关键字

### super 

指的是父类的存储空间(理解为父类的引用),提供了在子类中访问父类成员与构造器的手段。

- 调用父类的成员变量： `super.成员变量`;
- 调用父类的构造方法： `super(参数)`;
- 调用父类的成员方法： `super.成员方法()`;

### this
- 本类对象的引用
- this是在方法中使用的，哪个对象调用了该方法，那么，this就代表调用该方法的对象引用
- this什么时候存在的？当创建对象的时候，this存在的
- this的作用：用来区别同名的成员变量与局部变量（this.成员变量）
    ```java
        public void setName(String name) {
            this.name = name;
        }
    ```

### instanceof
- 格式： `对象名 instanceof 类名`
- 返回值： `true`/`false`
- 作用： 判断指定的对象是否为给定类(接口)创建的对象

## 修饰符

### public

### protected

### <default>(默认的权限)

### private
- 私有的意思,它可以用来修饰类中的成员(成员变量，成员方法)
- 特点：private修饰的成员只能在当前类中访问，其他类中无法直接访问

### final
- final修饰的类： 最终的类，不能被继承
- final修饰的变量： 相当于是一个常量, 在编译生产.class文件后，该变量变为常量值
- final修饰的方法： 最终的方法，子类不能重写，可以继承过来使用

### static

静态，可以用来修饰类中的成员(成员变量，成员方法)

- 注意： 也可以用来修饰成员内部类
- 特点：
	* 被静态所修饰的成员，会被所有的对象所共享
	* 被静态所修饰的成员，可以通过类名直接调用，方便
    ```java
    Person.country = "中国";
    Person.method();
    ```
- 注意事项：
	* 静态的成员，随着类的加载而加载，优先于对象存在
	* 在静态方法中，没有this关键字
	* 静态方法中，只能调用静态的成员(静态成员变量，静态成员方法)

### abstract

### 权限修饰符小结
权限修饰符对各位置中访问性的限制

|位置\修饰符 |public  |protected|	默认的|	private|
|-----|:------:|:------:|:-----:|:-------:|
|在当前类中|Y|Y|Y|Y|
|同一包中的其他类|Y|Y|Y||
|不同包中的子类|Y|Y|||
|不同包中的其他类|Y||||

### 各种字段可能使用的修饰符

|修饰符\字段|类|成员变量|成员方法|构造方法|局部变量|
|:----:|:----:|:----:|:----:|:----:|:----:|
|public|    Y | Y | Y | Y |   |
|protected|   | Y | Y | Y |   |
|默认|      Y | Y | Y | Y |   |
|private|     | Y | Y | Y |   |
|final|     Y | Y | Y |   | Y |
|static|      | Y | Y |   |   |
|abstract|  Y |   | Y |   |   |

有的修饰符不可能同时使用，比如`abstract`与`private`、`static`、`final`不会同时出现。

## 内部类

在一个类中，定义了一个新类，这个新的类就是内部类	
```java
class A {//外部类
    class B{// 内部类
    }
}
```
### 特点 

内部类可以直接访问外部类的成员，包含私有的成员

### 匿名内部类
举例
```java
new OneInterface(){
    public void implementedMethod(){
        // implemention
    }
}.implementedMethod();
```
## 包

### 声明
`package 包名.包名.包名…;`

### 带包名对象的创建
`包名.类名 变量名 = new包名.类名();`

### 导包
`import 包名.类名;`

## 代码块
- 局部代码块：定义在方法中的，用来限制变量的作用范围
- 构造代码块：定义在类中方法外，用来给对象中的成员初始化赋值
- 静态代码块：定义在类中方法外，用来给类的静态成员初始化赋值
- 运行顺序：静态代码块最早， 构造代码块在对象创建过程中运行，早于构造方法。
