RecApp={
    QuantityAvailable:null,
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
        var frequency={};

        App.contracts.AddressManager.deployed().then(function (instance) {
            amInstance=instance;
            return amInstance.getProducerCount();
        }).then(function (producerCount) {
            var producerSelect = $('#producerSelect');
            producerSelect.empty();

            // console.log(producerCount);
            // producerCount=producerCount.s;
            // console.log(producerCount);

            for (var i = 0; i < producerCount; i++) {
                amInstance.producers(i).then(function (singleProducer) {
                    var name=singleProducer[2];
                    var address=singleProducer[0];
                    console.log(address);
                    var producerOption = "<option value='" + address + "' >" + name + "</ option>"
                    producerSelect.append(producerOption);
                })
            }
        }).then(function () {
            App.contracts.Producer.deployed().then(function (instance) {
                pInstance=instance;
                return pInstance.getProductCount();
            }).then(function (pCount) {

                var pAddress=$('#producerSelect').val();

                // pCount=pCount.s;
                var nameSet=new Set();


                for (var i = 0; i <pCount; i++) {
                    pInstance.ProductList(i).then(function (singleProduct) {
                        // console.log(singleProduct);
                        if(singleProduct[1]== "0x0000000000000000000000000000000000000000" && 
                            singleProduct[0]==pAddress){

                            if(singleProduct[3] in frequency){
                                frequency[singleProduct[3]]+=1;
                            }else{
                                frequency[singleProduct[3]]=1;
                            }
                            
                            nameSet.add(singleProduct[3])
                            var productlistSelect = $('#productlistSelect');
                            productlistSelect.empty(); 

                            function printOne(values) {
                                var productOption = "<option value='" + values + "' >" + values + "</ option>";
                                console.log(values);
                                productlistSelect.append(productOption);
                                
                            }
                            nameSet.forEach(printOne);
                            console.log(frequency);
                        }
                    });

                }
                setTimeout(function(){
                                var type=$('#productlistSelect').val();
                                 // console.log(frequency[type]);
                                RecApp.QuantityAvailable=frequency[type];
                                alert("Available Stock: "+frequency[type]);    
                            }, 1000);
                
            })
        })
    },
    buyProduct:function (argument) {
        
        
    },
    updateProducer:function (argument) {
        var pAddress;
        var pInstance;
        var frequency={};

            App.contracts.Producer.deployed().then(function (instance) {
                pInstance=instance;
                return pInstance.getProductCount();
            }).then(function (pCount) {

                var pAddress=$('#producerSelect').val();
                var pType=$('#productSelect').val();
                // pCount=pCount.s;
                var nameSet=new Set();


                for (var i = 0; i <pCount; i++) {
                    pInstance.ProductList(i).then(function (singleProduct) {
                        // console.log(singleProduct);
                        if(singleProduct[1]== "0x0000000000000000000000000000000000000000" && 
                            singleProduct[0]==pAddress && singleProduct[4]==pType){

                            if(singleProduct[3] in frequency){
                                frequency[singleProduct[3]]+=1;
                            }else{
                                frequency[singleProduct[3]]=1;
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
                            console.log(frequency);
                        }
                    });

                }
                setTimeout(function(){
                                var type=$('#productlistSelect').val();
                                 // console.log(frequency[type]);
                                RecApp.QuantityAvailable=frequency[type];
                                alert("Available Stock: "+frequency[type]);    
                            }, 1000);           
            })

    },
   
    
        
}

 
$(document).ready(function(){
    $(window).on('load', function(){
        RecApp.loadAddress();
    });
});