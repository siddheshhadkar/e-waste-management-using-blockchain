pragma solidity >=0.4.21 <0.7.0;

import "./AddressManager.sol";
 
contract Producer {

	mapping (uint => mapping (address => Product)) public ReturnedProduct;
	
	address owner;
	address producer;
	AddressManager amInstance;
	uint tempproductCount;
	uint returnedProductCount;


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
        string type;
        uint weightOfGlass;
        uint weightOfPlastic;
        uint weightOfNickel;
        uint weightOfAluminium;
        uint weightOfCopper;
        uint weightOfMagnesium;
        uint weightOfLead;
        bool recycled;
    }
	
	constructor(address _addressManager) public {
    	owner=msg.sender;
    	amInstance=AddressManager(address(_addressManager));
	}

	function setProducerAddress (address _producer) public onlyOwner {
		producer=_producer;
	}
	

	function addProduct (string memory _name,string memory _type,
		uint _weightOfAluminium,uint _weightOfNickel,
		uint _weightOfGlass,uint _weightOfPlastic,
		uint _weightOfCopper,uint _weightOfMagnesium,uint _weightOfLead) public onlyProducer {
		
		tempproductCount = amInstance.productCount();
		tempproductCount++;
		amInstance.ProductList[tempproductCount][msg.sender]=Product(msg.sender,'0x0','0x0','0x0',_name,_type
			_weightOfGlass,_weightOfPlastic,_weightOfNickel,_weightOfAluminium,_weightOfCopper
			,_weightOfMagnesium,_weightOfLead,false);
	}

	function addReturnProduct (uint _key) public onlyProducer{
		returnedProductCount++;
		ReturnedProduct[returnedProductCount][msg.sender]=amInstance.ProductList[_key][msg.sender];
	}
	



	

}
