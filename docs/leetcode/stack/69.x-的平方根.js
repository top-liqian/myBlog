/*
 * @lc app=leetcode.cn id=69 lang=javascript
 *
 * [69] x 的平方根
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function(x) {
    if (x === 0) return 0
    let l = 0, r = x, mid
    while(l <= r) {
       mid = Math.floor((l + r)/2)
       const sqrt = mid * mid
       if(sqrt === x) return mid
       if (sqrt > x) r = mid - 1
       else l = mid + 1
    }
    return l > r ? r : l
};
// @lc code=end

