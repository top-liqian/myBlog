const xhr = new XMLHttpRequest()
xhr.open("GET", "http://www.baidu.com")
xhr.onreadystatechange = function () {
if (xhr.status === 200) {
    console.log('done')
} else {
    console.log('error')
}
}
xhr.send()