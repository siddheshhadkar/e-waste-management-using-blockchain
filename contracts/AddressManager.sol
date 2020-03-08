pragma solidity >=0.4.21 <0.7.0;

contract AddressManager{

    address owner;
    mapping (uint =>mapping (address => Product)) public ProductList;
    
    mapping (address => bool) public ProducerList;
    mapping (address => bool) public RetailerList;
    mapping (address => bool) public ConsumerList;
    mapping (address => bool) public RecycleUnitList;
    mapping (address => bool) public CollectionCentreList;  

    uint public productCount;  

    modifier onlyOwner(){
        require(msg.sender == owner);
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
    

    constructor() public{
        owner = msg.sender;
    }

    //adding accounts

    function addProducer (address _pAddress) public onlyOwner {
        ProducerList[_pAddress]=true;
    }

    function addRetailer (address _rAddress) public onlyOwner {
        RetailerList[_rAddress]=true;
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

    function checkProducer (address _pAddress) public returns(bool) {
        return(ProductList[_pAddress]);
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
