pragma solidity ^0.5.0;

import "./AddressManager.sol";
import "./Consumer.sol";
import "./CollectionCentre.sol";
import "./Retailer.sol";
import "./RecycleUnit.sol";
 
contract Producer {

	mapping (uint => address) public soldHistory;
	mapping (uint => Product)public productStock;
	
	address owner;
	address producer;
	AddressManager amInstance;
	uint productCount;
	uint balanceOfProducer;
	address public retailerContractAddress;
	address public recycleUnitContractAddress;
	address public collectionCentreContractAddress;
	Retailer retailerInstance;
	CollectionCentre collectionCentreInstance;
	RecycleUnit recycleUnitInstance;

	modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier onlyProducer(){
        require(msg.sender == producer);
        _;
    }

    struct Product {
    	string name;
    	string typeOfProduct;
    }
    
	
	constructor(address _addressManager) public {
    	owner=msg.sender;
    	amInstance=AddressManager(address(_addressManager));
	}

	function setProducerAddress (address _producer) public onlyOwner {
		producer=_producer;
	}
	

	function addProduct (string memory _name,string memory _type) public onlyProducer{
		productCount++;
		productStock[productCount]=Product(_name,_type);
	}

	function createRetailerInstance() public onlyOwner{
        retailerContractAddress = amInstance.getAddress("Retailer");
        retailerInstance = Retailer(address(retailerContractAddress));
    }
    
    function createRecycleUnitInstance() public onlyOwner{
        recycleUnitContractAddress = amInstance.getAddress("RecycleUnit");
        recycleUnitInstance = RecycleUnit(address(recycleUnitContractAddress));
    }
    
    function createCollectionCentreInstance() public onlyOwner{
        collectionCentreContractAddress = amInstance.getAddress("CollectionCentre");
        collectionCentreInstance = CollectionCentre(address(collectionCentreContractAddress));
    }
	
	function sellToRetailer(address _addressRetailer,uint _productId) public payable{
// 		uint amount=msg.value;
// 		balanceOfProducer+=amount;

		
		
		soldHistory[_productId]=_addressRetailer;
	}



	

}
