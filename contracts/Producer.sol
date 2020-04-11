pragma solidity >=0.4.21 <0.7.0;

import "./AddressManager.sol";

contract Producer {

    address owner;
    uint currentPayableAmount;

	modifier onlyOwner(){
         require(msg.sender == owner);
         _;
    }

     struct weightStruct{
        uint weightOfGlass;
        uint weightOfPlastic;
        uint weightOfNickel;
        uint weightOfAluminium;
        uint weightOfCopper;
        uint weightOfMagnesium;
        uint weightOfLead;
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
        uint price;
        uint percentConsumer;
    }

    Product[] public ProductList;
    weightStruct[] public weights;

	constructor() public {
        owner=msg.sender;
	}

	function () external payable{
	    revert();
	}

	function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

	function addProduct(string memory _name,string memory _type, uint _weightOfAluminium, uint _weightOfNickel, uint _weightOfGlass, uint _weightOfPlastic, uint _weightOfCopper, uint _weightOfMagnesium, uint _weightOfLead,uint _price) public  {
		ProductList.push(Product(msg.sender, address(0), address(0), _name,_type, false, false, 0, _price, 0));
        weights.push(weightStruct(_weightOfGlass,_weightOfPlastic, _weightOfNickel,_weightOfAluminium,_weightOfCopper, _weightOfMagnesium,_weightOfLead));
	}

	function getProductCount() public view returns(uint){
	    return ProductList.length;
	}

	function addReturnProduct(uint _id) public{
	    ProductList[_id].returnedToProducer = true;
	}

	function addReturnProductToRetailer(uint _id, address payable _address, uint _percentConsumer) public payable{
	    ProductList[_id].returnedToRetailer=true;
        ProductList[_id].percentConsumer = _percentConsumer;
        _address.transfer(msg.value);
	}

    function getCostForRetailer(address _producer,string memory _name,string memory _type,uint _quantity) public view returns (uint){
        uint _sum=0;
        for(uint i=0;i<ProductList.length;i++){
            if(ProductList[i].producerAddress==_producer && compareStrings(ProductList[i].typeOfProduct,_type) && compareStrings(ProductList[i].name,_name) && _quantity>0 && ProductList[i].retailerAddress==address(0)){
                _quantity--;
                _sum=_sum+ProductList[i].price;
            }
        }
        return _sum;
    }

	function soldToRetailer(address payable _producer,string memory _name,string memory _type,uint _quantity) public payable{
        for(uint i=0;i<ProductList.length;i++){
            if(ProductList[i].producerAddress==_producer && compareStrings(ProductList[i].typeOfProduct,_type) && compareStrings(ProductList[i].name,_name) && _quantity>0 && ProductList[i].retailerAddress==address(0)){
                ProductList[i].retailerAddress=msg.sender;
                _quantity--;
            }
        }
        _producer.transfer(msg.value);
	}

    function getCostForConsumer(address _retailer,string memory _name,string memory _type,uint _quantity) public view returns (uint){
        uint _sum=0;
        for(uint i=0;i<ProductList.length;i++){
            if(ProductList[i].retailerAddress==_retailer && compareStrings(ProductList[i].typeOfProduct,_type) && compareStrings(ProductList[i].name,_name) && _quantity>0 && ProductList[i].consumerAddress==address(0)){
                _quantity--;
                _sum=_sum+ProductList[i].price;
            }
        }
        return _sum;
    }

	function soldToConsumer(address payable _retailer,string memory _name,string memory _type,uint _quantity) public payable{
        for(uint i=0;i<ProductList.length;i++){
            if(ProductList[i].retailerAddress==_retailer && compareStrings(ProductList[i].typeOfProduct,_type) && compareStrings(ProductList[i].name,_name) && _quantity>0 && ProductList[i].consumerAddress==address(0)){
                ProductList[i].consumerAddress=msg.sender;
                _quantity--;
            }
        }
        _retailer.transfer(msg.value);
	}

    function addPercentage(uint _id,uint _percentage) public{
        ProductList[_id].reusePercentage=_percentage;
    }

    //Consumer Methods
    function fetchProductReferenceConsumer(address _address) public view returns(uint){

    }

}
