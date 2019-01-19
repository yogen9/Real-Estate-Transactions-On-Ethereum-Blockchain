var Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/qSOlN4Vr4L7kJUG26FRY');

const acc1 = '';
const acc2 = '';

const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');

web3.eth.getTransactionCount(acc1, (err, txnCount) => {
    //Build Transaction
    const txnObj = {   // no need to add 'from' in txn object because source will sign upon it and that's how source is identified 
        nonce: web3.utils.toHex(txnCount),
        to: acc2,
        value: web3.utils.toHex(web3.utils.toWei('1', 'ether')),
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web.utils.toHex(web3.utils.toWei('10', 'gwei'))
    }
    console.log(txnObj);

    //Sign the Transaction 
    const tx = new Tx(txnObj);
    tx.sign(privateKey);

    const serializeTransaction = tx.serialize();
    const row = '0x' + serializeTransaction.toString('hex');

    //Broadcast the Transaction 
    web3.eth.sendSignedTransaction(row, (err, txHash) => {
        console.log(txHash);
    })
});