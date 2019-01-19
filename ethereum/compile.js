const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

var input = {
    'Root.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "Root.sol"), 'utf8'),
    'ERC721.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "ERC721.sol"), 'utf8'),
    'ERC721Basic.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "ERC721Basic.sol"), 'utf8'),
    'ERC721BasicToken.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "ERC721BasicToken.sol"), 'utf8'),
    'ERC721Holder.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "ERC721Holder.sol"), 'utf8'),
    'ERC721Receiver.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "ERC721Receiver.sol"), 'utf8'),
    'ERC721Token.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "ERC721Token.sol"), 'utf8'),
    'AddressUtils.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "AddressUtils.sol"), 'utf8'),
    'ERC165.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "ERC165.sol"), 'utf8'),
    'Math.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "Math.sol"), 'utf8'),
    'SafeMath.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "SafeMath.sol"), 'utf8'),
    'SupportsInterfaceWithLookup.sol': fs.readFileSync(path.resolve(__dirname, "contracts", "SupportsInterfaceWithLookup.sol"), 'utf8'),
};
const compiledOutput = solc.compile({ sources: input }, 1).contracts;
//console.log(compiledOutput);

//--------------------------------------------------------------------------------------------
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

for (let contract in compiledOutput) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '').split('.sol')[1] + '.json'),
        compiledOutput[contract]
    )
}
console.log("Done Compiling");