
const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


/*-------------------------------------------------Defining the block class---------------------------------------------*/

class Block {

    constructor(index, difficulty, transactionsRoot = '', prevHash, nonce) {
        this.index = index
        this.difficulty = difficulty
        this.transactionsRoot = transactionsRoot
        this.timestamp = new Date().getTime()
        this.prevBlockHash = prevHash
        this.hash = this.getHash()
        this.nonce = nonce
    }

    stringify() {
        return JSON.stringify(this)
    }

    getHash() {
        return SHA256(JSON.stringify(this)).toString()
    }

}





/*------------------------------------------------Defining the Blockchain class ------------------------------------------*/


class Blockchain {

    constructor() {
        this.blockchain = [this.genesisBlock()]
        this.transactionsPool = []
    }

    genesisBlock() {
        let genesis = new Block(0, '0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '', '000000000000000000', 0)
        genesis.difficulty = genesis.difficulty.indexOf('f')
        return genesis
    }

    getLatestBlock() {
        return this.blockchain[this.blockchain.length - 1]
    }


    addTransaction(txn) {
        this.transactionsPool.push(SHA256(txn).toString())
    }

    computeTransactionsRoot() {
        return SHA256(JSON.stringify(this.transactionsPool)).toString()
    }

    calculateDifficulty(block) {

        let mineRate = 20000
        let lastBlock = this.getLatestBlock()
        const lastBlockTimestamp = lastBlock.timestamp
        const blockBeforeTimestamp = this.blockchain[lastBlock.index - 1].timestamp
        const blockTime = lastBlockTimestamp - blockBeforeTimestamp

        if (blockTime > mineRate) {
            return block.difficulty - 1
        } else {
            return block.difficulty + 1
        }
    }


    zeroesInHash(input) {
        let count = 0
        for (let i = 0; i < input.length; i++) {
            if (input[i] === '0') {
                count++
            } else {
                break
            }
        }
        return count
    }


    proofOfWork(block) {
        block.hash = block.getHash()
        let zeroCount = this.zeroesInHash(block.hash)

        while (zeroCount < block.difficulty) {
            block.nonce++
            let updatedBlock = new Block(block.index, block.difficulty, block.transactionsRoot, block.hash, block.nonce)
            block.timestamp = updatedBlock.timestamp
            block.hash = updatedBlock.hash
            zeroCount = this.zeroesInHash(block.hash)
        }
    }


    mine(block) {

        block.transactionsRoot = this.computeTransactionsRoot()
        if (block.index > 3) {
            block.difficulty = this.calculateDifficulty(block)
        }
        this.proofOfWork(block)
        block.transactions = JSON.stringify(this.transactionsPool)
        this.blockchain.push(block)
        this.transactionsPool = []

    }

}


/*-----------------------------------------------Defining the wallet class---------------------------------------------*/


class Wallet {

    constructor() {
        this.keys = this.generateKeys()
        this.txnindex = 0

    }

    generateKeys() {

        const key = ec.genKeyPair()
        const publicKey = "04" + key.getPublic().getX().toString('hex') + key.getPublic().getY().toString('hex')
        const privateKey = key.getPrivate('hex');


        return {
            key: key,
            publicKey: publicKey,
            privateKey: privateKey
        }
    }

    createTransaction(to, amount) {
        return {
            index: this.txnindex,
            from: this.address,
            to: to,
            amount: amount,
        }
    }

    toHex(input) {

        let str = JSON.stringify(input)
        let hexStr = '', c;
        for (let i = 0; i < str.length; i++) {
            c = str.charCodeAt(i);
            hexStr += c.toString(16) + '';
            return hexStr;
        }
    }

    sign(transaction) {
        let hexTxn = this.toHex(transaction)
        let signedTransaction = this.keys.key.sign(hexTxn)
        this.txnindex++
        return signedTransaction
    }

}



/*--------------------------------------------Instantiating with the blockchain---------------------------------------------*/

//initialise the chain
let rubyChain = new Blockchain()

//initialise the wallet
let rubyWallet = new Wallet()

//Add two transactions to rubychain

let txn1 = rubyWallet.sign(rubyWallet.createTransaction('praveen', 100))
let txn2 = rubyWallet.sign(rubyWallet.createTransaction('wowRuby', 50))

rubyChain.addTransaction(txn1)
rubyChain.addTransaction(txn2)

//Create and mine one Block



for (let i = 0; i < 5; i++) {
    let newBlock = new Block(rubyChain.getLatestBlock().index + 1, rubyChain.getLatestBlock().difficulty, '', rubyChain.getLatestBlock().hash, 0)

    rubyChain.mine(newBlock)
    console.log(newBlock)
}


