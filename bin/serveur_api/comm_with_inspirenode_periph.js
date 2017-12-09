
var other_inspirenode_periph = function(adresseip) {
	this.adresseip=adresseip;
	
	this.set_etat=function(periph,cmd,val,callbackfunc){
		var self=this;
		//console.error(cmd,val,periph.nom,periph.id)
		var url='/main?type=set&action='+cmd+'&val='+val;
   		global.req.comm.perso_post({id:periph.id_deporte,uuid:periph.uuid_deporte},self.ip,url,self.port,function(err,httpResponse,body){
			if (err) {
				logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_inspirenode');
			}
			if (!body){
				logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_inspirenode');
			}

			callbackfunc(null,{});
			
		},self.user_auth,self.password_auth) ;

		
		//callbackfunc({});
	}
	
	this.get_etatbox=function(callback){
				
		var self=this;
		global.req.async.parallel([
   		        function(callbackfunc){
   		        	
       	
   		        	
   		        	
   		        	
	   		 		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+':'+self.port+'/main?type=get&action=listperipheriquedistant'},'box_inspirenode');
	   		 	    //console.error("@@"+self.ip+"@@");
	   		 		global.req.comm.perso_get(/*'admin:admin@'+*/self.ip,'/main?type=get&action=listperipheriquedistant',self.port,function(err,httpResponse,body){
	   					if (err) {
	   						logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_inspirenode');
	   					}
	   					if (!body){
	   						logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_inspirenode');
	   					}
	   						
	   					var res={peripheriques:{}};
	   					try {
	   						if (body) {
	   							var result =JSON.parse(body);
	   							for ( var periph in result) {
	   								res.peripheriques['id_'+result[periph].id]=result[periph];
	   								/*if (res.peripheriques['id_'+result[periph].id].box && res.peripheriques['id_'+result[periph].id].box.last_etat) {
	   									delete(res.peripheriques['id_'+result[periph].id].box.last_etat);
	   									delete(res.peripheriques['id_'+result[periph].id].box.password_auth);
	   									delete(res.peripheriques['id_'+result[periph].id].box.user_auth);
	   								}
	   								if (res.peripheriques['id_'+result[periph].id].tag){
	   									for (var t_id = 0; t_id < res.peripheriques['id_'+result[periph].id].tag.length; t_id++) {
	   										delete(res.peripheriques['id_'+result[periph].id].tag[t_id].parent);
	   									}
	   								}*/
	   							}
	   						}
	   					
	   					} catch (e) {
	   						logger('ERROR',{nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:body},'box_inspirenode');
	   					}
	   					callbackfunc(null,res);
	   					
	   				},self.user_auth,self.password_auth) ;
   		        	
   		        	
   		        },
   		        function(callbackfunc){
   		        	
   		        	logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+':'+self.port+'/main?type=get&action=listperipheriquechauffdistant'},'box_inspirenode');
	   				global.req.comm.perso_get(/*'admin:admin@'+*/self.ip,'/main?type=get&action=listperipheriquechauffdistant',self.port,function(err,httpResponse,body){
	   					if (err) {
	   						logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_inspirenode');
	   					}
	   					if (!body){
	   						logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_inspirenode');
	   					}
	   						
	   					var res={peripheriques_chauffage:{}};
	   					try {
	   						if (body) {
	   							var result =JSON.parse(body);
	   							for ( var periph in result) {
	   								res.peripheriques_chauffage['id_'+result[periph].id]=result[periph];

	   							}
	   						}
	   					
	   					} catch (e) {
	   						logger('ERROR',{nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:body},'box_inspirenode');
	   					}
	   					callbackfunc(null,res);
	   					
	   				},self.user_auth,self.password_auth) ;
   		        },
   				],function(err,res){
					if (res[0])	callback({peripheriques:res[0].peripheriques,peripheriques_chauffage:res[1].peripheriques_chauffage});
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
		if (etatbox[periph.box_identifiant]) {
			res=etatbox[periph.box_identifiant];
			if (etatbox[periph.box_identifiant][periph.box_type]){
				res=etatbox[periph.box_identifiant][periph.box_type];
				if (etatbox[periph.box_identifiant][periph.box_type][periph.box_protocole]){
					res=etatbox[periph.box_identifiant][periph.box_type][periph.box_protocole];
				}
			}
		}
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
	}
}

module.exports = other_inspirenode_periph;