
var sonoscomm = function(adresseip) {
	this.adresseip=adresseip;
	
	this.set_etat=function(periph,cmd,val,callbackfunc){
		var self=this;
		var ident=periph.box_identifiant;
		var Sonos = global.req.sonos;
		var device=new Sonos.Sonos(self.ip,self.port);
		if (device){
			switch (cmd) {
			case 'ON':
				device.play(function (err, nexted) {callbackfunc(false);});
				break;
			case 'OFF':
				device.stop(function (err, nexted) {callbackfunc(false);});
				break;
			case 'UP':
				device.next(function (err, nexted) {callbackfunc(false);});
				break;
			case 'DOWN':
				device.previous(function (err, nexted) {callbackfunc(false);});
				break;
			case 'DIM':
				device.setVolume(val, function (err, nexted) {callbackfunc(true);});
				break;
			default:
				break;
			}			
		} else {
			callbackfunc({});
		}

		
		
		
	}
	
	this.get_etatbox=function(callbackfunc){
		var self=this;
		//console.log('services :'+JSON.stringify(sonos.Services));
		global.req.async.waterfall([
		           					function(callback){
		           						var Sonos = global.req.sonos;
		           						var device=new Sonos.Sonos(self.ip,self.port);
		           	                	callback(null,device);
		           	                	
		           	                },
		           	                function(device,callback){
		           	                	if (!device) callback({err:"probleme device not found"});
		           	                	
		           	                	var infos={ip:device.host,port:device.port};
		           	                	device.getVolume(function(err,volume){
		           	                		infos.volume=volume;
		           	                		callback(null,device,infos);
		           	          		  }); 
		           	                },
		           	                function(device,infos,callback){
		           	                	device.getCurrentState(function(err,state){
		           	                		infos.state=state;
		           	                		callback(null,device,infos);
		           	          		  }); 
		           	                },
		           	                function(device,infos,callback){
		           	                	device.currentTrack(function(err,track){
		           	                		infos.track=track;
		           	                		callback(null,device,infos);
		           	          		  }); 
		           	                },
		           	                function(device,infos,callback){
		           	                	device.getMusicLibrary('tracks', {},function(err,data){
		           	                		infos.MusicLibrary=data;
		           	                		callback(null,device,infos);
		           	          		  }); 
		           	                },
		           	                function(device,infos,callback){
		           	                	device.searchMusicLibrary('artists', "Pep's",{}, function(err,data){
		           	                		infos.searchMusicLibrary=data;
		           	                		callback(null,device,infos);
		           	          		  }); 
		           	                },
		           					function(device,infos,callback){
		           	                	device.deviceDescription(function(err,info){
		           	                		infos.description=info;
		           	                		callback(null,device,infos);
		           	          		  }); 
		           	                }
		           	            ],
		           	        function(err,device,infos){
		           				callbackfunc(infos);
		           			});


	}
	
	this.get_etat=function(callbackfunc,periph,etatbox){
		var self=this;
		if (!etatbox && !self.last_etat) {			
			etatbox=this.get_etatbox(function(etatboxres){
				self.filtre_etat(callbackfunc,periph,etatboxres);
			});
		} else if (!etatbox){
			self.filtre_etat(callbackfunc,periph,self.last_etat);
		} else {
			self.filtre_etat(callbackfunc,periph,etatbox);
		}
	}
	
	this.filtre_etat=function(callbackfunc,periph,etatbox){
		var res=etatbox;
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
	}
}

module.exports = sonoscomm;