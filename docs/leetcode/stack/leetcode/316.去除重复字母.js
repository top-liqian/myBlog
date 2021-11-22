/*
 * @lc app=leetcode.cn id=316 lang=javascript
 *
 * [316] 去除重复字母
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var removeDuplicateLetters = function(s) {
    if(s === '') return []
    let stack = []

    let flag

    for (let item of s) {
        if (stack.length === 0) {
            stack.push(item)
        } else {
            for(let i = 0; i < stack.length; i++) {
                if (stack[i] === item) {
                    flag = i
                }
             }
            if (stack[stack.length - 1] < item) {
                stack.splice(flag, 1)
                stack.push(item)
            } else {
                stack.push(item) 
            }
        }
        
    }
    
    return stack.join('')
};
// @lc code=end

