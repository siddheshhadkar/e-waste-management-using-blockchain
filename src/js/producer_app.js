ProApp={
    addProduct:function () {
        var productname = $('#productname').val();
        var weightglass = $('#weightglass').val();
        var weightplastic = $('#weightplastic').val();
        var weightnickel = $('#weightnickel').val();
        var weightaluminium = $('#weightaluminium').val();
        var weightcopper = $('#weightcopper').val();
        var weightmagnesium = $('#weightmagnesium').val();
        var weightlead = $('#weightlead').val();
        var producttype = $('#producttype').val();

        App.contracts.Producer.deployed().then(function (instance) {
            console.log(App.account);
            console.log(productname,producttype,weightaluminium,weightnickel,weightglass);
            instance.addProduct(productname,producttype,weightaluminium,weightnickel,
                weightglass,weightplastic
                ,weightcopper,weightmagnesium,weightlead,{ from: App.account });
            console.log("Product Added");
        });

    },

    loadAddress:function (argument) {
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                App.account = account;
                $('#accountaddress').html("Your account address: " + App.account);
                console.log(App.account);
            }
        });

    }
}

 
$(document).ready(function(){
    $(window).on('load', function(){
        ProApp.loadAddress();
    });
});