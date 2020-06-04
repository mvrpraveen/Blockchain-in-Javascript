const SHA256 = require('crypto-js/sha256')

let Block = function (nonce, difficulty) {
    this.nonce = nonce
    this.difficulty = difficulty,
        this.timestamp = new Date().getTime(),
        this.hash = SHA256(JSON.stringify(this)).toString()
}

let block1 = new Block(0, 5)
const time1 = block1.timestamp
console.log(block1)

// CAlculating the number of zeroes
let counter = (input) => {
    let count = 0
    for (let i = 0; i < input.hash.length; i++) {
        if (input.hash[i] === '0') {
            count++
        } else {
            break
        }
    }
    return count
}

let zeroCount = counter(block1)
let newDifficulty = block1.difficulty++

while (zeroCount < block1.difficulty) {
    block1.nonce++
    let updatedBlock = new Block(block1.nonce, newDifficulty)
    block1.timestamp = updatedBlock.timestamp
    block1.hash = updatedBlock.hash
    zeroCount = counter(block1)
}

console.log(block1)

const time2 = block1.timestamp

blockTime = (time2 - time1) / 1000
console.log(blockTime)
