pragma solidity >=0.4.21 <0.7.0;

import "./AddressManager.sol";

contract Producer {

	mapping (uint => Product) public newProducts;
	mapping (uint => Product) public returnedProducts;

	address owner;
	address producer;
	AddressManager amInstance;
	uint newProductsCount;
	uint returnedProductsCount;


	modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier onlyProducer(){
        require(msg.sender == producer);
        _;
    }

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

	constructor(address _addressManager) public {
    	owner=msg.sender;
    	amInstance=AddressManager(address(_addressManager));
	}

	function addProduct(string memory _name,string memory _type,
		uint _weightOfAluminium, uint _weightOfNickel, uint _weightOfGlass, uint _weightOfPlastic,
		uint _weightOfCopper, uint _weightOfMagnesium, uint _weightOfLead) public onlyProducer {

		newProductsCount++;
		newProducts[newProductsCount]=Product(msg.sender,
			0x0000000000000000000000000000000000000000,
			0x0000000000000000000000000000000000000000,
			0x0000000000000000000000000000000000000000,
			_name,_type,
			_weightOfGlass,_weightOfPlastic,_weightOfNickel,_weightOfAluminium,_weightOfCopper
			,_weightOfMagnesium,_weightOfLead);
	}

	function addReturnProduct(uint _id) public onlyProducer{
		returnedProductsCount++;
		returnedProducts[returnedProductsCount] = newProducts[_id];
	}
}
