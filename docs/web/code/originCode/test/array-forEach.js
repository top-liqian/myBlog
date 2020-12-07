if(!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArgs) {
      if (this === null) {
        throw new TypeError(' this is null or not defined');
      }

      if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function');
      }

      const O = Object(this)
      const len = O.length
      let T = [], k = 0;
      if (arguments.length > 1) {
        T = thisArgs
      }
      while(k < len) {
        callback.call(T, O[k], k, O);
        k++;
      }
    }
}

