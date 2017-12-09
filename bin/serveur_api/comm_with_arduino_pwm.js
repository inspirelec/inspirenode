var last_etat= {};

var arduino_pwm = function(adresseip) {
	this.adresseip=adresseip;
	
	this.set_etat=function(periph,cmd,val,callbackfunc){
		
		var message = "0";
		var self=this;
		logger('INFO',{nom:self.nom,id:self.id,msg:"Commande envoy�e � l'arduino_pwm : "+cmd+" "+message},'box_arduino_pwm');

		var ident=periph.box_identifiant;
		switch (cmd) {
		case 'ON':
			message=periph.ecriture_max_value;			
			logger('DEBUG',{nom:self.nom,id:self.id,msg:"Commande envoy�e � l'arduino_pwm : "+cmd+" "+message},'box_arduino_pwm');
			break;
		case 'OFF':
			message=periph.ecriture_min_value;
			logger('DEBUG',{nom:self.nom,id:self.id,msg:"Commande envoy�e � l'arduino_pwm : "+cmd+" "+message},'box_arduino_pwm');
			break;
			
		case 'DIM':
			message = val;
			logger('DEBUG',{nom:self.nom,id:self.id,msg:"Commande envoy�e � l'arduino_pwm : "+cmd+" "+message},'box_arduino_pwm');
			break;

		default:
			break;
		}
		var rep={};
		rep.cmd=cmd;
		rep.val=message;
		if (cmd=='DOWN' || cmd=='UP'){
				logger('WARNING',{nom:self.nom,id:self.id,msg:"l'arduino_pwm ne gere pas la commande "+cmd},'box_arduino_pwm');
				rep.body="l'arduino_pwm ne gere pas la commande "+cmd;
				need_switch=false;
		}
		
		var arduinoSerialPort = '/dev/ttyACM0';	//Port s�rie par connexion USB entre le Raspberry Pi et l�Arduino
		var SerialPort = global.req.serialport.SerialPort;
		var port = new SerialPort(arduinoSerialPort,
			{
			 baudrate : 9600
		});

		var data = new Buffer(message,'ascii');

		port.on('data', function (data) {
		});
		port.open(function(){
			
				logger('DEBUG',{nom:self.nom,id:self.id,msg:"Serial Port opened"},'box_arduino_pwm');
			//console.log ('Serial Port opened');
		 
			//Ecriture dans port s�rie � partir du raspberry
			port.flush();
			//attente avant envoi de la commande
			setTimeout(function(){
				port.write(data, function(err, results){
				//console.log('err ' + err);
				//console.log('results ' + results);
				//console.log ('Envoi : '+data);			
				rep.body="Commande envoy�e � l'arduino_pwm : "+cmd+" "+message;
				logger('DEBUG',{nom:self.nom,id:self.id,msg:"Commande envoy�e � l'arduino_pwm : "+cmd+" "+message},'box_arduino_pwm');
				});
			},5000);	 
			
		});

		last_etat[periph.box_identifiant]={"value":message};


		
		callbackfunc(rep);
		
		
	}
	
	this.get_etatbox=function(callbackfunc){
		callbackfunc(last_etat);
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
			res=etatbox[periph.box_identifiant];
			
		}
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
	}
}

module.exports = arduino_pwm;