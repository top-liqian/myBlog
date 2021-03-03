function isValid(s) {
    if (s === null || s.length === 0) {
        return true;
    }
    if (s.length % 2 === 1) {
        return false;
    }
    let leftBraceNumber = 0
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            leftBraceNumber++
        }  else if (s[i] === ')') {
            if (leftBraceNumber <= 0) {
                // 如果弹栈失败，那么返回false
                return false;
            }
            --leftBraceNumber;
        }
    }
    return leftBraceNumber == 0;
}

const s = '(((())))'

const result = isValid(s)

console.log('result', result)