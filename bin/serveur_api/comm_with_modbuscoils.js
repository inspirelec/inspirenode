/**
 * New node file
 */




var modbuscoils = function(adresseip) {
	this.adresseip=adresseip;
		
	this.set_etat=function(periph,cmd,val,callbackfunc){		    
		var self=this;
		
		var self=this;
		var client = global.req.jsmodbus.client.tcp.complete({
	        'host'              : self.ip, //test 192.168.1.249
	        'port'              : self.port, // defaut 502
	        'autoReconnect'     : true,
	        'logLevel'      	: 'debug',
	        'reconnectTimeout'  : 1000,
	        'timeout'           : 5000,
	        'unitId'            : 1
	    });
		client.connect();
		var closed=false;
		var rep={};
		rep.cmd=cmd;
		rep.val=val;
		var closed=false;
		setTimeout(function(){
			if (!closed){
			  try {
				  
				  client.close();
				} catch (e) {
				}
				logger('ERROR',{nom:self.nom,id:self.id,msg:"set etat box modbus Timeout:"},'box_modbuscoil');
			   callbackfunc({rep:rep,'error':'timeout'});
			}
		},29000);
		client.on('error', function (err) {
			logger('ERROR',{nom:self.nom,id:self.id,msg:"set etat box modbus Error:",error:err},'box_modbuscoil');
		})
		
		client.on('connect', function () {
				    // make some calls
					logger('INFO',{nom:self.nom,id:self.id,msg:"set etat box modbus connect:"},'box_modbuscoil');
					
						switch (cmd) {
						case 'ON':
							if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_max_value;
							break;
						case 'OFF':
							if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_min_value;
							break;

						case 'UP':
							if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_max_value;
							break;
						case 'DOWN':
							if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_min_value;
							break;
						default:
							break;
						}
						logger('INFO',{nom:self.nom,id:self.id,msg:"write registre modbus:",val:val,cmd:cmd},'box_modbuscoil');
						

						write(client,periph.box_identifiant,val,periph.box_protocole,function(resultbox){
							rep.result=resultbox;
							callbackfunc(rep);
							closed=true;
							try {
								client.close();
						    } catch (e) {}
						});
		});

		
	}
	
	this.get_etatbox=function(callbackfunc){
		var self=this;
		var client = global.req.jsmodbus.client.tcp.complete({
	        'host'              : self.ip, //test 192.168.1.249
	        'port'              : self.port, // defaut 502
	        'autoReconnect'     : true,
	        'logLevel'      	: 'debug',
	        'reconnectTimeout'  : 1000,
	        'timeout'           : 5000,
	        'unitId'            : 1
	    });
		
		var sql='Select id,box_id,box_identifiant,box_protocole,box_type from peripherique where box_id='+self.id+';';
		//console.log(sql);
		global.obj.app.db.sqlorder(sql,
			function(rows){
				var res={};
				client.connect();
				var closed=false;
				setTimeout(function(){
					if (!closed){
					  try {
						  
						  client.close();
						} catch (e) {
						}
						logger('ERROR',{nom:self.nom,id:self.id,msg:"get etat box modbus Timeout:"},'box_modbuscoil');
					   callbackfunc({'error':'timeout'});
					}
				},29000);
				client.on('error', function (err) {
					logger('ERROR',{nom:self.nom,id:self.id,msg:"get etat box modbus Error:",error:err},'box_modbuscoil');
				})
				client.on('connect', function () {
				    // make some calls
					logger('INFO',{nom:self.nom,id:self.id,msg:"get etat box modbus connect:"},'box_modbuscoil');
					global.req.async.map(rows,function(row_periph,callbackb){
						logger('INFO',{nom:self.nom,id:self.id,msg:"read registre modbus:",row_periph:row_periph},'box_modbuscoil');
						read(client,row_periph.box_identifiant,row_periph.box_type,row_periph.box_protocole,function(resultbox){
							
							res['reg_'+resultbox.registre_deb]={etat:resultbox.result};
							callbackb();
						});
					  },function(err){
						  closed=true;
						  try {
							  client.close();
							} catch (e) {
							}
						  callbackfunc(res);
						  logger('INFO',{nom:self.nom,id:self.id,msg:"get etat box modbus read:"/*,result:res*/},'box_modbuscoil');
					  });
				});
				
				//if (rows.length<22)
				//	console.log(ir);
			
				//if (rows.length<11) console.log('box_id:'+self.id,'nbrows:'+rows.length,'nbrowsbis:'+rowsbis.length,res,rows);
				
			});
	}
	
	
	this.get_etat=function(callbackfunc,obj_peripherique,etatbox){
		var self=this;
		if (!etatbox && !self.last_etat) {			
			etatbox=this.get_etatbox(function(etatboxres){
				self.filtre_etat(callbackfunc,obj_peripherique,etatboxres);
			});
		} else if (!etatbox){
			self.filtre_etat(callbackfunc,obj_peripherique,self.last_etat);
		} else {
			self.filtre_etat(callbackfunc,obj_peripherique,etatbox);
		}
	}
	
	this.filtre_etat=function(callbackfunc,periph,etatbox){
		var res=etatbox;
		if (etatbox[periph.box_identifiant]) {
			res=etatbox['reg_'+periph.box_identifiant];
			
		}
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
	}
}


var read= function (client,registre_deb,taille_registre,bit,callback) {
	// adresse du registre en decimal , nombre de mot
	
	var adresse = 	parseInt(registre_deb)*16;
	adresse = parseInt(adresse)+parseInt(bit);
	
	client.readCoils(adresse, taille_registre,callback).then(function (resp) {

	    // resp will look like { fc: 1, byteCount: 20, register: [ values 0 - 10 ] 

		result = resp.coils[0];
		if(result)
			result = 1;
		else
			result=0;
		registre_deb = registre_deb+'_'+bit;
		logger('INFO',{nom:client.host,id:client.port,msg:"Lecture OK",adresse:adresse,taille_registre:taille_registre, reponse:resp.coils[0] },'box_modbuscoil');

		callback({registre_deb:registre_deb,taille_registre:taille_registre,result:result});
		//client.close();
		//console.log('client close');
	}).fail(function(){callback({registre_deb:'fail',taille_registre:'0',result:'erreur'});});
}

var write= function (client,registre_deb,valeur,binaire,callback) {

	var adresse = 	parseInt(registre_deb)*16;
	adresse = parseInt(adresse)+parseInt(binaire);
	valeur = parseInt(valeur);
	var registre = [valeur];
	logger('INFO',{nom:client.host,id:client.port,msg:"write registre modbus:",registre:registre, registre_deb:adresse},'box_modbuscoil');
	client.writeMultipleCoils(adresse, registre,callback).then(function (resp) {
		var result={};
	    // resp will look like { fc: 3, byteCount: 20, register: [ values 0 - 10 ] }
		if (adresse==resp.startAddress){
			result.status='resultat : ok';
			logger('INFO',{nom:client.host,id:client.port,msg:"Ecriture OK"},'box_modbuscoil');
		}else{
			result.status='resultat : erreur';
			logger('INFO',{nom:client.host,id:client.port,msg:"Ecriture erreur"},'box_modbuscoil');
		}
		result.resp=resp;
		client.close();
		
		callback({registre_deb:adresse,registre:registre,result:result});
		//client.close();
		//console.log('client close');
	}).fail(function(){callback({registre_deb:'fail',registre:'0',result:'erreur'});});
}
module.exports = modbuscoils;
