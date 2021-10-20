function jsontoStringify(data) {
    // 判断对象是否存在循环引用

    const isCyclic = (obj) => {
        let detected = false
        const stackSet = new Set()

        const detect = (obj) => {
            // 不是对象类型的话，可以直接跳过
            if (obj && typeof obj != 'object') {
                return
            }
            if (stackSet.has(obj)) {
                return detected = true
            }
    
            stackSet.add(obj)
    
            for(let key in obj) {
                // 对obj下的属性进行挨个检测
                if (obj.hasOwnProperty(key)) {
                    detect(obj[key])
                }
            }
            // 平级检测完成之后，将当前对象删除，防止误判
            stackSet.delete(obj)
        }
        detect(obj)
        return detected
    }

    // 特性1：对于包含循环引用的对象（对象之间相互引用，造成无限循环）使用这个方法的时候会抛出错误
    if(isCyclic(data)) {
        throw new Error('Convering circular structure to JSON')
    }

    // 特性2: 对于BigInt类型的数据进行转换的过程中会抛出错误
    if (typeof data === 'bigint') {
        throw new Error('Do not konw how to trun to bigint')
    }

    const type = typeof data
    const commonKeys = ['undefined', 'symbol', 'function']
    const getType = s => Object.prototype.toString.call(s).replace(/\[object (.*?)\]/g, '$1').toLowerCase()

    // 非对象
    if (type !== 'object' || data === null) {
        let result = data
        // 特性3: 对于NAN，null，Infinity执行该方法时都会被转换成null
        if([NaN, null,  Infinity].includes(data)) {
            result = null
        } else if(commonKeys.includes(type)) { // 特性4: 'undefined', 'Symbol', 'function'单独转换的时候会返回undefined
            return undefined
        } else if (type === 'string') {
            result = `"${data}"`
        }
        return String(result)
    } else if (type === 'object') {
        // 特性5: 如果对象具有toJSON函数，函数的返回值就是要序列化的值
        // 特性6: 对于日期date调用了toJSON将其转换成了字符串，相当于执行了Date.toISOString，因此会被当作 字符串处理
        if (data.toJSON) {
            return jsontoStringify(data.toJSON())
        } else if (Array.isArray(data)) {
            // 特性4: 'undefined', 'Symbol', 'function在数组当中会被转换成null
            let result = data.map(it => commonKeys.includes(typeof it) ? 'null' : jsontoStringify(it))
            return `[${result}]`.replace(/'/g, '"')
        } else {
            // 特性7: number，string， boolean的包装对象在序列化的过程中会自动转换成其原始值
            if (['number', 'boolean'].includes(getType(data))) {
                return String(data)
            } else if(getType(data) === 'string') {
                return `"${data}"`
            } else {
                let result = []
                // 特性8: 对于Map/Set/WeakMap/WeakSet，只会序列化可枚举类型
                Object.keys(data).forEach(key => {
                    // 特性9: 对于Symbol类型的值即使使用replacer函数进行值的替换，序列化的过程中仍然会忽略掉
                    if(typeof key !== 'symbol') {
                        const value = data[key] 
                        // 特性4: 'undefined', 'Symbol', 'function在非数组对象当中会被忽略
                        if (!commonKeys.includes(typeof value)) {
                            result.push(`"${key}":${jsontoStringify(value)}`)
                        }
                    }
                })
                return `{${result}}`.replace(/'/g, '"')
            }
        }

    }
}

//  测试
// 1. 测试一下基本输出
console.log(jsontoStringify(undefined)) // undefined 
console.log(jsontoStringify(() => { })) // undefined
console.log(jsontoStringify(Symbol('前端胖头鱼'))) // undefined
console.log(jsontoStringify((NaN))) // null
console.log(jsontoStringify((Infinity))) // null
console.log(jsontoStringify((null))) // null
console.log(jsontoStringify({
  name: '前端胖头鱼',
  toJSON() {
    return {
      name: '前端胖头鱼2',
      sex: 'boy'
    }
  }
}))
// {"name":"前端胖头鱼2","sex":"boy"}

// 2. 和原生的JSON.stringify转换进行比较
console.log(jsontoStringify(null) === JSON.stringify(null));
// true
console.log(jsontoStringify(undefined) === JSON.stringify(undefined));
// true
console.log(jsontoStringify(false) === JSON.stringify(false));
// true
console.log(jsontoStringify(NaN) === JSON.stringify(NaN));
// true
console.log(jsontoStringify(Infinity) === JSON.stringify(Infinity));
// true
let str = "前端胖头鱼";
console.log(jsontoStringify(str) === JSON.stringify(str));
// true
let reg = new RegExp("\w");
console.log(jsontoStringify(reg) === JSON.stringify(reg));
// true
let date = new Date();
console.log(jsontoStringify(date) === JSON.stringify(date));
// true
let sym = Symbol('前端胖头鱼');
console.log(jsontoStringify(sym) === JSON.stringify(sym));
// true
let array = [1, 2, 3];
console.log(jsontoStringify(array) === JSON.stringify(array));
// true
let obj = {
  name: '前端胖头鱼',
  age: 18,
  attr: ['coding', 123],
  date: new Date(),
  uni: Symbol(2),
  sayHi: function () {
    console.log("hello world")
  },
  info: {
    age: 16,
    intro: {
      money: undefined,
      job: null
    }
  },
  pakingObj: {
    boolean: new Boolean(false),
    string: new String('前端胖头鱼'),
    number: new Number(1),
  }
}
console.log(jsontoStringify(obj) === JSON.stringify(obj)) 
// true
console.log((jsontoStringify(obj)))
// {"name":"前端胖头鱼","age":18,"attr":["coding",123],"date":"2021-10-06T14:59:58.306Z","info":{"age":16,"intro":{"job":null}},"pakingObj":{"boolean":false,"string":"前端胖头鱼","number":1}}
console.log(JSON.stringify(obj))
// {"name":"前端胖头鱼","age":18,"attr":["coding",123],"date":"2021-10-06T14:59:58.306Z","info":{"age":16,"intro":{"job":null}},"pakingObj":{"boolean":false,"string":"前端胖头鱼","number":1}}

// 3. 测试可遍历对象
let enumerableObj = {}

Object.defineProperties(enumerableObj, {
  name: {
    value: '前端胖头鱼',
    enumerable: true
  },
  sex: {
    value: 'boy',
    enumerable: false
  },
})

console.log(jsontoStringify(enumerableObj))
// {"name":"前端胖头鱼"}

// 4. 测试循环引用和Bigint

let obj1 = { a: 'aa' }
let obj2 = { name: '前端胖头鱼', a: obj1, b: obj1 }
obj2.obj = obj2

console.log(jsontoStringify(obj2))
// TypeError: Converting circular structure to JSON
console.log(jsontoStringify(BigInt(1)))
// TypeError: Do not know how to serialize a BigInt

