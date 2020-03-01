pragma solidity ^0.5.16;
import "./AddressManager.sol";
import "./CollectionCentre.sol";
import "./Producer.sol";

contract RecycleUnit{

    mapping(uint => RecycleUnitDetails) RecycleUnits;
    uint public RecycleUnitCount;
    address public collectionCentreContractAddress;
    address owner;
    AddressManager amInstance;
    CollectionCentre collectionCentreInstance;
    address public producerContractAddress;
    Producer producerInstance;

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    constructor(address _addressManager) public{
        owner = msg.sender;
        amInstance = AddressManager(address(_addressManager));
    }

    struct RecycleUnitDetails{
        uint _id;
        string _name;
    }

    function addRecycleUnit(string memory _name) public{
        RecycleUnitCount++;
        RecycleUnits[RecycleUnitCount] = RecycleUnitDetails(RecycleUnitCount, _name);
    }

    function createCollectionCentreInstance() public onlyOwner{
        collectionCentreContractAddress = amInstance.getAddress("CollectionCentre");
        collectionCentreInstance = CollectionCentre(address(collectionCentreContractAddress));
    }
    
    function createProducerInstance() public onlyOwner{
        producerContractAddress = amInstance.getAddress("Producer");
        producerInstance = Producer(address(producerContractAddress));
    }

    function receiveItemCollectionCentre() public{

    }
}
