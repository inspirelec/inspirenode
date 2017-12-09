var last_etat= {};
var timer=null;

/**
 * http://usejsdoc.org/
 */

var arduinoSerialPort = '/dev/ttyACM0';	//Port s�rie par connexion USB entre le Raspberry Pi et l�Arduino

var typecode_colonnessql=[null,'badge_numero','codeacces']; 
var serialport = require("serialport");
var SerialPort =null;;

var lasttime_calculvent1=null;
var lasttime_calculvent2=null;
//console.log("chargement comm_with_arduino_meteo"); 
var calculVitesseVent=function(indexavant,newindex){
	var res1=-1;
	var res2=-1;
	var timeactuel=new Date().getTime();
	
	
	//console.log(lasttime_calculvent,timeactuel,indexavant,newindex);
	if (lasttime_calculvent1 && indexavant<=newindex){
		/*1 impulsion par seconde = 2,4 km/h*/
		var ecart=newindex-indexavant;
		var time_ms=timeactuel-lasttime_calculvent1;
		if (!global.data_arduino_meteo['calcul1']){
			global.data_arduino_meteo['calcul1']={};
		}
		global.data_arduino_meteo['calcul1']['Vent_lastindex']=indexavant;
		global.data_arduino_meteo['calcul1']['Vent_mesure_time_ms']=time_ms;
		global.data_arduino_meteo['calcul1']['Vent_ecart_index']=ecart;
		
		res1=Math.round( (ecart/(time_ms/1000) * 2.4) *10)/10;
		global.data_arduino_meteo['calcul1']['Vent_vitesse_kmh']=res1;
	} 
	lasttime_calculvent1=timeactuel;
	
	/*calcul sur 5 minutes*/
	if (global.data_arduino_meteo['calcul2'] && lasttime_calculvent2
			&& timeactuel-lasttime_calculvent2>300000 &&
			newindex-global.data_arduino_meteo['calcul2']['Vent_lastindex']>=0){
		var ecart=newindex-global.data_arduino_meteo['calcul2']['Vent_lastindex'];
		var time_ms=timeactuel-lasttime_calculvent2;
		global.data_arduino_meteo['calcul2']['Vent_mesure_time_ms']=time_ms;
		global.data_arduino_meteo['calcul2']['Vent_ecart_index']=ecart;
		res2=Math.round( (ecart/(time_ms/1000) * 2.4) *10)/10;
		global.data_arduino_meteo['calcul2']['Vent_vitesse_kmh']=res2;
	}
	if (!lasttime_calculvent2 || timeactuel-lasttime_calculvent2>300000){
		lasttime_calculvent2=timeactuel;
		if (!global.data_arduino_meteo['calcul2']){
			global.data_arduino_meteo['calcul2']={};
		}
		global.data_arduino_meteo['calcul2']['Vent_lastindex']=newindex;
	}
	
	//console.log(global.data_arduino_meteo['calcul2'],lasttime_calculvent2,
	//		timeactuel-lasttime_calculvent2,newindex-global.data_arduino_meteo['calcul2']['Vent_lastindex']);

	
	
	
}

var inittimer=function(){
	//console.log("création de l'objet serialport"); 
	try {
		SerialPort= serialport.SerialPort;
		global.sp = new SerialPort(arduinoSerialPort, {
	      baudrate: 9600,parser: serialport.parsers.readline('\n')
		});
	} catch (e) {
		//console.log('Impossible de creer l objet serialport : '+e);		
	}
	//console.log("abonnement aux evenement de fermeture de la communication");
	try{
		global.sp.on('close', function () {
			//logger('WARNING',{msg:'evenement close communication avec arduino'},'arduino_acces');
			//console.log('evenement close communication avec arduino');
			global.rebootspmeteo= "1";
			//setTimeout(function (){global.rebootspmeteo = "1";},10000);
		});
		global.sp.on('error', function () {
			logger('ERROR',{msg:'evenement error communication avec arduino'},'arduino_acces');
			//console.log('evenement non traite error communication avec arduino');
			
			//global.rebootspmeteo = "1";
			//setTimeout(function (){global.rebootspmeteo = "1";},10000);
		});
		global.sp.on('disconnect', function () {
			global.rebootspmeteo= "1";
			logger('WARNING',{msg:'evenement disconnect communication avec arduino'},'arduino_acces');
			//console.log('evenement disconnect communication avec arduino');
			
			//setTimeout(function (){global.rebootspmeteo = "1";},10000);
		});
	} catch (e) {
		   //init=1;
		   global.rebootspmeteo= "1";
		   //setTimeout(function (){global.rebootspmeteo = "1";},10000);
		   logger('ERROR',{msg:'Impossible de s inscrire a l evenement on close,error,disconnect',error:e},'arduino_acces');		
		   //console.log('Impossible de s inscrire a l evenement on close,error,disconnect');
	}
	//console.log('abonnement aux evenement de Lecture arduino');

	  var data='';
	  try {
		  global.sp.on('data', function (datar) {
		  		if (!global.data_arduino_meteo){
			  		global.data_arduino_meteo={};
		  		};
        	  //console.log('avant',JSON.stringify(global.data_arduino_meteo));
        	  //console.log('donnees:--', datar,'--');
        	  var datarray=datar.split(":");
        	  //console.log(datarray);
        	  var val=datarray[1].split('\r')[0];
        	  //console.log('--'+datarray[0]+'--');
        	  if (datarray[0]=='Vent') {
        		  //console.log('--'+datarray[0]+'-ok-',global.data_arduino_meteo[datarray[0]],val);
        		  calculVitesseVent(global.data_arduino_meteo[datarray[0]]*0,val*0);
        	  }
        	  global.data_arduino_meteo[datarray[0]]=datarray[1].split('\r')[0];
        	  //console.log('apres',JSON.stringify(global.data_arduino_meteo));
          });
	   } catch (e) {
		   //init=1;
		   global.rebootspmeteo= "1";
		   //console.log('Impossible de s inscrire a l evenement on Data : '+e);		
		   //setTimeout(function (){reboot = "1";},10000);
	   }
	   
	//console.log('ouverture du port serial vers l arduino');
	global.sp.open(function(){
			
			//	logger('DEBUG',{nom:self.nom,id:self.id,msg:"Serial Port opened"},'box_arduino_pwm');
			//console.log ('Serial Port opened');
		 
			//Ecriture dans port s�rie � partir du raspberry
			global.sp.flush();
			//attente avant envoi de la commande
			setInterval(function(){				
				var ecriture = new Buffer('etat','ascii');
				global.sp.write(ecriture, function(err, results){
					//console.log('err ' + err);
					//console.log('results ' + results);
					//console.log ('Envoi : '+ecriture);			
				//rep.body="Commande envoy�e � l'arduino_pwm : "+cmd+" "+message;
				//logger('DEBUG',{nom:self.nom,id:self.id,msg:"Commande envoy�e � l'arduino_pwm : "+cmd+" "+message},'box_arduino_pwm');
				});
			},20000);	 
			
		});
	   
	global.rebootspmeteo=0;
	global.initspmeteo=0;
}

var arduino_meteo = function(adresseip) {
	this.adresseip=adresseip;
	//console.log("creation objet arduino_meteo"); 
	this.set_etat=function(periph,cmd,val,callbackfunc){
	    var self=this;
		var rep={};
		rep.cmd=cmd;
		rep.val=val;
		rep.body="pas de mise a jour d'état possible"
		logger('WARNING',{nom:self.nom,id:self.id,msg:"pas de mise a jour d'état possible",rep:rep},'box_arduino_meteo');
		callbackfunc(rep);
		
		
	}
	
	this.get_etatbox=function(callbackfunc){
		if (!global.sp || global.rebootspmeteo=="1") {
			//console.log('Premier get etat, alors demarrage boucle comm avec arduino',global.rebootspmeteo,global.initspmeteo);
			inittimer();
			//console.log('       boucle comm avec arduino démarrée');
		}

		callbackfunc({etat:global.data_arduino_meteo});
		
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

module.exports = arduino_meteo;