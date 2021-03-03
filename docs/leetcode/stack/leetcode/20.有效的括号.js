/*
 * @lc app=leetcode.cn id=20 lang=javascript
 *
 * [20] 有效的括号
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    if (s === '') return true

    if (s.length % 2 === 1) return false

    var stack = []

    for (let item of s) {
        if (item === '[' || item === '(' || item === '{') {
            stack.push(item)
        } else {
            const lastItem = stack[stack.length - 1]
            if (
                lastItem === '[' && item === ']' || 
                lastItem === '(' && item === ')' || 
                lastItem === '{' && item === '}'
            ) {
                stack.pop()
            } else {
                return false
            }
        }
    }
    return !(stack.length)
};




// @lc code=end

