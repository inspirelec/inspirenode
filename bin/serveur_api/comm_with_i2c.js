/**
 * New node file
 */

//var wire = new global.req.i2c(address, {device: '/dev/i2c-1'});


var i2c = function(adresseip) {
	this.adresseip='0.0.0.0';
	var self=this;
	
	this.set_etat=function(periph,cmd,val,callbackfunc){
		    var self=this;
			var rep={};
			rep.cmd=cmd;
			rep.val=val;
			rep.body="pas de mise a jour d'état possible"
			logger('WARNING',{nom:self.nom,id:self.id,msg:"pas de mise a jour d'état possible",rep:rep},'box_ecodevice');
			callbackfunc(rep);
			
	}
	
	this.get_etatbox=function(callbacketat){
		if (global.req.i2c) {
			
			
			var wire_test = new global.req.i2c(0, {device: '/dev/i2c-1'});
			wire_test.scan(function(err, data) {
				//console.log("Adresses dispo : " +JSON.stringify(data));
				var res = {};
	
				global.req.async.forEachOf(data, function (adress, key, callback) {
					switch (adress) {
					case 0x39:
						/*zie datasheet TSL2561 	TSLAddress = 0x39*/
						get_etat_TSL2561(adress,'/dev/i2c-1',function(result){
							res['adr_'+adress]=result;
							callback();
						});
						break;
					case 0x77:
						/*T5403 Address = 0x77*/
						get_etat_T5403(adress,'/dev/i2c-1',function(result){
							res['adr_'+adress]=result;
							callback();
						});
						break;
					default:
						callback();
						break;
					}
				}, function (err) {
					
					callbacketat(res);
				})
			});
		} else {
			callbacketat({msg:'i2c non installé'});
		}
		
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
		var res={};
		if (periph.box_identifiant && etatbox[periph.box_identifiant]){
			res.etat={};
			
			res.etat=etatbox[periph.box_identifiant];
			
			//res.date=etatbox.day;
		
		} else if (etatbox) {
			res=etatbox;
		}
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
	}
}

function get_etat_T5403(adress,device_dev,callbackret){
/*
	slaveAddress = 0x77
	#registers
	T5403_COMMAND_REG = 0xf1
	T5403_DATA_REG_LSB = 0xf5
	T5403_DATA_REG_MSB = 0xf6
	#commands
	COMMAND_GET_TEMP = 0x03
	#definitions for pressure reading commands with accuracy modes
	MODE_LOW = 0x00
	MODE_STANDARD = 0x01
	MODE_HIGH = 0x10
	MODE_ULTRA = 0x11
	global c1,c2,c3,c4,c5,c6,c7,c8
	def uint16Toint16(data):
	 if data > 32767:
	 return data - 0x10000
	 else:
	 return data
	def sendCommand(cmd):
	 return (b.write_byte_data(slaveAddress,T5403_COMMAND_REG,cmd))
	def getData():
	 return (b.read_byte_data(slaveAddress,T5403_DATA_REG_MSB)<<8) +
	b.read_byte_data(slaveAddress,T5403_DATA_REG_LSB)
	def begin():
	 global c1,c2,c3,c4,c5,c6,c7,c8
	 c1 = (b.read_byte_data(slaveAddress,0x8f)<<8) + b.read_byte_data(slaveAddress,0x8e)
	 c2 = (b.read_byte_data(slaveAddress,0x91)<<8) + b.read_byte_data(slaveAddress,0x90)
	 c3 = (b.read_byte_data(slaveAddress,0x93)<<8) + b.read_byte_data(slaveAddress,0x92)
	 c4 = (b.read_byte_data(slaveAddress,0x95)<<8) + b.read_byte_data(slaveAddress,0x94)
	 c5 = (b.read_byte_data(slaveAddress,0x97)<<8) + b.read_byte_data(slaveAddress,0x96)
	 c6 = (b.read_byte_data(slaveAddress,0x99)<<8) + b.read_byte_data(slaveAddress,0x98)
	 c7 = (b.read_byte_data(slaveAddress,0x9b)<<8) + b.read_byte_data(slaveAddress,0x9a)
	 c8 = (b.read_byte_data(slaveAddress,0x9d)<<8) + b.read_byte_data(slaveAddress,0x9c)
	 c5 = uint16Toint16(c5)
	 c6 = uint16Toint16(c6)
	 c7 = uint16Toint16(c7)
	 c8 = uint16Toint16(c8)
	def getTemperature():
	 sendCommand(COMMAND_GET_TEMP)
	 sleep(0.006)
	 temp_raw = uint16Toint16(getData())
	 temp_actual = (((( c1 * temp_raw)/ 0x100) + ( c2 * 0x40)) * 100) / 0x10000;
	 return float(temp_actual)/100.0
	def getPressure(precision):
	 sendCommand(COMMAND_GET_TEMP)
	 sleep(0.006)
	 temp_raw = uint16Toint16(getData())
	 #Load measurement noise level into command along with start command bit.
	 precision = (precision << 3)|(0x01)
	 # Start pressure measurement
	 sendCommand(precision)
	 if precision == MODE_LOW:
	 sleep(0.005)
	 elif precision == MODE_STANDARD:
	 sleep(0.011)
	 elif precision == MODE_HIGH:
	 sleep(0.019)
	 elif precision == MODE_ULTRA:
	 sleep(0.067)
	 else:
	 sleep(0.1)
	 pressure_raw = getData()
	 # calculate pressure
	 s = (((( c5 * temp_raw) >> 15) * temp_raw) >> 19) + c3 + (( c4 * temp_raw) >> 17);
	 o = (((( c8 * temp_raw) >> 15) * temp_raw) >> 4) + (( c7 * temp_raw) >> 3) + (c6 * 0x4000);
	 return ((s * pressure_raw + o) >> 14)

	*/
	
	
	var wire_barom = new global.req.i2c(adress, {device: device_dev}); // point to your i2c address, debug provides REPL interface
	/*registers*/
	var T5403_COMMAND_REG = 0xf1;
	var T5403_DATA_REG_LSB = 0xf5;
	var T5403_DATA_REG_MSB = 0xf6;
	/*commands*/
	var COMMAND_GET_TEMP = 0x03;
	/*definitions for pressure reading commands with accuracy modes*/
	var MODE_LOW = 0x00;
	var MODE_STANDARD = 0x01;
	var MODE_HIGH = 0x10;
	var MODE_ULTRA = 0x11;

	global.req.async.waterfall([
	                 function(callback) {
	                	 /*read 16 bytes at 0x8e*/
	                	 wire_barom.readBytes(0x8e, 16, function(err,res) {
	                		var array_bytes=[]; 
	                		for (var i = 0; i < res.length; i+=2) {
	                			array_bytes[i/2]=res[i] + (res[i+1]<<8);
							}
	                		for (var i =4;i<8;i++){
	                			if (array_bytes[i]> 32767){
	                				array_bytes[i]-=0x10000;
	                			}
	                		}
	                		//console.log(' -- read 16 bytes at 0x8e');
	                		//console.log(' -- '+JSON.stringify(res));
	                		//console.log(' -- transform 8 bytes c1,c2,c3 ... + sign des c5 a c8');
	                		//console.log(' -- '+JSON.stringify(array_bytes));
	                		
	                		callback(err,array_bytes);
	                	 });
	                 },
	                 function(array_bytes,callback) {
	                	 /*get_temperature*/
	                	 wire_barom.writeBytes(T5403_COMMAND_REG, [COMMAND_GET_TEMP], function(err) {
	                		 //console.log(' -- send gettemp 0x03' + COMMAND_GET_TEMP);
	                		 callback(err,array_bytes);
	                	 });                     
	                 },
	                 function(array_bytes,callback) {
	                	 /*sleep 6ms*/
	                	 setTimeout(function(){
	                		 //console.log(' -- wait 6 ms');
	                		 callback(null,array_bytes);},6);
	                 },
	                 function(array_bytes,callback) {
	                	 /*T5403_DATA_REG_LSB=0xf5
	                	  *T5403_DATA_REG_MSB=0xf6 
	                	  */
	                	 wire_barom.readBytes(T5403_DATA_REG_LSB, 2, function(err,res) {
	                		var lsb=res[0];
	                		var msb=res[1];
	                		var temp_raw=(msb<<8) + lsb;
	             			if (temp_raw> 32767){
	             				temp_raw-=0x10000;
	            			}
	             			//console.log(' -- read registre T5403_DATA_REG_LSB et T5403_DATA_REG_MSB ' + JSON.stringify(res));
	             			//console.log(' -- temp_raw signé = ' + temp_raw);
	                		var temp_actual = (((( array_bytes[0] * temp_raw)/ 0x100) + ( array_bytes[1] * 0x40)) * 100) / 0x10000;
	                		var temperature= Math.round(temp_actual)/100.0;
	                		//console.log(' == TEMPERATURE : '+temperature);
	                		callback(err,array_bytes,temperature);
	                	 });
	                 },
	                 function(array_bytes,temperature,callback) {
	                	 /*get_pressure*/
	                	 wire_barom.writeBytes(T5403_COMMAND_REG, [COMMAND_GET_TEMP], function(err) {
	                		 //console.log(' -- send gettemp 0x03' + COMMAND_GET_TEMP);
	                		 callback(err,array_bytes,temperature);
	                	 });                     
	                 },
	                 function(array_bytes,temperature,callback) {
	                	 /*sleep 6ms*/
	                	 setTimeout(function(){
	                		 		//console.log(' -- wait 6 ms');
	                	 			callback(null,array_bytes,temperature);},6);
	                 },
	                 function(array_bytes,temperature,callback) {
	                	 /*T5403_DATA_REG_LSB=0xf5
	                	  *T5403_DATA_REG_MSB=0xf6 
	                	  */
	                	 wire_barom.readBytes(T5403_DATA_REG_LSB, 2, function(err,res) {
	                		var lsb=res[0];
	                		var msb=res[1];
	                		var temp_raw=(msb<<8) + lsb;
	             			if (temp_raw> 32767){
	             				temp_raw-=0x10000;
	            			}
	             			//console.log(' -- read registre T5403_DATA_REG_LSB et T5403_DATA_REG_MSB ' + JSON.stringify(res));
	             			//console.log(' -- temp_raw signé = ' + temp_raw);
	                		callback(err,array_bytes,temperature,temp_raw);
	                	 });
	                 },
	                 function(array_bytes,temperature,temp_raw,callback) {
	                	   	 /*	MODE_LOW = 0x00;
		                	 	MODE_STANDARD = 0x01;
		                	 	MODE_HIGH = 0x10;
		                	 	MODE_ULTRA = 0x11;*/
	                	 var precision=MODE_ULTRA;
	                	 //console.log(' -- set precision = ' + precision);
	                	 var precision_send=(precision << 3)|(0x01)
	                	 
	                	 wire_barom.writeBytes(T5403_COMMAND_REG, [precision_send], function(err) {
	                		 //console.log(' -- send precision = ' + precision_send);
	                		 callback(err,array_bytes,temperature,temp_raw,precision);
	                	 });  

	                 },
	                 function(array_bytes,temperature,temp_raw,precision,callback) {
	                	 var timewaitms=0;
	                	switch (precision) {
							case MODE_LOW:
								timewaitms=5;
								break;
							case MODE_STANDARD:
								timewaitms=11;
								break;
							case MODE_HIGH:
								timewaitms=19;
								break;
							case MODE_ULTRA:
								timewaitms=67;
								break;
							default:
								timewaitms=100;
								break;
						}
	                	 setTimeout(function(){
	                		 //console.log(' -- wait '+timewaitms+' ms');
	                		 callback(null,array_bytes,temperature,temp_raw,precision);}
	                	 ,timewaitms);
	                 },
	                 function(array_bytes,temperature,temp_raw,precision,callback) {
	                	 /*T5403_DATA_REG_LSB=0xf5
	                	  *T5403_DATA_REG_MSB=0xf6 
	                	  */
	                	 wire_barom.readBytes(T5403_DATA_REG_LSB, 2, function(err,res) {
	                		var lsb=res[0];
	                		var msb=res[1];
	                		var pressure_raw=(msb<<8) + lsb;
	             			//console.log(' -- read registre T5403_DATA_REG_LSB et T5403_DATA_REG_MSB ' + JSON.stringify(res));
	             			//console.log(' -- pressure_raw signé = ' + temp_raw);
	                		var s = (((( array_bytes[4] * temp_raw) >> 15) * temp_raw) >> 19) + array_bytes[2] + (( array_bytes[3] * temp_raw) >> 17);
	                		var o = (((( array_bytes[7] * temp_raw) >> 15) * temp_raw) >> 4) + (( array_bytes[6] * temp_raw) >> 3) + (array_bytes[5] * 0x4000);
	                		var pression= ((s * pressure_raw + o) >> 14)/100;
	                		//console.log(' == PRESSION : '+pression);
	                		callback(err,temperature,pression);
	                	 });
	                 },
	             ], function (err, temperature,pression) {
					if (!err){
	        	  		//console.log('****resultat temperature ** == ' + temperature);
	        	  		//console.log('****resultat pression ** == ' + pression);					
						callbackret({"temperature":temperature,"pression":pression});
					} else {
	        			//console.log('--Erreur =' + JSON.stringify(err));
						callbackret({"temperature":"error","pression":"error"});
					}

	             });

}
function get_etat_TSL2561(adress,device_dev,callbackret){
	/*# zie datasheet TSL2561
	TSLAddress = 0x39
	b.write_byte_data(TSLAddress,0x80,0x03) # enable
	#b.write_byte_data(TSLAddress,0x81,0x02) # set low gain
	b.write_byte_data(TSLAddress,0x81,0x12) # set highgain
	def getLight():
	 var = b.read_i2c_block_data(0x39, 0xAC,4)
	 var3 = ((var[1]<<8) + var[0]) # light
	 return var3
	def getLightIR():
	 var = b.read_i2c_block_data(0x39, 0xAC,4)
	 var4 = ((var[3]<<8) + var[2]) # IR
	 return var4*/
	
	var wire_light = new global.req.i2c(adress, {device: device_dev}); // point to your i2c address, debug provides REPL interface

	global.req.async.waterfall([
	         function(callback) {
	        	 /*set enable =0x03*/
	        	 wire_light.writeBytes(0x80, [0x03], function(err) {
	        		 callback(err);
	        	 });
	         },
	         function(callback) {
	        	 /*set highgain*/
	        	 wire_light.writeBytes(0x81, [0x12], function(err) {
	        		 callback(err);
	        	 });                     
	         },
	         function(callback) {
	        	 /*read bytes for light*/
	        	 wire_light.readBytes(0xAC, 4, function(err, res) {
	        		  callback(err, res);
	        	 });
	         }
	     ], function (err, res) {
			if (!err){
		  		var calcullight =(res[1]<<8) + res[0];
		  		///console.log('****resultat getlight** == ' + calcullight);
		  		var calculIR =(res[3]<<8) + res[2];
		  		//console.log('****resultat getLightIR** == ' + calculIR);
		  		callbackret({"light":calcullight,"lightIR":calculIR});
			} else {
				//console.log('--Erreur =' + JSON.stringify(err));
				callbackret({"light":"error","lightIR":"error"});
			}
	     });

}

module.exports = i2c;