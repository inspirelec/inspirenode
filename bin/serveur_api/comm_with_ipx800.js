/**
 * New node file
 */

var parserxml2json = new global.req.xml2js.Parser();


var ipx800 = function(adresseip) {
	this.adresseip=adresseip;
	

	
	this.set_etat=function(periph,cmd,val,callbackfunc){
		var self=this;
		var type=periph.box_type;
		var ident=periph.box_identifiant;
		//var url='/'+type+'s.cgi?'+type+'='+ident;
		
		var inverse=false;
		if (periph.ecriture_max_value<periph.ecriture_min_value) {
			inverse=true;
		}
			
		
		/*var etat=periph.last_etat.expression.etat;*/
		/*var need_switch=true;*/
		if (cmd && !inverse) {
			/*if (etat==1 && cmd=='ON' && type!='btn') need_switch=false;
			if (etat==0 && cmd=='OFF' && type!='btn') need_switch=false;
			if (etat=='up' && cmd=='ON' && type=='btn') need_switch=false;
			if (etat!='up' && cmd=='OFF' && type=='btn') need_switch=false;*/
			if (cmd=='ON') val=1;
			if (cmd=='OFF') val=0;
			if (cmd=='STOP') val=0;
			//if ($cmd=='DIM' && isset($val)) $url.=$val;
		} else {
			/*if (etat==0 && cmd=='ON' && type!='btn') need_switch=false;
			if (etat==1 && cmd=='OFF' && type!='btn') need_switch=false;
			if (etat=='up' && cmd=='OFF' && type=='btn') need_switch=false;
			if (etat!='up' && cmd=='ON' && type=='btn') need_switch=false;*/
			if (cmd=='ON') val=0;
			if (cmd=='OFF') val=1;
			if (cmd=='STOP') val=1;
		}
		
		var rep={};
		rep.cmd=cmd;
		rep.val=val;
		rep.inverse=inverse;
		//console.log('p'+periph.id+' c'+cmd+' v'+val+' i'+inverse/*' s'+need_switch+' e'+etat*/);

		if (isNaN(ident)) {ident=9999};
		var url ="";
		
		if (type=='count' && cmd=='DIM') {
			var coef_ecriture=periph.box_coeff;
			if (!coef_ecriture || isNaN(coef_ecriture)){
				coef_ecriture=1;
			}
			val=val*coef_ecriture;
			url="/protect/assignio/counter1.htm?"+"num="+ident+"&counter="+val;//(val*coef_ecriture);
			global.req.comm.perso_get(self.ip,url,self.port,function(err,httpResponse,body){
				if (err) {
					logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_ipx800');
				}
				if (!body){
					logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_ipx800');
				}
				logger('INFO',{nom:self.nom,id:self.id,msg:"Reponse box ipx",rep:body,lien:self.ip+url},'box_ipx800');
				rep.body=body;
				/*rep.need_switch=true;*/
				//periph.last_etat.expression.etat=val;
				callbackfunc(rep);
			},self.user_auth,self.password_auth);
		} else {
			if (cmd=='DIM' || cmd=='DOWN' || cmd=='UP'){
				logger('WARNING',{nom:self.nom,id:self.id,msg:"l'ipx800 gere pas la commande "+cmd},'box_ipx800');
				rep.body="l'ipx800 gere pas la commande "+cmd;
				need_switch=false;
			}
			url ="/preset.htm?"+type+(parseInt(ident)+1)+"="+val;
			//console.log('ordre to box ipx800 '+self.ip+url);
			//if (need_switch) {
			logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+url},'box_ipx800');
			global.req.comm.perso_get(self.ip,url,self.port,function(err,httpResponse,body){
				if (err) {
					logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_ipx800');
				}
				if (!body){
					logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_ipx800');
				}
				logger('INFO',{nom:self.nom,id:self.id,msg:"Reponse box ipx",rep:body,lien:self.ip+url},'box_ipx800');
				rep.body=body;
				/*rep.need_switch=true;*/
				//periph.last_etat.expression.etat=val;
				callbackfunc(rep);
			},self.user_auth,self.password_auth);
			//} else {
			//	rep.need_switch=false;
			//	callbackfunc(rep);
			//}
		}
			
			
	

	}
	
	this.get_etatbox=function(callbackfunc){
		var self=this;
		logger('INFO',{nom:self.nom,id:this.id,msg:"Ordre envoyé a la box ",lien:this.ip+'/status.xml'},'box_ipx800')
		global.req.comm.perso_get(this.ip,'/status.xml',self.port,function(err,httpResponse,body){
			//var result=body;
			
			if (err) {
				logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_ipx800');
				body=self.body;
			}
			if (!body){
				logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_ipx800');
				body=self.body;
			}
			if (body) {
				self.body=body;
				try {
					parserxml2json.parseString(body, function (err, result) {
						var res={};
						if (result) {
							for (var l in result.response) {
								var ligne = result.response[l];
								if (isNaN(ligne)) {
									res[l]=""+ligne;
								} else {
									res[l]=parseFloat(ligne);
								}
								
							}						
						}

						callbackfunc(res);
					});		
				} catch (e) {
					logger('ERROR',{nom:self.nom,id:self.id,msg:'Impossible de parser la réponse xml',body:body},'box_ipx800');
					callbackfunc({});
				}
		
			} else {
				var res={};
				callbackfunc(res);
			}

		},self.user_auth,self.password_auth) 
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
		//res.date=etatbox.day;
		var t=periph.box_type+periph.box_identifiant;
		t=etatbox[periph.box_type+periph.box_identifiant]+"";
		if (t) {
			res.version=etatbox.version;
			res.tinf20=etatbox.tinf20;
			res.day=etatbox.day;
			res.etat=etatbox[periph.box_type+periph.box_identifiant];
			res.alls=etatbox;
			
		}
		if (!res) res= etatbox;
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
	}
}

module.exports = ipx800;