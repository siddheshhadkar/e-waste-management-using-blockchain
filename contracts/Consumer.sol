pragma solidity >=0.4.21 <0.7.0;
import "./AddressManager.sol";

contract Consumer{

    address owner;
    AddressManager amInstance;
    uint public consumerProductsCount;

    mapping (uint => Product) public consumerProducts;

    struct Product {
        address producerAddress;
        address retailerAddress;
        address consumerAddress;
        address collectionAddress;
        string name;
        string typeOfProduct;
        uint weightOfGlass;
        uint weightOfPlastic;
        uint weightOfNickel;
        uint weightOfAluminium;
        uint weightOfCopper;
        uint weightOfMagnesium;
        uint weightOfLead;
        // bool recycled;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    constructor(address _addressManager) public{
        owner = msg.sender;
        amInstance = AddressManager(address(_addressManager));
    }

    // function buyFromRetailer(uint _productId,address _producerid) public {
    //     amInstance.ProductList[_productId][_producerid].consumerAddress=msg.sender;
    //     consumerProductCount++;
    //     ConsumerProductList[consumerProductCount][msg.sender]=amInstance.ProductList[_productId][_producerid];
    // }


    function sellWaste() public{
        //TODO: code for selling waste

        //receivePayment();
    }

    function receivePayment() public payable{

    }
}
