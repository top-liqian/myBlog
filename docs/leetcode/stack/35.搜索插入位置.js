/*
 * @lc app=leetcode.cn id=35 lang=javascript
 *
 * [35] 搜索插入位置
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    const length = nums.length
    if (!length) return 0
    let l = 0, r = length - 1, mid;
    while(l <= r) {
        mid = Math.floor((l + r) / 2)
        if(nums[mid] === target) {
            return mid
        } else if (l === r) {
            return nums[mid] < target ? mid + 1 : mid
        }
        if (nums[mid] > target){
            if(mid === 0) return mid
            r = mid - 1
        } 
        else{
            if(mid === length - 1) return length
            l = mid + 1
        } 
    }
    return nums[r] < target ? l : r
};
// [1,3,5,6]\n7
// [1,3,5,6]\n0
// [1,3,5,6]\n5
// [1,3,5,6]\n2
// [1]\n0
// @lc code=end

