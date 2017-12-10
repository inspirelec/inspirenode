/**
 * New node file
 */

var parserxml2json = new global.req.xml2js.Parser();


var fibaro = function(adresseip) {
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
			if (cmd=='ON') vale='turnOff';
			if (cmd=='OFF') vale='turnOn';
			if (cmd=='STOP') vale='stop';
			if (cmd=='UP') vale=periph.ecriture_min_value;
			if (cmd=='DOWN') vale=periph.ecriture_max_value;	
			inverse=true;
			
		} else {
			if (cmd=='ON') vale='turnOn';
			if (cmd=='OFF') vale='turnOff';
			if (cmd=='STOP') vale='stop';
			if (cmd=='UP') vale=periph.ecriture_max_value;
			if (cmd=='DOWN') vale=periph.ecriture_min_value;			
		}
		
		

		
		var order='&name=setValue&arg1='+vale;
		
		if (periph.box_protocole=="danfoss") {/*tete dansfoss*/
			order='&name=setTargetLevel&arg1='+vale;	
		}
		if (cmd=='ON' || cmd=='OFF'){
			order='&name='+vale;				
		}
		var url='deviceID='+periph.box_identifiant+order;
	
		rep.url=url;
		rep.inverse=inverse;
		//$tour=1;
		//while ($tour>=0) {
		//console.log('ordre to box ipx800 '+periph.box.ip+'8083/ZWaveAPI/Run/'+rep.url);
		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/api/callAction?'+rep.url},'box_fibaro');
		//ajout fm 22/11/15 : 'admin:admin@'+ pour identification
		  var urlsend='/api/callAction?'+rep.url;
		  
		  var periphsend=periph;
			global.req.comm.perso_get(self.ip,urlsend,periph.box.port,function(err,httpResponse,body){
				if (err) {
					logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_fibaro');
				}
				if (!body){
					logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_fibaro');
				}
				try {
					rep.body=JSON.parse(body);
					//periph.last_etat.etat=val;
				} catch (e) {
					rep={};
					logger('ERROR',{nombox:self.nom,idbox:self.id,periph_id:periphsend.id,periph_nom:periphsend.nom,
						msg:'Impossible de parser la réponse json',requete:urlsend,repbody:body},'box_fibaro');
				}
				
				callbackfunc(rep);
			},periph.box.user_auth,periph.box.password_auth);
		//	$tour--;
		//	sleep(1);
		//}
		
		
	}	
	this.arrangereponsebox=function(boby_json){
		
		//logger('DEBUG',{nom:self.nom,id:self.id,msg:boby_json},'box_fibaro');
		
		var res={};
	
		if (boby_json) {
			for (var d in boby_json) {		
				//logger('DEBUG',{nom:self.nom,id:self.id,msg:boby_json[d]},'box_fibaro');
				var ligne = boby_json[d];		
				//logger('DEBUG',{nom:self.nom,id:self.id,msg:ligne},'box_fibaro');
				if (ligne.name) {
					res[ligne.id]=ligne.properties;
				}
				
			}			
		}
		return res;
		
		
		

		

			//}
		//} catch (e) {
			//logger('ERROR',{nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:body},'box_fibaro');
		//}
		
		
	}
	this.get_etatbox=function(callbackfunc){
		var self=this;
		var urlsend='/api/devices';
		//ajout fm 22/11/15 : 'admin:admin@'+ pour identification
		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:this.ip+urlsend},'box_fibaro');
		global.req.comm.perso_get(this.ip,urlsend,this.port,function(err,httpResponse,body){
			if (err) {
				logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_fibaro');
			}
			if (!body){
				logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_fibaro');
			}
				
			var res={};
			try {
				if (body) {
					var result=JSON.parse(body);
					logger('DEBUG',{nom:self.nom,id:self.id,msg:result},'box_fibaro');
					//res=self.arrangereponsebox(result);
						
					if (result) {
						for (var d in result) {		
							//logger('DEBUG',{nom:self.nom,id:self.id,msg:result[d]},'box_fibaro');
							var ligne = result[d];		
							//logger('DEBUG',{nom:self.nom,id:self.id,msg:ligne},'box_fibaro');
							if (ligne.name) {
								res[ligne.id]=ligne.properties;
							}
							
						}			
					}
				}
			} catch (e) {
				logger('ERROR',{nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:body},'box_fibaro');
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
		if (etatbox[periph.box_identifiant] && periph.box_identifiant){
			res=etatbox[periph.box_identifiant];
		}		
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
		
	}
};

module.exports = fibaro;