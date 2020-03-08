pragma solidity >=0.4.21 <0.7.0;

contract AddressManager{

    address owner;

    mapping (uint => producer) public producers;
    mapping (uint => retailer) public retailers;
    mapping (uint => consumer) public consumers;
    mapping (uint => recycleunit) public recycleUnits;
    mapping (uint => collectioncentre) public collectionCentres;

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

    constructor() public{
        owner = msg.sender;
    }

    function addProducer (address _pAddress,string memory _name) public {
        producerCount++;
        producers[producerCount]=producer(_pAddress,true,_name);
    }

    function addRetailer (address _rAddress,string memory _name) public  {
        retailerCount++;
        retailers[retailerCount]=retailer(_rAddress,true,_name);
    }

    function addConsumer (address _cAddress,string memory _name) public {
        consumerCount++;
        consumers[consumerCount]=consumer(_cAddress,true,_name);
    }

    function addRecycleUint (address _rAddress,string memory _name) public {
        recyleUnitCount++;
        recycleUnits[recyleUnitCount]=recycleunit(_rAddress,true,_name);
    }

    function addCollectionCentre (address _cAddress,string memory _name) public  {
        collectionCentreCount++;
        collectionCentres[collectionCentreCount]=collectioncentre(_cAddress,true,_name);
    }

    //validate users

    function checkProducer (address _pAddress) public view returns(bool) {
        uint _producerid;
        for (uint i=1;i<=producerCount;i++){
            if(producers[i].addr==_pAddress){
                _producerid=i;
            }
        }
        return(producers[_producerid].ispresent);
    }

    function checkRetailer (address _rAddress) public view returns(bool) {
        uint _retailerid;
        for (uint i=1;i<=retailerCount;i++){
            if(retailers[i].addr==_rAddress){
                _retailerid=i;
            }
        }
        return(retailers[_retailerid].ispresent);
    }

    function checkConsumer (address _cAddress) public view returns(bool) {
        uint _consumerid;
        for (uint i=1;i<=consumerCount;i++){
            if(consumers[i].addr==_cAddress){
                _consumerid=i;
            }
        }
        return(consumers[_consumerid].ispresent);
    }

    function checkRecycleUnit (address _rAddress) public view returns(bool) {
        uint _recycleunitid;
        for (uint i=1;i<=recyleUnitCount;i++){
            if(recycleUnits[i].addr==_rAddress){
                _recycleunitid=i;
            }
        }
        return(recycleUnits[_recycleunitid].ispresent);
    }

    function checkCollectionCentre (address _cAddress) public view returns(bool) {
        uint _collectionid;
        for (uint i=1;i<=collectionCentreCount;i++){
            if(collectionCentres[i].addr==_cAddress){
                _collectionid=i;
            }
        }
        return(collectionCentres[_collectionid].ispresent);
    }
}
