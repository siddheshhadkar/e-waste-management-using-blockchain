pragma solidity >=0.4.21 <0.7.0;

contract AddressManager{

    address owner;
    mapping (uint =>mapping (address => Product)) public ProductList;
    
    mapping (uint => producer) public ProducerList;
    mapping (uint => retailer) public RetailerList;
    mapping (uint => consumer) public ConsumerList;
    mapping (uint => recycleunit) public RecycleUnitList;
    mapping (uint => collectioncentre) public CollectionCentreList;  

    uint public productCount;

    uint public producerCount;
    uint public retailerCount; 
    uint public consumerCount;
    uint public recyleUnitCount;
    uint public collectionCentreCount;   

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    struct producer{
        address addr;
        bool ispresent;
        string name;
    }

    struct retailer {
       address addr;
       bool ispresent;
       string name;
    }

    struct consumer {
       address addr;
       bool ispresent;
       string name;
    }

    struct recycleunit {
       address addr;
       bool ispresent;
       string name;
    }

    struct collectioncentre {
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
        string typeOfProduct;
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

    function addProducer (address _pAddress,string memory _name) public {
        producerCount++;
        ProducerList[producerCount]=producer(_pAddress,true,_name);
    }

    function addRetailer (address _rAddress,string memory _name) public  {
        retailerCount++;
        RetailerList[retailerCount]=retailer(_rAddress,true,_name);
    }

    function addConsumer (address _cAddress,string memory _name) public {
        consumerCount++;
        ConsumerList[consumerCount]=consumer(_cAddress,true,_name);
    }

    function addRecycleUint (address _rAddress,string memory _name) public {
        recyleUnitCount++;
        RecycleUnitList[recyleUnitCount]=recycleunit(_rAddress,true,_name);
    }

    function addCollectionCentre (address _cAddress,string memory _name) public  {
        collectionCentreCount++;
        CollectionCentreList[collectionCentreCount]=collectioncentre(_cAddress,true,_name);
    }

    //validate users

    function checkProducer (address _pAddress) public returns(bool) {
        uint _producerid;
        for (uint i=1;i<=producerCount;i++){
            if(ProducerList[i].addr==_pAddress){
                _producerid=i;
            }
        }
        return(ProducerList[_producerid].ispresent);
    }

    function checkRetailer (address _rAddress) public returns(bool) {
        uint _retailerid;
        for (uint i=1;i<=retailerCount;i++){
            if(RetailerList[i].addr==_rAddress){
                _retailerid=i;
            }
        }
        return(RetailerList[_retailerid].ispresent);
    }
    
    function checkConsumer (address _cAddress) public returns(bool) {
        uint _consumerid;
        for (uint i=1;i<=consumerCount;i++){
            if(ConsumerList[i].addr==_cAddress){
                _consumerid=i;
            }
        }
        return(ConsumerList[_consumerid].ispresent);
    }

    function checkRecycleUnit (address _rAddress) public returns(bool) {
        uint _recycleunitid;
        for (uint i=1;i<=recyleUnitCount;i++){
            if(RecycleUnitList[i].addr==_rAddress){
                _recycleunitid=i;
            }
        }
        return(RecycleUnitList[_recycleunitid].ispresent);
    }

    function checkCollectionCentre (address _cAddress) public returns(bool) {
        uint _collectionid;
        for (uint i=1;i<=collectionCentreCount;i++){
            if(CollectionCentreList[i].addr==_cAddress){
                _collectionid=i;
            }
        }
        return(CollectionCentreList[_collectionid].ispresent);
    }

    
}
