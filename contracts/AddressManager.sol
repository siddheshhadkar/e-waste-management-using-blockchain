pragma solidity >=0.4.21 <0.7.0;

contract AddressManager{

    address owner;
    mapping (uint =>mapping (address => Product)) public ProductList;
    
    mapping (uint => producer) public ProducerList;
    mapping (uint => retailer) public RetailerList;
    mapping (address => bool) public ConsumerList;
    mapping (address => bool) public RecycleUnitList;
    mapping (address => bool) public CollectionCentreList;  

    uint public productCount;
    uint public producerCount;
    uint public retailerCount;  

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    struct producer{
        address account;
        bool ispresent;
        string name;
    }

    struct retailer {
       address addr;
       bool ispresent;
       string name;
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
    

    constructor() public{
        owner = msg.sender;
    }

    //adding accounts

    function addProducer (address _pAddress,string memory _name) public onlyOwner {
        producerCount++;
        ProducerList[producerCount]=producer(_pAddress,true,_name);
    }

    function addRetailer (address _rAddress,string memory _name) public onlyOwner {
        retailerCount++;
        RetailerList[retailerCount]=retailer(_rAddress,true,_name);
    }

    function addConsumer (address _cAddress) public onlyOwner {
        ConsumerList[_cAddress]=true;
    }

    function addRecycleUint (address _rAddress) public onlyOwner {
        RecycleUnitList[_rAddress]=true;
    }

    function addCollectionCentre (address _cAddress) public onlyOwner {
        CollectionCentreList[_cAddress]=true;
    }

    //validate users

    function checkProducer (uint _producerid) public returns(bool) {
        return(ProductList[_producerid].ispresent);
    }

    function checkRetailer (address _rAddress) public returns(bool) {
        return(RetailerList[_rAddress]);
    }
    
    function checkConsumer (address _pAddress) public returns(bool) {
        return(ConsumerList[_pAddress]);
    }

    function checkRecycleUnit (address _rAddress) public returns(bool) {
        return(RecycleUnitList[_rAddress]);
    }

    function checkCollectionCentre (address _cAddress) public returns(bool) {
        return(CollectionCentreList[_cAddress]);
    }

    
}
