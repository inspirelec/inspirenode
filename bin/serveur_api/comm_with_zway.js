/**
 * New node file
 */

var parserxml2json = new global.req.xml2js.Parser();


var zway = function(adresseip) {
	this.adresseip=adresseip;
		 
	this.set_etat=function(periph,cmd,val,callbackfunc){
		var self=this;
		var rep={};
		rep.cmd=cmd;
		rep.val=val;
		var vale=val;
		//rep.body="mise a jour d'�tat en construction"
		var inverse=false;
		if (periph.ecriture_max_value<periph.ecriture_min_value) {
			if (cmd=='ON') vale=0;
			if (cmd=='OFF') vale=255;
			if (cmd=='STOP') vale=255;
			if (cmd=='UP') vale=0;
			if (cmd=='DOWN') vale=255;	
			inverse=true;
			
		} else {
			if (cmd=='ON') vale=255;
			if (cmd=='OFF') vale=0;
			if (cmd=='STOP') vale=0;
			if (cmd=='UP') vale=255;
			if (cmd=='DOWN') vale=0;			
		}
		
		

		
		var order='.Set('+vale+')';
		
		if (periph.box_protocole=="67") {/*commandclasse 67 ThermostatSetPoint*/
			order='.Set(1,'+vale+')';	}
			
		var url='devices['+periph.box_identifiant+'].instances['+periph.box_type+'].commandClasses['+periph.box_protocole+']'+order;
	
		rep.url=url;
		rep.inverse=inverse;
		//$tour=1;
		//while ($tour>=0) {
		//console.log('ordre to box ipx800 '+periph.box.ip+'8083/ZWaveAPI/Run/'+rep.url);
		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+':8083/ZWaveAPI/Run/'+rep.url},'box_zway');
		//ajout fm 22/11/15 : 'admin:admin@'+ pour identification
		  var urlsend=self.ip+':8083/ZWaveAPI/Run/'+rep.url;
		  
		  var periphsend=periph;
			global.req.comm.perso_get(/*'admin:admin@'+*/periph.box.ip,'/ZWaveAPI/Run/'+rep.url,periph.box.port,function(err,httpResponse,body){
				if (err) {
					logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_zway');
				}
				if (!body){
					logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_zway');
				}
				try {
					rep.body=JSON.parse(body);
					//periph.last_etat.etat=val;
				} catch (e) {
					rep={};
					logger('ERROR',{nombox:self.nom,idbox:self.id,periph_id:periphsend.id,periph_nom:periphsend.nom,
						msg:'Impossible de parser la réponse json',requete:urlsend,repbody:body},'box_zway');
				}
				
				callbackfunc(rep);
			},periph.box.user_auth,periph.box.password_auth);
		//	$tour--;
		//	sleep(1);
		//}
		
		
	}
	this.forceUpdateBox=function(device,instance,commandClasse){
		var self=this;
		/*/ZWave.zway/Run/devices[16].instances[0].commandClasses[37].Get()*/
		var urlget='/ZWave.zway/Run/devices['+device+'].instances['+instance+'].commandClasses['+commandClasse+'].Get()';
		logger('INFO',{nom:this.nom,id:this.id,msg:"Ordre envoyé a la box ",lien:urlget},'box_zway');
		
		//console.log('send get : '+urlget);
		global.req.comm.perso_get(/*'admin:admin@'+*/this.ip,urlget,this.port,function(err,httpResponse,body){
			if (err) {
				logger('ERROR',{msg:'retour get() error',nom:self.nom,id:self.id,msg:err},'box_zway');
			}
			if (!body){
				logger('ERROR',{msg:'no body suite get() ',nom:self.nom,id:self.id,msg:'reponse vide'},'box_zway');
			}
		},this.user_auth,this.password_auth) ;
	}
	
	this.arrangereponsebox=function(boby_json){
		
			var traitenoeud=function(noeud,parent_name){
				var to_date= function (timestamp){
					var datetime=new Date();
					datetime.setTime( timestamp - datetime.getTimezoneOffset()*60*1000 );
					return datetime;
				}
				var to_datefr= function (timestamp){
					var datetime=to_date(timestamp);
					var yyyy = datetime.getUTCFullYear();
					var mm = datetime.getUTCMonth()+1;
					var dd = datetime.getUTCDate();
					var hh = datetime.getUTCHours();
					var mi = datetime.getUTCMinutes();
					var ss = datetime.getUTCSeconds();
					return dd+'/'+mm+' '+hh+':'+mi;
				}
			var element_non_traite=['type','version','supported','security'
			                        ,'interviewDone','interviewCounter','srcNodeId',
			                        'srcInstanceId',,'history','invalidateTime'];
			var parent_non_traite=[/*'commandClasse132',*/'commandClasse142','commandClasse134','commandClasse133','commandClasse112','commandClasse115','commandClasse122','commandClasse114','commandClasse94','commandClasse91','commandClasse90','commandClasse89'];
			var p=parent_non_traite.indexOf(parent_name);
			var res={};
			if (p==-1) {
				if (typeof noeud === "object") {
					for (var o in noeud){
						var ligne = noeud[o];
						var t=element_non_traite.indexOf(o);
						
						if (t == -1 && p==-1) {
							res[o]=traitenoeud(ligne,o);
						} 
					} 				
				} else {
	
					res= noeud;
					if (parent_name=='value' && noeud==false) {
						res=0;
					} else if (parent_name=='value' && noeud==true){
						res=1;
					} else if (parent_name=='updateTime') {
						res=to_datefr(res*1000);
					} /*else if (parent_name=='invalidateTime') {
						res=to_datefr(res*1000);
					}*/
					
				}
			} else {
				res= noeud.name;
			}
	
			return res;
			
		}
		var traiteinstance=function(instance){
			var res={};
			for (var c in instance.commandClasses){
				var ligne = instance.commandClasses[c];
				res['commandClasse'+c]=traitenoeud(ligne,'commandClasse'+c);
			}
			return res;
		}
		var traitedevice=function(device){
			var res={};
			for (var i in device.instances){
				var ligne = device.instances[i];
				res['instance'+i]=traiteinstance(ligne);
			}
			return res;
		};
		
		var res={};
		//try {
			//if (body) {
				//var result=JSON.parse(body);
				if (boby_json) {
					for (var d in boby_json.devices) {
						var ligne = boby_json.devices[d];
						if (d!="1") {
							res['device'+d]=traitedevice(ligne);
						}
						
					}			
				}
		return res;
			//}
		//} catch (e) {
			//logger('ERROR',{nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:body},'box_zway');
		//}
		
		
	}
	this.get_etatbox=function(callbackfunc){
		var self=this;

		//ajout fm 22/11/15 : 'admin:admin@'+ pour identification
		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+':'+this.port+'/ZWaveAPI/Data/'},'box_zway');
		global.req.comm.perso_get(/*'admin:admin@'+*/this.ip,'/ZWaveAPI/Data/',this.port,function(err,httpResponse,body){
			if (err) {
				logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_zway');
			}
			if (!body){
				logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_zway');
			}
				
			var res={};
			try {
			if (body) {
				var result=JSON.parse(body);
				res=self.arrangereponsebox(result);
				}
			} catch (e) {
				logger('ERROR',{nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:body},'box_zway');
			}
			callbackfunc(res);
			
		},this.user_auth,this.password_auth) ;
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
		if (etatbox['device'+periph.box_identifiant] && periph.box_identifiant){
			res=etatbox['device'+periph.box_identifiant];
		}
		if (res['instance'+periph.box_type] && periph.box_type){
			res=res['instance'+periph.box_type];
		}
		if (res['commandClasse'+periph.box_protocole] && periph.box_identifiant){
			res=res['commandClasse'+periph.box_protocole];
		}
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
		
	}
};

module.exports = zway;