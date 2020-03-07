pragma solidity >=0.4.21 <0.7.0;
import "./AddressManager.sol";

contract Retailer{

    mapping (uint => mapping (address => Product)) public RetailerProductList;
    
    uint public retailerProductCount;
    address owner;
    AddressManager amInstance;

    struct Product {
        address producerAddress;
        address retailerAddress;
        address consumerAddress;
        address collectionAddress;
        string type;
        uint weightOfGlass;
        uint weightOfPlastic;
        uint weightOfNickel;
        uint weightOfAluminium;
        bool recycled;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    constructor(address _addressManager) public{
        owner = msg.sender;
        amInstance = AddressManager(address(_addressManager));
    }

    

    function buyFromProducer(uint _productId,address _producerAddress) public {
        amInstance.ProductList[_productId][_producerAddress]['retailerAddress']=msg.sender;
        retailerProductCount++;
        RetailerProductList[retailerProductCount][msg.sender]=amInstance.ProductList[_productId][_producerAddress];
    }
    
    function makeConsumerPayment() public payable{

    }

    function receiveProducerPayment() public payable{

    }

    function receiveConsumerItem() public{

    }

    function sellItemProducer() public{
        
    }
}
