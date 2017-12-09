var modbus = require('jsmodbus');
var adresse_modbus = process.argv[2];	//ex: 192.168.1.249
var port_modbus = process.argv[3];		// defaut 502
var registre_deb = process.argv[4]; 	// ex : 8252
var taille_registre = process.argv[5]; 	// ex : 2
var registre = [0, 3];					// ex :[0, 3] = monophas�, [0, 1] triphas�


// create a modbus client
var client = modbus.client.tcp.complete({ 
        'host'              : adresse_modbus, //test 192.168.1.249
        'port'              : port_modbus, // defaut 502
        'autoReconnect'     : true,
        'logLevel'      	: 'debug',
        'reconnectTimeout'  : 1000,
        'timeout'           : 10000,
        'unitId'            : 1
    });

client.connect();

// reconnect with client.reconnect()

client.on('connect', function () {

    // make some calls

 

		
		//console.log(registre_deb);
		//console.log(registre);
		client.writeMultipleRegisters(registre_deb, registre).then(function (resp) {

				// resp will look like { fc : 16, startAddress: 4, quantity: 4 }
				//console.log(registre);
				
				if (registre_deb==resp.startAddress){
					console.log('resultat : ok');
				}else{
					console.log('resultat : erreur');
				}
							
					
				
				client.close();


		}).fail(console.log);

	
	
	
    


});

client.on('error', function (err) {

    console.log(err);

})