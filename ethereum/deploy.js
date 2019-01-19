const HWP = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const root = require('./build/Root.json');

const provider = new HWP('Your 12 word metamask key',
    'https://rinkeby.infura.io/qSOlN4Vr4L7kJUG26FRY');
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Deploy on Account (Contract Owner): ", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(root.interface))
        .deploy({ data: '0x' + root.bytecode, arguments: ['CoinName', 'CoinSymbol'] })
        .send({ from: accounts[0], gas: '3000000' });
    console.log("Contract Address : ", result.options.address);
}

deploy();