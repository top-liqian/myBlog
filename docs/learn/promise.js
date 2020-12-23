

try {
    const p = new Promise((resolve, reject) => {
        reject('1111')
    })
} catch (error) {
    console.log('444')
    console.log('error', error)
}