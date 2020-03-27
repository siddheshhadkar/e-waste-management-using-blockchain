pragma solidity >=0.4.21 <0.7.0;

import "./AddressManager.sol";

contract Producer {

	mapping (uint => Product) public newProducts;
// 	mapping (uint => Product) public returnedProducts;

    address owner;
	// AddressManager amInstance;
	uint newProductsCount;
// 	uint returnedProductsCount;


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
        bool returnedToProcuder;
        uint reusePercentage;
        uint[7] weights;
    }

	constructor(address _addressManager) public {
        owner=msg.sender;
    	amInstance=AddressManager(address(_addressManager));
	}

	function addProduct(string memory _name,string memory _type,
		uint _weightOfAluminium, uint _weightOfNickel, uint _weightOfGlass, uint _weightOfPlastic,
		uint _weightOfCopper, uint _weightOfMagnesium, uint _weightOfLead) public  {
    
        uint[7] memory temp;

        temp[0]=_weightOfGlass;
        temp[1]=_weightOfPlastic;
        temp[2]=_weightOfNickel;
        temp[3]=_weightOfAluminium;
        temp[4]=_weightOfCopper;
        temp[5]=_weightOfMagnesium;
        temp[6]=_weightOfLead;
        
		newProductsCount++;
		newProducts[newProductsCount]=Product(msg.sender,
			address(0),
			address(0),
			_name,_type,
			false,false,0,temp);
	}

	function addReturnProduct(uint _id) public {
	    newProducts[_id].returnedToProcuder=true;
	}
	
	function soldToRetailer(uint _id,address _retailer) public{
	    newProducts[_id].retailerAddress=_retailer;
	}
	
	function soldToConsumer(uint _id,address _consumer) public{
	    newProducts[_id].consumerAddress=_consumer;
	}
    
    function addPercentage(uint _id,uint _percentage) public{
        newProducts[_id].reusePercentage=_percentage;
    }

}
