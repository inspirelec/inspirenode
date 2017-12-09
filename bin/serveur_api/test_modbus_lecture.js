var modbus = require('jsmodbus');
var adresse_modbus = process.argv[2];	//ex: 192.168.1.249
var port_modbus = process.argv[3];		// defaut 502
var registre_deb = process.argv[4];		// ex : 8252
var taille_registre = process.argv[5];	// ex : 2


// create a modbus client
var client = modbus.client.tcp.complete({ 
        'host'              : adresse_modbus, //test 192.168.1.249
        'port'              : port_modbus, // defaut 502
        'autoReconnect'     : true,
        'logLevel'      	: 'debug',
        'reconnectTimeout'  : 1000,
        'timeout'           : 5000,
        'unitId'            : 1
    });

client.connect();

// reconnect with client.reconnect()

client.on('connect', function () {

    // make some calls
	//console.log('client connect');
 
	// adresse du registre en decimal , nombre de mot
    client.readHoldingRegisters(registre_deb, taille_registre).then(function (resp) {

        // resp will look like { fc: 3, byteCount: 20, register: [ values 0 - 10 ] }
        //console.log(resp); 
		//console.log(resp.register);
		var pas;
		var coeff = 1;
		var result=0;
		if (taille_registre >= 2){
			//console.log(taille_registre);
			for (pas = taille_registre-2; pas >= 0; pas--) {
				//console.log('pas :'+pas);
				coeff = coeff *65536;
				//console.log('coeff :'+coeff);
				result = resp.register[pas]*coeff+result;
				//console.log(result);
			}
		}
		result = result + resp.register[taille_registre-1]
		//console.log('resultat : '+result);
		
		//client.close();
		//console.log('client close');
    }).fail(console.log);



});

client.on('error', function (err) {

    console.log('error',err);

})