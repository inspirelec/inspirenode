/**
 * New node file
 */

var parserxml2json = new global.req.xml2js.Parser();


var eco_device = function(adresseip) {
	this.adresseip=adresseip;
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
	
	this.get_etatbox=function(callback){
		var self=this;
		global.req.async.parallel([
		        function(callbackfunc){
		    		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/status.xml'},'box_ecodevice');

					global.req.comm.perso_get(self.ip,'/status.xml',self.port,function(err,httpResponse,body){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_ecodevice');
						}
						if (!body){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_ecodevice');
						}
						
						var result=body;
						if (body) {
							try {
								parserxml2json.parseString(body, function (err, result) {
									var res={};
									res.status={};
									if (result) {
										for (var l in result.response) {
											var ligne = result.response[l];
											if (isNaN(ligne)) {
												res.status[l]=""+ligne;
											} else {
												res.status[l]=parseFloat(ligne);
											}
										}
									}
	
									callbackfunc(null,res);
								});									
							} catch (e) {
								logger('ERROR',{nom:self.nom,id:self.id,msg:'Impossible de parser la réponse xml'},'box_ecodevice');
								callbackfunc(null,{});
							}
						
						} else {
							var res={};
							callbackfunc(null,res);
						}

					},self.user_auth,self.password_auth)
		        },
		        function(callbackfunc){
		        	logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/protect/settings/teleinfo1.xml'},'box_ecodevice');
		        	global.req.comm.perso_get(self.ip,'/protect/settings/teleinfo1.xml',self.port,function(err,httpResponse,body){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_ecodevice');
						}
						if (!body){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_ecodevice');
						}
						var result=body;
						if (body) {
							try {
								parserxml2json.parseString(body, function (err, result) {
									var res={};
									res.teleinfo1={};
									if (result) {
										for (var l in result.response) {
											var ligne = result.response[l];
											if (isNaN(ligne)) {
												res.teleinfo1[l]=""+ligne;
											} else {
												res.teleinfo1[l]=parseFloat(ligne);
											}
										}
									}
	
									callbackfunc(null,res);
								});								
							} catch (e) {
								logger('ERROR',{nom:self.nom,id:self.id,msg:'Impossible de parser la réponse xml'},'box_ecodevice');
								callbackfunc(null,{});
							
							}

						} else {
							var res={};
							callbackfunc(null,res);
						}
					},self.user_auth,self.password_auth)
		        },
		        function(callbackfunc){
		        	logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/protect/settings/teleinfo2.xml'},'box_ecodevice');

					global.req.comm.perso_get(self.ip,'/protect/settings/teleinfo2.xml',self.port,function(err,httpResponse,body){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'box_ecodevice');
						}
						if (!body){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'box_ecodevice');
						}
						var result=body;
						if (body) {
							try {
								parserxml2json.parseString(body, function (err, result) {
									var res={};
									res.teleinfo2={};
									if (result) {
										for (var l in result.response) {
											var ligne = result.response[l];
											if (isNaN(ligne)) {
												res.teleinfo2[l]=""+ligne;
											} else {
												res.teleinfo2[l]=parseFloat(ligne);
											}
											
										}	
									}
	
									callbackfunc(null,res);
								});								
							} catch (e) {
								logger('ERROR',{nom:self.nom,id:self.id,msg:'Impossible de parser la réponse xml'},'box_ecodevice');
								callbackfunc(null,{});
							}	

						} else {
							var res={};
							callbackfunc(null,res);
						}
					},self.user_auth,self.password_auth)
		        }
				],function(err,res){
					var r={};
					for (var i in res){
						for (h in res[i]){
							r[h]=res[i][h];
						}
					}
					callback(r);
					
				})
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
			res.etat.version=etatbox.status.version;
			res.etat.date=etatbox.status.date;
			res.etat.time0=etatbox.status.time0;	
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

module.exports = eco_device;