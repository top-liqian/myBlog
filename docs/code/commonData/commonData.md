# 常用数据结构

## 数组、字符串（Array & String）

1. 字符串转化

数组和字符串是最基本的数据结构，在很多编程语言中都有着十分相似的性质，而围绕着它们的算法面试题也是最多的。

很多时候，在分析字符串相关面试题的过程中，我们往往要针对字符串当中的每一个字符进行分析和处理，甚至有时候我们得先把给定的字符串转换成字符数组之后再进行分析和处理

**经典面试题**

举例：翻转字符串“algorithm”

解法：用两个指针，一个指向字符串的第一个字符 a，一个指向它的最后一个字符 m，然后互相交换。交换之后，两个指针向中央一步步地靠拢并相互交换字符，直到两个指针相遇。这是一种比较快速和直观的方法。

注意：由于无法直接修改字符串里的字符，所以必须先把字符串变换为数组，然后再运用这个算法。

2. 数组

数组的优点在于：

+ 构建非常简单

+ 能在 O(1) 的时间里根据数组的下标（index）查询某个元素

而数组的缺点在于：

+ 构建时必须分配一段连续的空间

+ 查询某个元素是否存在时需要遍历整个数组，耗费 O(n) 的时间（其中，n 是元素的个数）

+ 删除和添加某个元素时，同样需要耗费 O(n) 的时间

所以，当你在考虑是否应当采用数组去辅助你的算法时，请务必考虑它的优缺点，看看它的缺点是否会阻碍你的算法复杂度以及空间复杂度。

**经典面试题**

举例：LeetCode 第 242 题：给定两个字符串 s 和 t，编写一个函数来判断 t 是否是 s 的字母异位词。

说明：你可以假设字符串只包含小写字母。

示例 1

输入: s = "anagram", t = "nagaram"

输出: true

示例 2

输入: s = "rat", t = "car"

输出: false

字母异位词，也就是两个字符串中的相同字符的数量要对应相等。例如，s 等于 “anagram”，t 等于 “nagaram”，s 和 t 就互为字母异位词。因为它们都包含有三个字符 a，一个字符 g，一个字符 m，一个字符 n，以及一个字符 r。而当 s 为 “rat”，t 为 “car”的时候，s 和 t 不互为字母异位词。

解题思路：

一个重要的前提“假设两个字符串只包含小写字母”，小写字母一共也就 26 个，因此：

可以利用两个长度都为 26 的字符数组来统计每个字符串中小写字母出现的次数，然后再对比是否相等；

可以只利用一个长度为 26 的字符数组，将出现在字符串 s 里的字符个数加 1，而出现在字符串 t 里的字符个数减 1，最后判断每个小写字母的个数是否都为 0。

按上述操作，可得出结论：s 和 t 互为字母异位词。


## 链表（LinkedList）

单链表：链表中的每个元素实际上是一个单独的对象，而所有对象都通过每个元素中的引用字段链接在一起。

双链表：与单链表不同的是，双链表的每个结点中都含有两个引用字段。

**链表的优缺点**

1. 链表的优点

+ 链表能灵活地分配内存空间；

+ 能在 O(1) 时间内删除或者添加元素，前提是该元素的前一个元素已知，当然也取决于是单链表还是双链表，在双链表中，如果已知该元素的后一个元素，同样可以在 O(1) 时间内删除或者添加该元素。

2. 链表的缺点

+ 不像数组能通过下标迅速读取元素，每次都要从链表头开始一个一个读取；

+ 查询第 k 个元素需要 O(k) 时间。

**应用场景：**

如果要解决的问题里面需要很多`快速查询`，链表可能并不适合；如果遇到的问题中，数据的元素个数不确定，而且需要经常进行数据的添加和删除，那么`链表`会比较合适。而如果数据元素大小确定，删除插入的操作并不多，那么`数组`可能更适合。

**经典解法:**

**1. 利用快慢指针（有时候需要用到三个指针）**

典型题目例如：链表的翻转，寻找倒数第 k 个元素，寻找链表中间位置的元素，判断链表是否有环等等

**2. 构建一个虚假的链表头**

一般用在要返回新的链表的题目中，比如，给定两个排好序的链表，要求将它们整合在一起并排好序。又比如，将一个链表中的奇数和偶数按照原定的顺序分开后重新组合成一个新的链表，链表的头一半是奇数，后一半是偶数。

在这类问题里，如果不用一个虚假的链表头，那么在创建新链表的第一个元素时，我们都得要判断一下链表的头指针是否为空，也就是要多写一条 if else 语句。比较简洁的写法是创建一个空的链表头，直接往其后面添加元素即可，最后返回这个空的链表头的下一个节点即可。

**建议：**在解决链表的题目时，可以在纸上或者白板上画出节点之间的相互关系，然后画出修改的方法，既可以帮助你分析问题，又可以在面试的时候，帮助面试官清楚地看到你的思路。

**例题分析**

LeetCode 第 25 题：给你一个链表，每 k 个节点一组进行翻转，请你返回翻转后的链表。k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序

**说明：**

1. 你的算法只能使用常数的额外空间。

2. 你不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。

示例：

给定这个链表：1->2->3->4->5

当 k=2 时，应当返回：2->1->4->3->5

当 k=3 时，应当返回：3->2->1->4->5

**解题思路：**

在翻转链表的时候，可以借助三个指针：prev、curr、next，分别代表前一个节点、当前节点和下一个节点

## 栈（Stack）

**特点：**栈的最大特点就是后进先出（LIFO）。对于栈中的数据来说，所有操作都是在栈的顶部完成的，只可以查看栈顶部的元素，只能够向栈的顶部压⼊数据，也只能从栈的顶部弹出数据。

**实现：**利用一个单链表来实现栈的数据结构。而且，因为我们都只针对栈顶元素进行操作，所以借用单链表的头就能让所有栈的操作在 O(1) 的时间内完成。

**应用场景：**在解决某个问题的时候，只要求关心最近一次的操作，并且在操作完成了之后，需要向前查找到更前一次的操作。如果打算用一个数组外加一个指针来实现相似的效果，那么，一旦数组的长度发生了改变，哪怕只是在最后添加一个新的元素，时间复杂度都不再是 O(1)，而且，空间复杂度也得不到优化。

**注意：**栈是许多 LeetCode 中等难度偏上的题目里面经常需要用到的数据结构，掌握好它是十分必要的。

利用堆栈，还可以解决如下常见问题：

+ 求解算术表达式的结果（LeetCode 224、227、772、770)

+ 求解直方图里最大的矩形区域（LeetCode 84）

## 队列（Queue）

**特点：**和栈不同，队列的最大特点是`先进先出（FIFO）`，就好像按顺序排队一样。对于队列的数据来说，我们只允许在队尾查看和添加数据，在队头查看和删除数据。

**实现：**可以借助双链表来实现队列。双链表的头指针允许在队头查看和删除数据，而双链表的尾指针允许我们在队尾查看和添加数据。

**应用场景：**直观来看，当我们需要按照一定的顺序来处理数据，而该数据的数据量在不断地变化的时候，则需要队列来帮助解题。在算法面试题当中，广度优先搜索（Breadth-First Search）是运用队列最多的地方，我们将在第 06 课时中详细介绍。

## 双端队列（Deque）

**特点：**双端队列和普通队列最大的不同在于，它允许我们在队列的头尾两端都能在 O(1) 的时间内进行数据的查看、添加和删除。

**实现：**与队列相似，我们可以利用一个双链表实现双端队列。

**应用场景：**双端队列最常用的地方就是实现一个长度动态变化的窗口或者连续区间，而动态窗口这种数据结构在很多题目里都有运用。

## 树（Tree）

树的结构十分直观，而树的很多概念定义都有一个相同的特点：递归，也就是说，一棵树要满足某种性质，往往要求每个节点都必须满足。例如，在定义一棵二叉搜索树时，每个节点也都必须是一棵二叉搜索树。

正因为树有这样的性质，大部分关于树的面试题都与递归有关，换句话说，面试官希望通过一道关于树的问题来考察你对于递归算法掌握的熟练程度。

1. 树的形状

在面试中常考的树的形状有：普通二叉树、平衡二叉树、完全二叉树、二叉搜索树、四叉树（Quadtree）、多叉树（N-ary Tree）。

对于一些特殊的树，例如红黑树（Red-Black Tree）、自平衡二叉搜索树（AVL Tree），一般在面试中不会被问到，除非你所涉及的研究领域跟它们相关或者你十分感兴趣，否则不需要特别着重准备。

关于树的考题，无非就是要考查树的遍历以及序列化（serialization)。

2. 树的遍历

+ 前序遍历（Preorder Traversal）

**方法：**先访问根节点，然后访问左子树，最后访问右子树。在访问左、右子树的时候，同样，先访问子树的根节点，再访问子树根节点的左子树和右子树，这是一个不断递归的过程。

**应用场景：**运用最多的场合包括在树里进行搜索以及创建一棵新的树。

+ 中序遍历（Inorder Traversal）

**方法：**先访问左子树，然后访问根节点，最后访问右子树，在访问左、右子树的时候，同样，先访问子树的左边，再访问子树的根节点，最后再访问子树的右边。

**应用场景：**最常见的是二叉搜索树，由于二叉搜索树的性质就是左孩子小于根节点，根节点小于右孩子，对二叉搜索树进行中序遍历的时候，被访问到的节点大小是按顺序进行的。

+ 后序遍历（Postorder Traversal）

**方法：**先访问左子树，然后访问右子树，最后访问根节点。

**应用场景：**在对某个节点进行分析的时候，需要来自左子树和右子树的信息。收集信息的操作是从树的底部不断地往上进行，好比你在修剪一棵树的叶子，修剪的方法是从外面不断地往根部将叶子一片片地修剪掉。