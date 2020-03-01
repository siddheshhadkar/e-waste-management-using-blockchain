pragma solidity ^0.5.16;

contract AddressManager{

    address owner;
    mapping(string => address) public contractAddress;

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    constructor() public{
        owner = msg.sender;
    }

    function setAddress(string memory _contractName, address _contractAddress) public onlyOwner{
        contractAddress[_contractName] = _contractAddress;
    }

    function getAddress(string memory _contractName) view public returns(address){
        return contractAddress[_contractName];
    }
}
