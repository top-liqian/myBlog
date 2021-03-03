function _ajax (method, url, params, callback) {
    method = method.toUpperCase()
    let _params = ''

    if (method === 'GET') {
        if (typeof params === 'object') {
            Object.keys(params).forEach((el, index) => {
                _params += `${index === 0 ? '?' : '&'}${el}=${params[el]}`
            })
        } else {
            _params = params
        }
    } else {
        _params = params
    }
    
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState !== 4) return 
      callback(xhr.responseText)
    }
    if (method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(post_params)
    } else {
        xhr.open(method, url + _params, false)
    }
}

_ajax('GET', 'http://www.baidu.com', { a: 1, b: 2 }, data => console.log(data))


function multiRequest(urls = [], maxnum) {
   const len = urls.length

   const result = new Array(len).fill(false)

   let count = 0

    return new Promise((resolve, reject) => {
        while (count < maxnum) {
           next()
        }

        function next () {
            let current = count++

            if(current >= len) {
                !result.includes(false) && resolve(result)
                return
            }

            const url = urls[current]

            new Promise((resolveFn, rejectFn) => {

            })
            .then(() => {

            })
            .catch(() => {

            })
        }
    })
}