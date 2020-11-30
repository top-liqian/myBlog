const url = 'http://sample.com/?a=1&b=2&c=xx&d=2#hash';

function queryString(string) {
   const url = new URL(string)
   const search = new URLSearchParams(url.search)
   const obj = {}
   search.forEach((v, k) => { obj[k] = v })
   return obj
}

const result = queryString(url)

console.log(result)

function queryString1(string) {
    const url = new URL(string)
    const obj = {}
    url.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => {
        console.log(_, k, v) 
        obj[k] = v 
    })
    return obj
}

const result1 = queryString1(url)

console.log(result)