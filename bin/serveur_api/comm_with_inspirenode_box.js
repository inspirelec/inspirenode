
var other_inspirenode_box = function(adresseip) {
	this.adresseip=adresseip;

	this.set_etat=function(periph,cmd,val,callbackfunc){
		var self=this;
		var url='/main?type=set&action=BOX';
		var data={cmd:cmd,
				  val:val,
				  periphremote:{
					  box:{id:periph.inspireathome_box_id.substring(3)},
					  box_type:periph.box_type,
					  box_identifiant:periph.box_identifiant,
					  box_protocole:periph.box_protocole,
					  ecriture_max_value:periph.ecriture_max_value,
					  ecriture_min_value:periph.ecriture_min_value,
					  id:periph.id,
					  uuid:periph.uuid
				  }
			  };
		
   		global.req.comm.perso_post(data,self.ip,url,self.port,function(err,httpResponse,body){
			if (err) {
				logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_inspirenode');
			}
			if (!body){
				logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_inspirenode');
			}

			callbackfunc({retour:body});
			
		},self.user_auth,self.password_auth) ;

		
	}
	
	this.get_etatbox=function(callback){
				
		var self=this;
		global.req.async.parallel([
   		        function(callbackfunc){
	   		 		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+':'+self.port+'/main?type=get&action=listboxdistante'},'box_inspirenode');
	   				global.req.comm.perso_get(/*'admin:admin@'+*/self.ip,'/main?type=get&action=listboxdistante',self.port,function(err,httpResponse,body){
	   					if (err) {
	   						logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_zway');
	   					}
	   					if (!body){
	   						logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_inspirenode');
	   					}
	   						
	   					var res={};
	   					try {
	   						if (body) {
	   							var result =JSON.parse(body);
	   							for ( var box in result) {
	   								res['id_'+result[box].id]=result[box];
	   							}
	   						}
	   					
	   					} catch (e) {
	   						logger('ERROR',{nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:body},'box_inspirenode');
	   					}
	   					callbackfunc(null,res);
	   					
	   				},self.user_auth,self.password_auth) ;
   		        	
   		        	
   		        }
   				],function(err,res){
					if (res[0])	callback(res[0]);
					else callback(res);
   					
   				})
		//ajout fm 22/11/15 : 'admin:admin@'+ pour identification

		
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
		if (etatbox[periph.inspireathome_box_id]){
			res=etatbox[periph.inspireathome_box_id];
			if (etatbox[periph.inspireathome_box_id].last_etat){
				var prefixe_identifiant="",prefixe_type="",prefixe_protocole="";
				if (etatbox[periph.inspireathome_box_id].model=='zwayme'){
					prefixe_identifiant='device';
					prefixe_type='instance';
					prefixe_protocole='commandClasse';
					
				}
					
				res=etatbox[periph.inspireathome_box_id].last_etat;
				if (etatbox[periph.inspireathome_box_id].last_etat[prefixe_identifiant+periph.box_identifiant]) {
					res=etatbox[periph.inspireathome_box_id].last_etat[prefixe_identifiant+periph.box_identifiant];
					if (etatbox[periph.inspireathome_box_id].last_etat[prefixe_identifiant+periph.box_identifiant][prefixe_type+periph.box_type]){
						res=etatbox[periph.inspireathome_box_id].last_etat[prefixe_identifiant+periph.box_identifiant][prefixe_type+periph.box_type];
						if (etatbox[periph.inspireathome_box_id].last_etat[prefixe_identifiant+periph.box_identifiant][prefixe_type+periph.box_type][prefixe_protocole+periph.box_protocole]){
							res=etatbox[periph.inspireathome_box_id].last_etat[prefixe_identifiant+periph.box_identifiant][prefixe_type+periph.box_type][prefixe_protocole+periph.box_protocole];
						}
					}
				}					
			}
		
		}

		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
	}
}

module.exports = other_inspirenode_box;