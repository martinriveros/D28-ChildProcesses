console.time('one line execution time')

let lalala = (function Now(){
    console.log('lalala');
}())
console.log(typeof lalala)
console.timeEnd('one line execution time')
