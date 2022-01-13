/*
 * @lc app=leetcode.cn id=167 lang=javascript
 *
 * [167] 两数之和 II - 输入有序数组
 */

// @lc code=start
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
   let l = 0, r = numbers.length - 1, mid
    while(l <= r) {
       mid = Math.floor((l + r) / 2)
       const total = numbers[l] + numbers[mid]
       if (total ===  target) return [l+1, mid+1]
       if (total < target) l = mid
       else r = mid
    }
};
//[2,7,11,15]\n9
//[2,3,4]\n6
//[-1,0]\n-1
// @lc code=end

