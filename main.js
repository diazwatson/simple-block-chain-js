const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    minedBlock(difficulty){
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash)
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block(0, '2017-12-1', 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.minedBlock(this.difficulty);
        this.chain.push(newBlock);

    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            return true;
        }
    }
}

let redCoin = new Blockchain();

console.log("Mining block 1...");

redCoin.addBlock(new Block(1, '2017-12-10', {amount: 2, from: 'Bob', to: 'Mike'}));

console.log('Is blockChainValid? ' + redCoin.isChainValid());

console.log("Mining block 2...");

redCoin.addBlock(new Block(2, '2017-12-18', {amount: 4, from: 'Mike', to: 'Bob'}));

console.log('Is blockChainValid? ' + redCoin.isChainValid());


// console.log(JSON.stringify(redCoin, null, 4));
