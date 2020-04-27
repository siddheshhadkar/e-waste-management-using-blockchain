$(document).ready(function(){
    $('.container').hide();
    $('.footer').hide();
    setTimeout(function(){
        $('.loader').hide();
        $('.footer').show();
        $('.container').show();
        $('#accountAddress').val(App.account);
    }, 1000);
});

function addUser(){
    switch ($('#accountType').val()) {
        case null:
            alert("Please select an option");
            $('#accountType').focus()
            break;
        case "Producer":
            addProducer();
            break;
        case "Retailer":
            addRetailer();
            break;
        case "Consumer":
            addConsumer();
            break;
        case "RecyclingUnit":
            addRecycleUnit();
            break;
        default:
            alert("There was an error completing the transaction");
    }
}

function addProducer(){
    var exists = false;
    var name = $('#name').val();
    App.contracts.AdminContract.deployed().then(function(i){
        i.checkProducer(App.account).then(function(res){
            exists = res;
            return i;
        }).then(function(i){
            if (!exists) {
                i.addProducer(App.account, name);
            }else{
                alert("Producer is already associated with this account");
            }
        });
    });
}

function addRetailer(){
    var exists = false;
    var name = $('#name').val();
    App.contracts.AdminContract.deployed().then(function(i){
        i.checkRetailer(App.account).then(function(res){
            exists = res;
            return i;
        }).then(function(i){
            if (!exists) {
                i.addRetailer(App.account, name);
            }else{
                alert("Retailer is already associated with this account");
            }
        });
    });
}

function addConsumer(){
    var exists = false;
    var name = $('#name').val();
    App.contracts.AdminContract.deployed().then(function(i){
        i.checkConsumer(App.account).then(function(res){
            exists = res;
            return i;
        }).then(function(i){
            if (!exists) {
                i.addConsumer(App.account, name);
            }else{
                alert("Consumer is already associated with this account");
            }
        });
    });
}

function addRecycleUnit(){
    var exists = false;
    var name = $('#name').val();
    App.contracts.AdminContract.deployed().then(function(i){
        i.checkRecycleUnit(App.account).then(function(res){
            exists = res;
            return i;
        }).then(function(i){
            if (!exists) {
                i.addRecycleUnit(App.account, name);
            }else{
                alert("Recycle Unit is already associated with this account");
            }
        });
    });
}
