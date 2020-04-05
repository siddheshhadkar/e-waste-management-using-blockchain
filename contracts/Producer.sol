pragma solidity >=0.4.21 <0.7.0;

import "./AddressManager.sol";

contract Producer {

    address owner;

	modifier onlyOwner(){
         require(msg.sender == owner);
         _;
    }

    uint public cost;

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

	constructor() public {
        owner=msg.sender;
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
	 function compareStrings (string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );

    }

   
	function soldToRetailer(address _producer,string memory _name,string memory _type,uint _quantity) public{
        uint _sum=0;
        for(uint i=0;i<ProductList.length;i++){
            if(ProductList[i].producerAddress==_producer && 
            compareStrings(ProductList[i].typeOfProduct,_type) && 
            compareStrings(ProductList[i].name,_name) 
            && _quantity>0 && ProductList[i].retailerAddress==address(0)){

                ProductList[i].retailerAddress=msg.sender;
                _quantity--;
                _sum=_sum+ProductList[i].price;
                
            }
        }
        cost=_sum;    
	}

	function soldToConsumer(address _retailer,string memory _name,string memory _type,uint _quantity) public{
	    uint _sum=0;
        for(uint i=0;i<ProductList.length;i++){
            if(ProductList[i].retailerAddress==_retailer && 
            compareStrings(ProductList[i].typeOfProduct,_type) && 
            compareStrings(ProductList[i].name,_name) 
            && _quantity>0 && ProductList[i].consumerAddress==address(0) ){
                
                ProductList[i].consumerAddress=msg.sender;
                _quantity--;
                _sum=_sum+ProductList[i].price;
                
            }
        }
        cost=_sum;
	}

    function addPercentage(uint _id,uint _percentage) public{
        ProductList[_id].reusePercentage=_percentage;
    }

    //Consumer Methods
    function fetchProductReferenceConsumer(address _address) public view returns(uint){

    }

}
