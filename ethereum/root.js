//this is for root contract 
import web3 from "./web3";
import root from "./build/Root.json";
const instance = new web3.eth.Contract(
    JSON.parse(root.interface),
    '0x21AF3206f7D4262CC8594bd8D626643765E0a853'
);
export default instance;