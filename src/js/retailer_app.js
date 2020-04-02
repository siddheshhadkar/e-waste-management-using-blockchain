RecApp={
    QuantityAvailable:null,
    frequency:{},

    loadAddress:function (argument) {
        web3.eth.getCoinbase(function(err, account){
            if(err===null){
                App.account = account;
                $('#accountaddress').html("Your account address: " + App.account);
                $('.mainbox').hide();
                setTimeout(function(){
                    $('.mainbox').show();
                    RecApp.render();
                }, 1000);
            }
        });

    },
    render:function (argument) {
        
        var amInstance;
        var pAddress;
        var pInstance;
        

        App.contracts.AddressManager.deployed().then(function (instance) {
            amInstance=instance;
            return amInstance.getProducerCount();
        }).then(function (producerCount) {
            var producerSelect = $('#producerSelect');
            producerSelect.empty();

            // console.log(producerCount);
            // producerCount=producerCount.s;
            // console.log(producerCount);
            var producerOption = "<option value='" + null + "'disabled selected >" +"Select Producer" + "</ option>"
            producerSelect.append(producerOption);

            for (var i = 0; i < producerCount; i++) {
                amInstance.producers(i).then(function (singleProducer) {
                    var name=singleProducer[2];
                    var address=singleProducer[0];
                    // console.log(address);
                    var producerOption = "<option value='" + address + "' >" + name + "</ option>"
                    producerSelect.append(producerOption);
                })
            }
        })
    },
    buyProduct:function () {
            var pAddress=$('#producerSelect').val();
            var pType=$('#productType').val();
            var productname = $('#productlistSelect').val();
            var quantity = $('#quantity').val();
            RecApp.frequency={};

            if (pAddress!=null && pType!=null&& productlistSelect!=null && quantity!="") {
                console.log(quantity,RecApp.QuantityAvailable);
                if(quantity>RecApp.QuantityAvailable || quantity==0){
                    
                    alert("Enter Valid Quantity");
                }else{
                    alert("Fine");
                    App.contracts.Producer.deployed().then(function (instance) {
                        instance.soldToRetailer(pAddress,productname,pType,quantity).then(function (argument) {
                            return instance.cost()
                        }).then(function (amount) {
                        console.log(amount);
                        var res=App.makeTransaction(pAddress,App.account,amount);
                        if(res=="success"){
                            alert("Transaction Process Completed");
                            }else{
                                alert("Transaction Process Failed");
                            }
                    })
                })
            }
            }else{
                alert("Fill empty fields");
            }
        
    },
    updateProducer:function (argument) {
        var pAddress;
        var pInstance;

            App.contracts.Producer.deployed().then(function (instance) {
                pInstance=instance;
                return pInstance.getProductCount();
            }).then(function (pCount) {

                var pAddress=$('#producerSelect').val();
                var pType=$('#productType').val();
                // pCount=pCount.s;
                var nameSet=new Set();
                RecApp.frequency={};

                var productlistSelect = $('#productlistSelect');
                productlistSelect.empty(); 

                var producerOption = "<option value='" + null + "'disabled selected >" +"Select an option" + "</ option>"
                productlistSelect.append(producerOption);


                for (var i = 0; i <pCount; i++) {
                    pInstance.ProductList(i).then(function (singleProduct) {
                        
                        if(singleProduct[1]== "0x0000000000000000000000000000000000000000" && 
                            singleProduct[0]==pAddress && singleProduct[4]==pType){
                            console.log(singleProduct);
                            if(singleProduct[3] in RecApp.frequency){
                                RecApp.frequency[singleProduct[3]]+=1;
                            }else{
                                RecApp.frequency[singleProduct[3]]=1;
                            }
                            
                            nameSet.add(singleProduct[3]);
                            var productlistSelect = $('#productlistSelect');
                            productlistSelect.empty(); 

                            function printOne(values) {
                                var productOption = "<option value='" + values + "' >" + values + "</ option>";
                                console.log(values);
                                productlistSelect.append(productOption);
                                
                            }
                            nameSet.forEach(printOne);
                            // console.log(RecApp.frequency);
                        }
                    });

                }
                setTimeout(function(){
                                var type=$('#productlistSelect').val();
                                 // console.log(frequency[type]);
                                
                                 if (RecApp.frequency[type]==undefined) {
                                    RecApp.QuantityAvailable=0;
                                    alert("Available Stock: 0");
                                 }else{
                                    RecApp.QuantityAvailable=RecApp.frequency[type];
                                    alert("Available Stock: "+RecApp.frequency[type]);
                                 }   
                            }, 1000);           
            })

    },
    updateCount:function (argument) {
        var type=$('#productlistSelect').val();
         if (RecApp.frequency[type]==undefined) {
            alert("Available Stock: 0");
         }else{
            alert("Available Stock: "+RecApp.frequency[type]);
         }
    },

   
    
        
}

 
$(document).ready(function(){
    $(window).on('load', function(){
        RecApp.loadAddress();
    });
});