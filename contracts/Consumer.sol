pragma solidity ^0.5.16;
import "./AddressManager.sol";
import "./Retailer.sol";

contract Consumer{

    mapping(uint => ConsumerDetails) consumers;
    uint public consumerCount;
    address public retailerContractAddress;
    address owner;
    AddressManager amInstance;
    Retailer retailerInstance;

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    constructor(address _addressManager) public{
        owner = msg.sender;
        amInstance = AddressManager(address(_addressManager));
    }

    struct ConsumerDetails{
        uint _id;
        string _name;
    }

    function addConsumer(string memory _name) public{
        consumerCount++;
        consumers[consumerCount] = ConsumerDetails(consumerCount, _name);
    }

    function createRetailerInstance() public onlyOwner payable{
        retailerContractAddress = amInstance.getAddress("Retailer");
        retailerInstance = Retailer(address(retailerContractAddress));
    }

    function sellWaste() public{
        //TODO: code for selling waste 
        
        //receivePayment();
    }

    function receivePayment() public payable{

    }
}
