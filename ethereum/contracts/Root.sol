pragma solidity ^0.4.24;

import "./ERC721Token.sol";
contract Root is ERC721Token{

    struct Property{
        string _name; // This is not owner name
        uint256 _tokenId;       
    }

    struct Requests {
        address _from;
        address _to;
        uint256 _tokenId;
        uint256 _value;
        bool _done;
        uint256 _ownIndex;
    }
    Requests[] public requests;
    mapping(address => Requests[]) internal paymentRequests;

    Property[] internal property;
    address public registrar;

    modifier restricted(){
        require(msg.sender==registrar);
        _;
    }
    constructor(string _name, string _symbol) ERC721Token(_name,_symbol) public{
        registrar = msg.sender;
    }
    
    // Registration of New Property and Owner of that
    function registerProperty(address _to,string _name,uint _value) public restricted{  
        uint256 _id = uint(keccak256(now,property.length)); // Automatic Incremented // give hash of struct into id in future implimentation
        property.push(Property(_name,_id));
        _mint(this,_id);
        this.tranferRequests(this,_to,_id,_value);
        //_setTokenURI(id,'%LinkURI%');
    }
    function pay(uint256 _uindex) public payable{
        require(paymentRequests[msg.sender].length>0);

        Requests storage req = paymentRequests[msg.sender][_uindex];
        Requests storage reqUser = requests[req._ownIndex];
        require(!req._done);
        require(!reqUser._done);

        req._done = true;
        reqUser._done = true;
    }

    function tranferRequests(address _from,address _to,uint256 _tokenId,uint _value ) public {
        approve(registrar, _tokenId);
        Requests memory newReq = Requests({
            _from : _from,
            _to : _to,
            _tokenId : _tokenId,
            _value : _value,
            _done : false,
            _ownIndex : requests.length
        });
        requests.push(newReq);
        paymentRequests[_to].push(newReq);
    }

    function getPaymentRequestCount(address user) public view returns(uint256){
        return paymentRequests[user].length;
    }
    function getPaymentRequests(address user,uint256 index)public view returns(address,address,uint256,uint256,bool,uint256){
        Requests storage req = paymentRequests[user][index];
        return (
            req._from,
            req._to,
            req._tokenId,
            req._value,
            req._done,
            req._ownIndex
        );
    }

    function getPandingRequestsCount() public view returns(uint256){
        return requests.length;
    }

    function pandingRequests(uint256 _index)public view returns(address,address,uint256,uint256,bool,uint256){
        Requests storage req = requests[_index];
        return (
            req._from,
            req._to,
            req._tokenId,
            req._value,
            req._done,
            req._ownIndex
        );
    }

    function transferOwnership(address _to,uint256 _index)public restricted{
        require(paymentRequests[_to].length>0);
        Requests storage req = requests[_index];
        require(req._done);
        
        safeTransferFrom(req._from,_to, req._tokenId);
        if(req._from == address(this))
            registrar.transfer(req._value);
        else
            req._from.transfer(req._value);

        uint256 lastIndex = requests.length.sub(1);
        Requests storage lastReq = requests[lastIndex];
        lastReq._ownIndex = _index;
        requests[_index] = lastReq;
        delete requests[lastIndex];
        requests.length--;
    }
}