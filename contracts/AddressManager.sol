pragma solidity >=0.4.21 <0.7.0;

contract AddressManager{

    address owner;

    User[] public Producers;
    User[] public Retailers;
    User[] public Consumers;
    User[] public RecycleUnits;
    // mapping (uint => collectioncentre) public collectionCentres;

    // uint public productCount;

    // uint public producerCount;
    // uint public retailerCount;
    // uint public consumerCount;
    // uint public recyleUnitCount;
    // uint public collectionCentreCount;

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    struct User{
        address addr;
        bool ispresent;
        string name;
    }

    

    constructor() public{
        owner = msg.sender;
    }

    function addProducer (address _pAddress,string memory _name) public {
        Producers.push(User(_pAddress,true,_name));
    }

    function addRetailer (address _rAddress,string memory _name) public  {
        Retailers.push(User(_rAddress,true,_name));
    }

    function addConsumer (address _cAddress,string memory _name) public {
        Consumers.push(User(_cAddress,true,_name));
    }

    function addRecycleUint (address _rAddress,string memory _name) public {
        RecycleUnits.push(User(_rAddress,true,_name));
    }

    // function addCollectionCentre (address _cAddress,string memory _name) public  {
    //     collectionCentreCount++;
    //     collectionCentres[collectionCentreCount]=collectioncentre(_cAddress,true,_name);
    // }

    //returning length
    function getProducerCount ()public view returns(uint){
        return Producers.length;
    }

    function getRetailerCount ()public view returns(uint){
        return Retailers.length;
    }

    function getConsumerCount ()public view returns(uint){
        return Consumers.length;
    }

    function getRecyclingUintCount ()public view returns(uint){
        return RecycleUnits.length;
    }


    //validate users

    function checkProducer (address _pAddress) public view returns(bool) {
        uint _producerid;
        if(Producers.length==0){
            return(false);
        }
        for (uint i=0;i<Producers.length;i++){
            if(Producers[i].addr==_pAddress){
                _producerid=i;
            }
        }
        return(Producers[_producerid].ispresent);
    }

    function checkRetailer (address _rAddress) public view returns(bool) {
        uint _retailerid;
        if(Retailers.length==0){
            return(false);
        }
        for (uint i=0;i<Retailers.length;i++){
            if(Retailers[i].addr==_rAddress){
                _retailerid=i;
            }
        }
        return(Retailers[_retailerid].ispresent);
    }

    function checkConsumer (address _cAddress) public view returns(bool) {
        uint _consumerid;
        if(Consumers.length==0){
            return(false);
        }
        for (uint i=0;i<Consumers.length;i++){
            if(Consumers[i].addr==_cAddress){
                _consumerid=i;
            }
        }
        return(Consumers[_consumerid].ispresent);
    }

    function checkRecycleUnit (address _rAddress) public view returns(bool) {
        uint _recycleunitid;
        if(RecycleUnits.length==0){
            return(false);
        }
        for (uint i=0;i<RecycleUnits.length;i++){
            if(RecycleUnits[i].addr==_rAddress){
                _recycleunitid=i;
            }
        }
        return(RecycleUnits[_recycleunitid].ispresent);
    }

    // function checkCollectionCentre (address _cAddress) public view returns(bool) {
    //     uint _collectionid;
    //     for (uint i=1;i<=collectionCentreCount;i++){
    //         if(collectionCentres[i].addr==_cAddress){
    //             _collectionid=i;
    //         }
    //     }
    //     return(collectionCentres[_collectionid].ispresent);
    // }
}
