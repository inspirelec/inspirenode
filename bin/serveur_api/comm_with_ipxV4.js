/**
 * New node file
 */

var parserxml2json = new global.req.xml2js.Parser();


var ipxV4 = function(adresseip) {
	this.adresseip=adresseip;
	
	
	this.set_etat=function(periph,cmd,val,callbackfunc){
		var self=this;
		var type=periph.box_type;
		var ident=periph.box_identifiant;
		var cmdbox='';
		//console.log(cmd,val);
		var inverse=false;
		if (periph.ecriture_max_value<periph.ecriture_min_value) {
			inverse=true;
		}
		if (cmd && !inverse) {
			if (cmd=='ON') cmdbox='Set';
			if (cmd=='OFF') cmdbox='Clear';
			if (cmd=='STOP') cmdbox='Clear';
		} else {
			if (cmd=='ON') cmdbox='Clear';
			if (cmd=='OFF') cmdbox='Set';
			if (cmd=='STOP') cmdbox='Set';
		}

		var rep={};
		rep.cmd=cmd;
		rep.cmdbox=cmdbox;
		rep.val=val;
		rep.inverse=inverse;
		
		switch (type) {
		case 'R':
		case 'VO':
		case 'VI':
		case 'VA':
		case 'C':
			//console.log(type,cmdbox,cmd,val);
			logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:'/api/xdevices.json?'+cmdbox+type+'='+ident},'ipxV4');
			global.req.comm.perso_get(self.ip,'/api/xdevices.json?'+cmdbox+type+'='+ident,self.port,function(err,httpResponse,body){
				if (err) {
					logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
				}
				if (!body){
					logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
				}
				if (body) {
					callbackfunc(null,res);
				}
				logger('INFO',{nom:self.nom,id:self.id,msg:"Reponse box ipxV4",rep:body,lien:self.ip},'ipxV4');
				rep.body=body;
				callbackfunc(rep);
			},self.user_auth,self.password_auth);
			break;
			
		case 'VR':
			var indent_infos=ident.split("-");
			if (indent_infos.length>=2){
				var extension=indent_infos[0];
				var num_vr=indent_infos[1];
				var urlident='/user/api.cgi?Set4VR='+extension+'&VrNum='+num_vr+'&';
				switch (cmd) {
					case 'ON':
                        if (!inverse) {
                            cmdbox='PulseUp=1';
                        } else {
                            cmdbox='PulseDown=1';
                        }
						break;
					case 'OFF':
                        if (!inverse) {
                            cmdbox='PulseDown=1';
                        } else {
                            cmdbox='PulseUp=1';
                        }
						break;
					case 'STOP':
						cmdbox='VrCmd=0';
						break;
					case 'UP':
                        if (!inverse) {
                            cmdbox='VrCmd=1';
                        } else {
                            cmdbox='VrCmd=2';
                        }
						break;
					case 'DOWN':
                        if (!inverse) {
                            cmdbox='VrCmd=2';
                        } else {
                            cmdbox='VrCmd=1';
                        }
						break;
					case 'DIM':
                        if (!inverse) {
                            cmdbox='VrPercent='+val;
                        } else {
                            cmdbox='VrPercent='+(periph.ecriture_min_value-val);
                        }

						break;
					default:
						break;
				}
				//console.log(type,cmdbox,cmd,val);
				logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:urlident+cmdbox},'ipxV4');
				global.req.comm.perso_get(self.ip,urlident+cmdbox,self.port,function(err,httpResponse,body){
					if (err) {
						logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
					}
					if (!body){
						logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
					}
					if (body) {
						callbackfunc(null,res);
					}
					logger('INFO',{nom:self.nom,id:self.id,msg:"Reponse box ipxV4",rep:body,lien:self.ip},'ipxV4');
					rep.body=body;
					callbackfunc(rep);
				},self.user_auth,self.password_auth);				
			} else {
				callbackfunc({msg:"L'identifiant des Volet roulant doit etre sou la forme: 1-2 "});
			}

			break;
		
		case 'FP':
			var indent_infos=ident.split("-");
			if (indent_infos.length>=2){
				var extension=indent_infos[0];
				var num_fp=indent_infos[1];
				var urlident='/user/api.cgi?Set4FP='+extension+'&FpZone='+num_fp+'&';
				
/*	FpCmd
X : 0 pour confort, 
	1 pour Eco, 
	2 pour Hors Gel, 
	3 pour Arrêt, 
	4 pour Confort -1  
	5 pour Confort -2*/

				switch (cmd) {
					case 'ON':
						cmdbox='FpCmd=0';
						break;
					case 'OFF':
						cmdbox='FpCmd=3';
						break;
					case 'STOP':
						cmdbox='FpCmd=2';
						break;
					case 'DIM':
						cmdbox='FpCmd='+val;
						break;
					default:
						break;
				}
				//console.log(type,cmdbox,cmd,val);
				logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:urlident+cmdbox},'ipxV4');
				global.req.comm.perso_get(self.ip,urlident+cmdbox,self.port,function(err,httpResponse,body){
					if (err) {
						logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
					}
					if (!body){
						logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
					}
					if (body) {
						callbackfunc(null,res);
					}
					logger('INFO',{nom:self.nom,id:self.id,msg:"Reponse box ipxV4",rep:body,lien:self.ip},'ipxV4');
					rep.body=body;
					callbackfunc(rep);
				},self.user_auth,self.password_auth);				
			} else {
				callbackfunc({msg:"L'identifiant des Fils pilotes doit etre sou la forme: 1-2 "});
			}

			break;
		default:
			callbackfunc({msg:"Le type doit etre R, C, VI, VA, VO, VR, FP pour pouvoir commander"});
			break;
		}
		
			

	}
	
	this.get_etatbox=function(callback){
		var self=this;
		var resultat_etat=[];
		global.req.async.series([
		        function(callbackfunc){
		    		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/api/xdevices.json?Get=R'},'ipxV4');

					global.req.comm.perso_get(self.ip,'/api/xdevices.json?Get=R',self.port,function(err,httpResponse,bodyR){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
						}
						if (!bodyR){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
						}
						if (bodyR) {
							try {
								//console.log(body);
								var bod=bodyR.split("\r\n").join('').split('    ').join('');
								var result=JSON.parse(bod);
								resultat_etat.push(result);
								callbackfunc();
							} catch (e) {
								logger('ERROR',{error:e,nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:bodyR},'ipxV4');
								callbackfunc();
							}
							
						} else {
							callbackfunc();
						}

					},self.user_auth,self.password_auth)
		        },
		        function(callbackfunc){
		    		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/api/xdevices.json?Get=A'},'ipxV4');

					global.req.comm.perso_get(self.ip,'/api/xdevices.json?Get=A',self.port,function(err,httpResponse,bodyA){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
						}
						if (!bodyA){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
						}
						if (bodyA) {
							try {
								//console.log(body);
								var bod=bodyA.split("\r\n").join('').split('    ').join('');
								var result=JSON.parse(bod);
								resultat_etat.push(result);
								callbackfunc();
							} catch (e) {
								logger('ERROR',{error:e,nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:bodyA},'ipxV4');
								callbackfunc();
							}
							
						} else {
							callbackfunc();
						}

					},self.user_auth,self.password_auth)
		        },
		        function(callbackfunc){
		    		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/api/xdevices.json?Get=C'},'ipxV4');

					global.req.comm.perso_get(self.ip,'/api/xdevices.json?Get=C',self.port,function(err,httpResponse,bodyC){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
						}
						if (!bodyC){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
						}
						if (bodyC) {
							try {
								//console.log(body);
								var bod=bodyC.split("\r\n").join('').split('    ').join('');
								var result=JSON.parse(bod);
								resultat_etat.push(result);
								callbackfunc();
							} catch (e) {
								logger('ERROR',{error:e,nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:bodyC},'ipxV4');
								callbackfunc();
							}
							
						} else {
							callbackfunc();
						}

					},self.user_auth,self.password_auth)
		        },
		        function(callbackfunc){
		    		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/api/xdevices.json?Get=D'},'ipxV4');

					global.req.comm.perso_get(self.ip,'/api/xdevices.json?Get=D',self.port,function(err,httpResponse,bodyD){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
						}
						if (!bodyD){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
						}
						if (bodyD) {
							try {
								//console.log(body);
								var bod=bodyD.split("\r\n").join('').split('    ').join('');
								var result=JSON.parse(bod);
								resultat_etat.push(result);
								callbackfunc();
							} catch (e) {
								logger('ERROR',{error:e,nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:bodyD},'ipxV4');
								callbackfunc();
							}
							
						} else {
							callbackfunc();
						}

					},self.user_auth,self.password_auth)
		        },
		        function(callbackfunc){
		    		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/api/xdevices.json?Get=PW'},'ipxV4');

					global.req.comm.perso_get(self.ip,'/api/xdevices.json?Get=PW',self.port,function(err,httpResponse,bodyPW){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
						}
						if (!bodyPW){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
						}
						if (bodyPW) {
							try {
								//console.log(body);
								var bod=bodyPW.split("\r\n").join('').split('    ').join('');
								var result=JSON.parse(bod);
								resultat_etat.push(result);
								callbackfunc();
							} catch (e) {
								logger('ERROR',{error:e,nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:bodyPW},'ipxV4');
								callbackfunc();
							}
							
						} else {
							callbackfunc();
						}

					},self.user_auth,self.password_auth)
		        },
		        function(callbackfunc){
		    		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/api/xdevices.json?Get=VR'},'ipxV4');

					global.req.comm.perso_get(self.ip,'/api/xdevices.json?Get=VR',self.port,function(err,httpResponse,bodyVR){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
						}
						if (!bodyVR){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
						}
						if (bodyVR) {
							try {
								//console.log(body);
								var bod=bodyVR.split("\r\n").join('').split('    ').join('');
								var result=JSON.parse(bod);
								resultat_etat.push(result);
								callbackfunc();
							} catch (e) {
								logger('ERROR',{error:e,nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:bodyVR},'ipxV4');
								callbackfunc();
							}
							
						} else {
							callbackfunc();
						}

					},self.user_auth,self.password_auth)
		        },
		        function(callbackfunc){
		    		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/api/xdevices.json?Get=FP'},'ipxV4');

					global.req.comm.perso_get(self.ip,'/api/xdevices.json?Get=FP',self.port,function(err,httpResponse,bodyFP){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
						}
						if (!bodyFP){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
						}
						if (bodyFP) {
							try {
								//console.log(body);
								var bod=bodyFP.split("\r\n").join('').split('    ').join('').split('": "').join('": ').split('",').join(',');
								bod=bod.split('": ').join('":"').split(',"').join('","').split("}").join('"}');
								bod=bod.split(' Zone ').join('-');
								/*Arret,Confort,Hors Gel,Eco,Confort -1,Confort -2*/
								/*	FpCmd
								X : 0 pour confort, 
									1 pour Eco, 
									2 pour Hors Gel, 
									3 pour Arrêt, 
									4 pour Confort -1  
									5 pour Confort -2*/
								//console.log(bod);
								var result=JSON.parse(bod);
								for (var fp in result){
									var valueetat=-1;
									switch (result[fp]) {
									case "Arret":
										valueetat=3;
										break;
									case "Confort":
										valueetat=0;
										break;
									case "Hors Gel":
										valueetat=2;
										break;
									case "Eco":
										valueetat=1;
										break;
									case "Confort -1":
										valueetat=4;
										break;
									case "Confort -2":
										valueetat=5;
										break;
									default:
										break;
									} 
									result[fp]={"value":valueetat,"libelle":result[fp]};
								}
								resultat_etat.push(result);
								callbackfunc();
							} catch (e) {
								logger('ERROR',{error:e,nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:bodyFP},'ipxV4');
								callbackfunc();
							}
							
						} else {
							callbackfunc();
						}

					},self.user_auth,self.password_auth)
		        },
		        function(callbackfunc){
		    		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/api/xdevices.json?Get=VI'},'ipxV4');

					global.req.comm.perso_get(self.ip,'/api/xdevices.json?Get=VI',self.port,function(err,httpResponse,bodyVI){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
						}
						if (!bodyVI){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
						}
						if (bodyVI) {
							try {
								//console.log(body);
								var bod=bodyVI.split("\r\n").join('').split('    ').join('');
								var result=JSON.parse(bod);
								resultat_etat.push(result);
								callbackfunc();
							} catch (e) {
								logger('ERROR',{error:e,nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:bodyVI},'ipxV4');
								callbackfunc();
							}
							
						} else {
							callbackfunc();
						}

					},self.user_auth,self.password_auth)
		        },
		        function(callbackfunc){
		    		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/api/xdevices.json?Get=VO'},'ipxV4');

					global.req.comm.perso_get(self.ip,'/api/xdevices.json?Get=VO',self.port,function(err,httpResponse,bodyVO){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
						}
						if (!bodyVO){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
						}
						if (bodyVO) {
							try {
								//console.log(body);
								var bod=bodyVO.split("\r\n").join('').split('    ').join('');
								var result=JSON.parse(bod);
								resultat_etat.push(result);
								callbackfunc();
							} catch (e) {
								logger('ERROR',{error:e,nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:bodyVO},'ipxV4');
								callbackfunc();
							}
							
						} else {
							callbackfunc();
						}

					},self.user_auth,self.password_auth)
		        },
		        function(callbackfunc){
		    		logger('INFO',{nom:self.nom,id:self.id,msg:"Ordre envoyé a la box ",lien:self.ip+'/api/xdevices.json?Get=VA'},'ipxV4');

					global.req.comm.perso_get(self.ip,'/api/xdevices.json?Get=VA',self.port,function(err,httpResponse,bodyVA){
						if (err) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:err},'ipxV4');
						}
						if (!bodyVA){
							logger('ERROR',{nom:self.nom,id:self.id,msg:'reponse vide'},'ipxV4');
						}
						
						if (bodyVA) {
							try {
								
								var bod=bodyVA.split("\r\n").join('').split('    ').join('');
								//console.log(bod);
								//console.log("-------");
								var result=JSON.parse(bod);
								resultat_etat.push(result);
								callbackfunc();
							} catch (e) {
								logger('ERROR',{error:e,nom:self.nom,id:self.id,msg:'Probleme dans le contenu Json qui n est pas celui attendu',body:bodyVA},'ipxV4');
								callbackfunc();
							}
							
						} else {
							callbackfunc();
						}

					},self.user_auth,self.password_auth)
		        }
				],function(err){
					var r={};
					for (var i in resultat_etat){
						for (h in resultat_etat[i]){
							r[h]=resultat_etat[i][h];
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
		//res.date=etatbox.day;
		var t=periph.box_type+periph.box_identifiant;
		t=etatbox[periph.box_type+periph.box_identifiant]+"";
		if (t) {
			res.etat=etatbox[periph.box_type+periph.box_identifiant];
			if (periph.box_type=='FP'){
				res.etat=res.etat.value;
			}
			res.alls=etatbox;
		}
		if (!res) res= etatbox;
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
	}
}

module.exports = ipxV4;