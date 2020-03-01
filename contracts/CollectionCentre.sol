pragma solidity ^0.5.16;
import "./AddressManager.sol";
import "./Producer.sol";
import "./RecycleUnit.sol";

contract CollectionCentre{
	mapping(uint => CollectionCentreDetails) CollectionCentres;
    address owner;
    uint public collectionCentreCount;
    address public producerContractAddress;
    address public recycleUnitContractAddress;
    AddressManager amInstance;
    Producer producerInstance;
    RecycleUnit recycleUnitInstance;

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    constructor(address _addressManager) public{
        owner = msg.sender;
        amInstance = AddressManager(address(_addressManager));
    }

    struct CollectionCentreDetails{
        uint _id;
        string _name;
    }

    function addCollectionCentre(string memory _name) public{
        collectionCentreCount++;
        CollectionCentres[collectionCentreCount] = CollectionCentreDetails(collectionCentreCount, _name);
    }

    function createProducerInstance() public onlyOwner{
        producerContractAddress = amInstance.getAddress("Producer");
        producerInstance = Producer(address(producerContractAddress));
    }

    function createRecycleUnitInstance() public onlyOwner{
        recycleUnitContractAddress = amInstance.getAddress("RecycleUnit");
        recycleUnitInstance = RecycleUnit(address(recycleUnitContractAddress));
    }

    function receiveItemProducer() public{

    }
    function sendItemRecycleUnit() public{

    
    }
}
