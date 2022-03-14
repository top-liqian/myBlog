var a = [
    {id: 1, name: '部门1', pid: 0},
    {id: 2, name: '部门2', pid: 1},
    {id: 3, name: '部门3', pid: 1},
    {id: 4, name: '部门4', pid: 3},
    {id: 5, name: '部门5', pid: 4},
]

function toTree(_arr) {
    return _arr.map(item => {
        item.children = _arr.filter(it => it.pid === item.id)
        return item
    }).filter(it => !it.pid)
}

console.log(toTree(a))