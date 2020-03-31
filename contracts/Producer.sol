pragma solidity >=0.4.21 <0.7.0;

import "./AddressManager.sol";

contract Producer {

    address owner;
	AddressManager amInstance;

	modifier onlyOwner(){
         require(msg.sender == owner);
         _;
     }

    // 0 weightOfGlass;
    // 1 weightOfPlastic;
    // 2 weightOfNickel;
    // 3 weightOfAluminium;
    // 4 weightOfCopper;
    // 5 weightOfMagnesium;
    // 6 weightOfLead;

    struct Product {
        address producerAddress;
        address retailerAddress;
        address consumerAddress;
        string name;
        string typeOfProduct;
        bool returnedToRetailer;
        bool returnedToProducer;
        uint reusePercentage;
        uint[7] weights;
        uint price;
    }

    Product[] public ProductList;

	constructor(address _addressManager) public {
        owner=msg.sender;
    	amInstance=AddressManager(address(_addressManager));
	}

	function addProduct(string memory _name,string memory _type,
		uint _weightOfAluminium, uint _weightOfNickel, uint _weightOfGlass, uint _weightOfPlastic,
		uint _weightOfCopper, uint _weightOfMagnesium, uint _weightOfLead,uint _price) public  {

        uint[7] memory temp;

        temp[0]=_weightOfGlass;
        temp[1]=_weightOfPlastic;
        temp[2]=_weightOfNickel;
        temp[3]=_weightOfAluminium;
        temp[4]=_weightOfCopper;
        temp[5]=_weightOfMagnesium;
        temp[6]=_weightOfLead;

		ProductList.push(Product(msg.sender,
			address(0),
			address(0),
			_name,_type,
			false,false,0,temp,_price));
	}

	function getProductCount() public view returns(uint){
	    return ProductList.length;
	}

	function addReturnProduct(uint _id) public {
	    ProductList[_id].returnedToProducer=true;
	}

	function addReturnProductToRetailer(uint _id) public {
	    ProductList[_id].returnedToRetailer=true;
	}

	function soldToRetailer(uint _id,address _retailer) public{
	    ProductList[_id].retailerAddress=_retailer;
	}

	function soldToConsumer(uint _id,address _consumer) public{
	    ProductList[_id].consumerAddress=_consumer;
	}

    function addPercentage(uint _id,uint _percentage) public{
        ProductList[_id].reusePercentage=_percentage;
    }

    //Consumer Methods
    function fetchProductReferenceConsumer(address _address) public view returns(uint){

    }

}
