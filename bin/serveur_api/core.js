/**
 * New node file
 */
var core=function(){
	this.timer=null;
	var self=this;
	this.charge_all=function(callback){
		var self=this;
		global.req.async.series([
                		   /*chargement des data*/
                 		  function(callbackt){
        						self.charge_dbmodel(callbackt);
        					},
            			  function(callbackco){
        						try {
	          				    	global.req.constante.charge_constantes(callbackco);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement constantes',error:e},'startstop');
								}
          				    }, 
        				  function(callbackm){ 
        						try {
									global.req.mode.charge_modes(callbackm);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement modes',error:e},'startstop');
								}
        						
          					},
          				  function(callbackty){ 
        						try {
									global.req.type.charge_types(callbackty);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement types',error:e},'startstop');
								}
        						
          					},
          				  function(callbackg){ 
        						try {
									global.req.graph.charge_graphs(callbackg)
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement graphs',error:e},'startstop');
								}
        						;
          					},
                  		  function(callbackg2){ 
        						try {
									global.req.graph.charge_parents_graphs(callbackg2)
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement parents_graphs',error:e},'startstop');
								}
          						;
          					},
        				  function(callbackt){ 
        						try {
									global.req.tag.charge_tags(callbackt)
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement tags',error:e},'startstop');
								}
        						;
          					},
                  		  function(callbackt2){ 
        						try {
									global.req.tag.charge_parents_tags(callbackt2)
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement parents_tags',error:e},'startstop');
								}
          						;
          					},
          			      function(callbackc){  
        						try {
									global.req.categorie.charge_categories(callbackc);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement categories',error:e},'startstop');
								}
          						
          				    },           			  
          				  function(callbackco){   
        						try {
									global.req.consigne.charge_consignes(callbackco);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement consignes',error:e},'startstop');
								}
          				    	
          				    },
          				  function(callbackb){ 
        						try {
									global.req.box.charge_boxs(callbackb);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement boxs',error:e},'startstop');
								}
          				    	
	          				},
          				  function(callbackp){   
        						try {
									global.req.peripherique.charge_peripheriques(callbackp);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement peripheriques',error:e},'startstop');
								}
	          					
	          					
	          				},
	          			  function(callbackpc){ 
        						try {
        							global.req.periph_chauffage.charge_peripheriques_chauffage(callbackpc);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement peripheriques_chauffage',error:e},'startstop');
								}
	          					
	          				},	          			  
	          			  function(callbackpa){  
        						try {
									global.req.periph_alarme.charge_peripheriques_alarme(callbackpa);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement peripheriques_alarme',error:e},'startstop');
								}
	          					
	          				},	          			  
	          			  function(callbackba){  
        						try {
									global.req.periph_batterie.charge_peripheriques_batterie(callbackba);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement peripheriques_batterie',error:e},'startstop');
								}
	          					
	          				},
          				  function(callbackpd){  
          				  	//callbackpd();
        						try {
									global.req.periph_deporte.charge_peripheriques_deporte(callbackpd);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement peripheriques_deporte',error:e},'startstop');
								}
	          					
	          				},
							function(callbacka){
								try {
									global.req.alerte.charge_alertes(callbacka);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement alertes',error:e},'startstop');
								}

							}/*,
	          			  function(callbackbe){    
	          					self.boucle_chargeetatbox(callbackbe);
	          				}*/]

          		, function(err) { //This is the final callback
                      global.obj.app.serveur.emit('core_charge_all');
                      global.req.mode.get_etat(function(arg,arg2){
                    	  var i=1;
                      })
                      global.req.type.get_etat(function(arg,arg2){
                    	  var i=1;
                      })
                      callback();
                  });
	}
	this.findinperiphs=function(uuid){
		var periphe=global.obj.app.core.findobj(uuid,'peripheriques');
		if (!periphe) {
			periphe=global.obj.app.core.findobj(uuid,'peripheriquesdeportes');
		} 
		if (!periphe) {
			periphe=global.obj.app.core.findobj(uuid,'peripheriques_chauffage');
		} 		
		if (!periphe) {
			periphe=global.obj.app.core.findobj(uuid,'peripheriques_alarme');
		} 
		if (!periphe) {
			periphe=global.obj.app.core.findobj(uuid,'peripheriques_batterie');
		} 
		return periphe;
	}
	
	this.findobj=function(id_or_name,type){
		if (global.obj[type]){
			for (var i in global.obj[type]){
				if (global.obj[type][i].id && global.obj[type][i].id==id_or_name) {
					return global.obj[type][i];
				}
			}
			for (var i in global.obj[type]){
				if (global.obj[type][i].uuid && global.obj[type][i].uuid==id_or_name) {
					return global.obj[type][i];
				}
			}
			for (var i in global.obj[type]){
				if (global.obj[type][i].name && global.obj[type][i].name==id_or_name) {
					return global.obj[type][i];
				}
				if (global.obj[type][i].nom && global.obj[type][i].nom==id_or_name) {
					return global.obj[type][i];
				}
			}
			for (var i in global.obj[type]){
				if (global.obj[type][i].code && global.obj[type][i].code==id_or_name) {
					return global.obj[type][i];
				}
			}
		} else if (global[type]) {
			for (var i in global[type]){
				if (global[type][i].id && global[type][i].id==id_or_name) {
					return global[type][i];
				}
			}
			for (var i in global[type]){
				if (global[type][i].uuid && global[type][i].uuid==id_or_name) {
					return global[type][i];
				}
			}
			for (var i in global[type]){
				if (global[type][i].name && global[type][i].name==id_or_name) {
					return global[type][i];
				}
				if (global[type][i].nom && global[type][i].nom==id_or_name) {
					return global[type][i];
				}
			}
		}
		return null;
	}

	
	this.charge_dbmodel=function(callback){
			global.obj.tables=global.req.dbmodel.tables;
			callback();
	}

	this.majdb= function(variables,callback,database_suffixe){
		var sep="";
		var reponse={};
		var avecReload=false;
		switch (variables.action) {
			
			case 'save':	
				
				function after_id_tableprinc(table_model,id,reponse,variables,obj,callbackr,avecReload,database_suffixe){
				if (table_model.tables_compl){
					
					var id1=id;
					 global.req.async.map(Object.keys(table_model.tables_compl),function(tc,callbacke){
						 	var tabcomp=table_model.tables_compl[tc];
							var sqldel="delete from "+tabcomp.name+" where id_"+table_model.name+"="+id1+";";
							//console.log(sqldel);
							var id2=id1;
							global.obj.app.db.sqltrans(sqldel,function(){
								var id3=id2;
								try {
									global.req.async.map(Object.keys(obj[tabcomp.soustable_name]),function(vtc,callbacked){
										var sobj=obj[tabcomp.soustable_name][vtc];
										var sqlins="insert into "+tabcomp.name+" (id_"+table_model.name+",id_"+tabcomp.soustable_name+") values ('"+id3+"','"+sobj.id+"');";
										//console.log(sqlins);
										global.obj.app.db.sqltrans(sqlins,function(){callbacked()});
									},function(err){
										callbacke();
							  		}	);
								} catch (e) {
									//console.log(e);
									callbacke();
								}
			
							
								
							});
							
						}
				  		,function(err){
				  			if (!avecReload) {
								reponse.element=obj;
								if (callbackr) callbackr(variables,reponse);
				  			} else {
								global.obj.app.core.charge_all(function(){
									//res.end();
									reponse.element=obj;
									if (callbackr) callbackr(variables,reponse);
								});					  				
				  			}

				  		});
				} else {
					if (!avecReload) {
						reponse.element=obj;
						if (callbackr) callbackr(variables,reponse);
		  			} else {
						global.obj.app.core.charge_all(function(){
							//res.end();
							reponse.element=obj;
							if (callbackr) callbackr(variables,reponse);
						});		
		  			}
					
				}

				
			}
				
				
				var table=variables.element;
				var obj=(variables.data);
                if (obj.id<0) {
                    logger('ERROR','enregistrement avec id < 0 ==' + obj.id ,'database');
                    delete obj.id ;
                }
				var id=obj.id;

				var id_exists=false;
				var table_model=global.obj.app.core.findobj(table,'tables');
				if (!database_suffixe){
                    database_suffixe=table_model.table_suffixe;
				}
				if(table_model.reloadAll){
                    avecReload=true;
				}
				if (!obj.uuid || obj.uuid==""){
					obj.uuid=generateUUID();
				}
				global.req.async.series([
				                          function(callbackb){
				                        	if (isRealValue(id) && id >=0)  {
					              				var sql='Select * from '+table+' where id =\''+id+'\';';
					            				global.obj.app.db.sqlorder(sql,
					            					function(rows){
					            						if (isRealValue(id) && rows.length>0) {
					            							id_exists=true;
					            						}
					            						callbackb();
					            				},null,database_suffixe);
				                        	} else {
				                        		callbackb();
				                        	}

				                          },
				                          function(callbacka) {
				                        	  if (id && id_exists) {
				                        		  id_exists=false;
				          						var sql="update "+table+" set "
				          						var cols="";
				          						var valeurs_array=[];
				          						var sep="";
				          							for (var c in table_model.colonnes){
				          								var col=table_model.colonnes[c];
				          								if (col.name!='id' && isRealValue(obj[col.name])){
				          									cols+=sep+col.name+"=?";
				          									sep=",";
				          									valeurs_array.push(obj[col.name]);
				          								}
				          							}
				          						sql+=cols+" where id='"+id+"';";
				          						//console.log(sql);
				          						//res.writeHead(200, {'Content-Type': 'text/plain',
				          						//	 'Access-Control-Allow-Origin': '*'});
				          						reponse.msg="Mise à jour réalisée";
				          						reponse.type="update";
				          						//callback(variables,reponse);
				          						//res.write(JSON.stringify(reponse));		
				          						var id2=id;
				          						if (valeurs_array.length>0) {
                                                    global.obj.app.db.sqltrans(sql,function(){
                                                        //console.log('after_id_tableprinc id='+id)
                                                        after_id_tableprinc(table_model,id2,reponse,variables,obj,callbacka,avecReload,database_suffixe);
                                                    },valeurs_array,database_suffixe);
												} else {
				          							callbacka(null);
												}

				          						
				          						
				          					} else {
				          						id_exists=false;
					           					var sql="insert into "+table+" ("
					    						var cols="";
					    						var vals="";
					    						var valeurs_array=[];
					    						var sep="";
					    							for (var c in table_model.colonnes){
					    								var col=table_model.colonnes[c];
					    								if (col.name!='id' /*|| !id_exists*/ ){
					    									cols+=sep+col.name;
					    									vals+=sep+"?"
					    									valeurs_array.push(obj[col.name]);
					    									sep=",";
					    								}
					    							}
					    							id_exists=false;
					    						sql+=cols+") values ("+vals+");";
					    						//console.log(sql);
                                                  if (valeurs_array.length>0) {
                                                      global.obj.app.db.sqltrans(sql,function(rowid){
                                                          //res.writeHead(200, {'Content-Type': 'text/plain',
                                                          //	 'Access-Control-Allow-Origin': '*'});
                                                          //reponse.page='back'
														  logger('DEBUG',{msg:'Save',sql:sql,valeurs_array:valeurs_array},'core');
                                                          var sql1=sql;
                                                          id=rowid;
                                                          //console.log('==id='+id);
                                                          obj.id=id;
                                                          /*console.log('after_id_tableprinc id='+id+'  '+sql1)*/
                                                          reponse.msg="Ajout réalisé";
                                                          reponse.type="insert";
                                                          //callback(variables,reponse);
                                                          //res.write(JSON.stringify(reponse));
                                                          after_id_tableprinc(table_model,id,reponse,variables,obj,callbacka,avecReload,database_suffixe);

                                                      },valeurs_array,database_suffixe);
                                                  } else {
                                                      callbacka(null);
                                                  }

				          						                          

				          					}
				                        	  
				                        	  
				                          }],
				                          function(err){
											if (callback) callback(variables,reponse);
										});
				

				break;
			case 'delete':
				var table=variables.element;
				var table_model=global.obj.app.core.findobj(table,'tables')
				var obj=(variables.data);
				var id=obj.id;
                if (!database_suffixe){
                    database_suffixe=table_model.table_suffixe;
                }
				//console.log('delete '+table+ ' where id='+id);
				if (id) {
					var sql="delete from "+table;
					sql+=" where id='"+id+"';";
					//console.log(sql);
					global.obj.app.db.sqltrans(sql);
					//res.writeHead(200, {'Content-Type': 'text/plain',
					//	 'Access-Control-Allow-Origin': '*'});
					if (table_model.tables_compl){
						for (var tc in table_model.tables_compl){
							var tabcomp=table_model.tables_compl[tc];
							var sqldel="delete from "+tabcomp.name+" where id_"+table_model.name+"="+id+";";
							//console.log(sqldel);
							global.obj.app.db.sqltrans(sqldel,null,null,database_suffixe);
						}
					}
					reponse.msg="Suppression réalisée";
                    reponse.type="delete";
					reponse.page='back'
					reponse.element=obj
					//res.write(JSON.stringify(reponse));
				}
				if (avecReload){
                    global.obj.app.core.charge_all(function(){
                        if (callback) callback(variables,reponse);
                        //res.end();
                    });
				} else {
                    if (callback) callback(variables,reponse);
				}

				break;
		default:
			break;
		}
		
		
	}

	/*this.boucle_chargeetatbox=function(callback){
		var self=this;		
		
		if (!this.timer) {
			//self.timer=setInterval(function(){global.req.box.update_etat_boxs(function(){});}, 15000);
			global.obj.app.serveur.on('box.update_etat_box',function(box){
				global.req.peripherique.update_etat_periph_of_box(box,function(){
					global.req.periph_chauffage.update_etat_periphchauff(function(){});
					global.req.periph_alarme.update_etat_periphalarme(function(){});
				});
			});
		}
		global.req.box.update_etat_boxs(callback);
	}*/
	
	
	this.set_last_etat=function(obj,new_etat,originsetetat,user){

		//if (user) console.log(user.user,JSON.stringify(new_etat));
		var changed=false;
		var added=false;
		var changed_etat=false;
		var added_etat=false;
		var lastsetetatname='maj_etat_general';
		if (originsetetat) {
			lastsetetatname=originsetetat;
		}
		/*var jlast_etat="";
		var jnew_etat="";*/
		var etat_avant;
		try {
			if (!obj.last_etat) {
				added=true;
				added_etat=true;
			} else {
				var colsetat_bouge=	["etat","expr1_val","expr2_val","expr3_val","expr4_val","expr5_val","expr6_val","expr7_val","etat_unit","expr1_unit","expr2_unit","expr3_unit","expr4_unit",
					"expr5_unit" ,"expr6_unit","expr7_unit"];
				if (obj.last_etat.expression && new_etat) {
                    for (var col in colsetat_bouge){
                        if (obj.last_etat.expression[colsetat_bouge[col]]+''==new_etat[colsetat_bouge[col]]+'') {
                        } else {
                            changed=true;
                        }
                    }
                    if(obj.last_etat.expression.etat && obj.last_etat.expression.etat.nom){
                    	/*test changement mode ou type*/
                    	if (obj.last_etat.expression.etat.id+''==new_etat.etat.id+''){

						} else {
                            changed=true;
						}

					}
				}

				/*jlast_etat=JSON.stringify(obj.last_etat.expression);
				jnew_etat=JSON.stringify(new_etat);
				if (jlast_etat!=jnew_etat) {
					changed=true;
				}*/
				if (obj.last_etat.expression && obj.last_etat.expression.etat!=new_etat.etat) {
					changed_etat=true;
					etat_avant=obj.last_etat.expression.etat;
					/*if (obj.id=='tag_27') {
						console.error(originsetetat,obj.id,obj.nom,'lastetat:',obj.last_etat.expression.etat);
					}*/
				}
				
				
			}
		} catch (e) {
			logger('ERROR',{msg:'Probleme en changement etat periph',nom:obj.nom,id:obj.id,lastsetetatname:lastsetetatname,last_etat:obj.last_etat,new_etat:new_etat,error:e},'changement_etat');
			
		}

		//console.log(obj.name + "__"+obj.constructor.name);
		if (changed || added){
            if (obj && obj.id && obj.last_etat && obj.last_etat.expression ){
                var periph_etat_virtuel={action:'save',element:'periph_virtuel_etatavant',data:{}};
                Object.assign(periph_etat_virtuel.data,	    obj.last_etat.expression,{id:obj.id});
                obj.etatavant={};
                Object.assign(obj.etatavant,{'expression':obj.last_etat.expression});
                global.obj.app.core.majdb(periph_etat_virtuel,function(){},'virtuel');
            }
            if (obj && obj.id && new_etat ){
                var periph_etat_virtuel={action:'save',element:'periph_virtuel_etat',data:{}};
                Object.assign(periph_etat_virtuel.data,		new_etat,{id:obj.id});

                global.obj.app.core.majdb(periph_etat_virtuel,function(){},'virtuel');
            }
			var typeobj=obj.name;
			if (!typeobj) typeobj=obj.constructor.name;
			
			if (changed) {

				logger('INFO',{msg:'Changement etat periph',nom:obj.nom,id:obj.id,lastsetetatname:lastsetetatname,last_etat:obj.last_etat,new_etat:new_etat,},'changement_etat');
				
				if (obj.categorie && obj.categorie.nom){
					var cat_nom = obj.categorie.nom;
					cat_nom = cat_nom.replace("/", "_");
					logger('INFO',{msg:'Changement etat periph',nom:obj.nom,id:obj.id,last_etat:obj.last_etat,new_etat:new_etat,},'changement_etat_'+cat_nom);
				}
				global.obj.app.serveur.emit(typeobj+'.last_etat.changed',obj,obj.last_etat,new_etat,user);
                obj.last_etat.expression_avant=obj.last_etat.expression;
				obj.last_etat.expression=new_etat;
				obj.last_etat.TimeOfetat=new Date().getTime();	
				obj.last_etat.TimeOfetat_str=req.moment().format('DD/MM/YY HH:mm:ss');	
				
				if (lastsetetatname && changed_etat && new_etat) {
					//console.error(originsetetat,obj.id,obj.nom,etat_avant,new_etat.etat,'-----changed etat');
					/*if (obj.id=='tag_27') {
						console.trace(originsetetat,obj.id,obj.nom,etat_avant,new_etat.etat,'-----changed etat');
						console.log(JSON.stringify(obj.box.last_etat['id_tag_27']));
						console.log(JSON.stringify(obj.last_etat.expression));
					}		*/			
					if (!obj.last_etat[lastsetetatname]) obj.last_etat[lastsetetatname]={};
					
					obj.last_etat[lastsetetatname].TimeOfetat=new Date().getTime();	
					obj.last_etat[lastsetetatname].TimeOfetat_str=req.moment().format('DD/MM/YY HH:mm:ss');
					obj.last_etat[lastsetetatname].etat=new_etat.etat;
					obj.last_etat[lastsetetatname].etat_avant=etat_avant;

				} 
				
				//console.log("     "+jlast_etat);
				//console.log("     "+jnew_etat);				
			} else if (added){
				logger('INFO',{msg:'Changement etat periph',nom:obj.nom,id:obj.id,lastsetetatname:lastsetetatname,last_etat:obj.last_etat,new_etat:new_etat,},'changement_etat');
				
				if (obj.categorie && obj.categorie.nom) {
					var cat_nom = obj.categorie.nom;
					cat_nom = cat_nom.replace("/", "_");
					logger('INFO',{msg:'Changement etat periph',nom:obj.nom,id:obj.id,last_etat:obj.last_etat,new_etat:new_etat,},'changement_etat_'+cat_nom);
				}
				global.obj.app.serveur.emit(typeobj+'.last_etat.added',obj,obj.last_etat,new_etat,user);
				obj.last_etat={};
				obj.last_etat.expression=new_etat;
				obj.last_etat.TimeOfetat=new Date().getTime();	
				obj.last_etat.TimeOfetat_str=req.moment().format('DD/MM/YY HH:mm:ss');	
				
				if (lastsetetatname && added_etat && new_etat) {
					if (!obj.last_etat[lastsetetatname]) obj.last_etat[lastsetetatname]={};
					obj.last_etat[lastsetetatname].TimeOfetat=new Date().getTime();	
					obj.last_etat[lastsetetatname].TimeOfetat_str=req.moment().format('DD/MM/YY HH:mm:ss');
					obj.last_etat[lastsetetatname].etat=new_etat.etat;
				} 
				//console.log("     "+jnew_etat);	
			}
			
			//obj.last_etat=new_etat;

		}
		
	}
	
	this.clientactif=function(req){
		//var remoteip=req.connection.remoteAddress;
		//if (!this.clients) {
		///	this.clients={};
		//}
		
		//this.clients['client_'+remoteip]=(new Date).getTime();
		//console.log((new Date),(new Date).getTime(),remoteip);
	}
	
}	

generateUUID = function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

isRealValue = function isRealValue(obj){
	 var res=false;
	 var test=typeof obj;
	 if (typeof obj != "null" && typeof obj!= "undefined") res=true;
	 return res;
	}

core.prototype= new global.req.events.EventEmitter();
module.exports = core;