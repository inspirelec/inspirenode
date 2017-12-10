/**
 * New node file
 */
/*var sqlite3= require('sqlite3').verbose();*/


module.exports = function() {
	//console.log('Utilisation de la base de donnée '+__dirname+'/'+global.req.dbmodel.name );
	this.nbsqlencours=0;
	this.nbsqltotal=0;
	this.nbsqlerror=0;
	this.transationnumber=0;
	
	this.sqlsaexecute=[];
	this.executionencours=false;

    this.database={};
	
	
	this.controledatabase=function(){		
		this.database['default']=new global.req.sqlite3.Database(__dirname+'/'+global.obj.app.config.path_database_files+global.obj.app.config.database_file+".db");
		logger('INFO',{msg:'Utilisation de la base de donnée '+__dirname+'/'+global.obj.app.config.path_database_files+global.obj.app.database_file+".db"},'database_sql');

		for (var t in global.req.dbmodel.tables){
			var tab=global.req.dbmodel.tables[t];
			if (tab.table_suffixe && !this.database[tab.table_suffixe]){
                this.database[tab.table_suffixe]=new global.req.sqlite3.Database(__dirname+'/'+global.obj.app.config.path_database_files+global.obj.app.config.database_file+tab.table_suffixe+".db");
                logger('INFO',{msg:'Utilisation de la base de donnée '+__dirname+'/'+global.obj.app.config.path_database_files+global.obj.app.database_file+tab.table_suffixe+".db"},'database_sql');
            }
		}

		logger('INFO',{msg:'Controle de la structure de la base de données.'},'database_sql');
		console.log('Controle de la structure de la base de donn�es')
		this.controleTables(global.req.dbmodel.tables);
	};

	this.controleTables=function(tablesmodel){
		var self=this;
		for (var d in this.database){
			var test=function(d) { /*closure de d*/
                global.obj.app.db.sqlorder("select * from sqlite_master where type='table'",
                    function(tablesdb){
                        for (var o = 0; o < tablesmodel.length; o++) {
                            //console.log('controle table' , tablesmodel[o].name);
                            var tablemodel = tablesmodel[o];
                            if (!tablemodel.table_suffixe) tablemodel.table_suffixe='default'
                            if (tablemodel.in_database==true && tablemodel.table_suffixe==d) {
                                var tableexist=false;
                                for (var p = 0; p < tablesdb.length; p++) {
                                    var tabledb = tablesdb[p];

                                    if (tabledb.name.toUpperCase()==tablemodel.name.toUpperCase()){
                                        tableexist=true;
                                    }
                                }
                                if (tableexist){
                                    //console.log('  controle colonnes' );
                                    self.controleColonnes(tablemodel);
                                } else {
                                    //console.log('  create table ' );
                                    self.createTable(tablemodel);
                                }
                            }


                        }
                    },null,d);
			}
			test(d);

		}

	};

	this.createTable=function(tablemodel){
		var sep="";
		var sql='CREATE TABLE if not exists '+tablemodel.name+' (';
		for ( var q in tablemodel.colonnes) {
			var colonnemodel = tablemodel.colonnes[q];
			sql+=sep+colonnemodel.name+" "+colonnemodel.type;
			sep=",";
		}
		sql+=")";
		global.obj.app.db.sqltrans(sql,null,null,tablemodel.table_suffixe);

	};

	this.sqltrans=function (order,callback,dataarray,database_suffixe){
		logger('DEBUG',{msg:'Requete : '+order},'database_sql');
		//console.log(order);
		if (!order) {
			logger('ERROR',{order:'ordre sql null !'},'database_sql');
			callback();
		} else {
			this.sqlsaexecute.push({type:'trans',order:order,dataarray:dataarray,callback:callback,database_suffixe:database_suffixe});
			this.execspoolsql();
		}
		/*if (!database_suffixe || database_suffixe=='default'){
			console.log({type:'trans',order:order,dataarray:dataarray});
		}*/

		
	};
	this.sqlorder=function (order,callback,dataarray,database_suffixe){
		logger('DEBUG',{msg:'Requete : '+order},'database_sql');
		//console.log(order);
		if (!order) {
			//console.trace('ordre null !!!',order);
			logger('ERROR',{order:'ordre sql null !'},'database_sql');
			callback();
		} else {
			this.sqlsaexecute.push({type:'order',order:order,dataarray:dataarray,callback:callback,database_suffixe:database_suffixe});
			this.execspoolsql();
		}
       /* if (!database_suffixe || database_suffixe=='default'){
            console.log({type:'order',order:order,dataarray:dataarray});
        }*/

	};
	this.execspoolsql=function(){
		if (!this.executionencours && this.sqlsaexecute.length>0){
			this.executionencours=true;
			
			var self=this;
			//console.log('->database sql :'+self.sqlsaexecute.length);
			var nbsqltraite=0;
			 global.req.async.eachSeries(self.sqlsaexecute,function(sqls,callbacke){
				 nbsqltraite++;
				 if(sqls.type=='trans'){
					 //console.log('--- exec next')
					logger('DEBUG','transac execute: '+sqls.order,'database_sql');
					 self.sqltransexec(sqls.order,function(data){
							logger('DEBUG','transac réponse: '+data,'database_sql');
							callbacke();
							if (sqls.callback) sqls.callback(data);
						},sqls.dataarray,sqls.database_suffixe);
				 }
				 if(sqls.type=='order'){
				 	//console.log('exec ',sqls.order);
					logger('DEBUG','order execute: '+sqls.order,'database_sql');
					 self.sqlorderexec(sqls.order,function(data){
							logger('DEBUG','order réponse: '+data,'database_sql');
							callbacke();
							if (sqls.callback){
									sqls.callback(data);
							}
						},sqls.dataarray,sqls.database_suffixe);
				 }
				 //console.log('<-database sql :'+self.sqlsaexecute.length,sqls);
			 }
			 ,function(err){
				for (var i = 0; i < nbsqltraite; i++) {
					self.sqlsaexecute.shift();
				}
				//console.log('<-database sql :'+self.sqlsaexecute.length);
				self.executionencours=false;
				self.execspoolsql();
			 });
		}
	};
	
	this.sqltransexec=function (order,callback,dataarray,database_suffixe){

		var selfdb=this;
        var dbsuffixe='default';
        if (database_suffixe){
            dbsuffixe=database_suffixe;
        }
		if (Array.isArray(order)){
			var nborder=0;
			//order.push('COMMIT;');
			selfdb.database[dbsuffixe].serialize(function() {
				selfdb.transationnumber++;
				var transtnum=selfdb.transationnumber;
				var nb=order.length;
				var transaction_encours=false;
				var transac=selfdb.database[dbsuffixe].exec("BEGIN;",function(e){
					transaction_encours=true;
					if (e) {
					 //	console.log(e);
				    	  logger('ERROR',{transtnum:transtnum,msg:"begin transaction probleme",err:e,order:order},'database_sql');
				      }
					//console.log('BEGIN',transtnum,e,order);
					logger('DEBUG',transtnum+" BEGIN",'database_sql');
					
				    //console.log('insertData -> begin');
				    // do multiple inserts
					var orderdataarray=[];
					for (var od in order){
						var orddata={order:order[od]};
						if (dataarray && dataarray[od]){
							orddata.dataarray=dataarray[od];
						}
						orderdataarray.push(orddata);
					}
					global.req.async.eachSeries(orderdataarray, function (orddata, callbacke) {
					// global.req.async.map(order,function(sql, indexsql,callbacke){
					    	nborder++;
							selfdb.nbsqlencours++;
							selfdb.nbsqltotal++;
							var sql=orddata.order;
							var dataarray=orddata.dataarray;
							
							/*//logger('DEBUG','execute: '+sql,'database_sql');
							transac.exec(sql, function(e) {
								//logger('DEBUG','  fin: '+sql,'database_sql');
								nb--;
						    	selfdb.nbsqlencours--;
								//console.log(selfdb.nbsqlencours + ' '+selfdb.nbsqltotal+ ' '+selfdb.nbsqlerror);
								logger('INFO',transtnum+" sql en cours:"+selfdb.nbsqlencours+" total:"+selfdb.nbsqltotal+" error:"+selfdb.nbsqlerror,'database_sql');
									
						        if (e) {
						        	//console.log(e);
						        	selfdb.nbsqlerror++;
									logger('ERROR',{transtnum:transtnum,msg:"erreur sql",order:sql,err:e},'database_sql');
						          // rollback here
						        } else {
						          //console.log(item);
						        }
						       
						        callbacke();
						        
						        
						      });*/
							
							selfdb.database[dbsuffixe].run(sql,dataarray,function(err) {
								selfdb.nbsqlencours--;
								nb--;
								//console.log(selfdb.nbsqlencours + ' '+selfdb.nbsqltotal+ ' '+selfdb.nbsqlerror);
								//logger('INFO',"sql en cours:"+selfdb.nbsqlencours+" total:"+selfdb.nbsqltotal+" error:"+selfdb.nbsqlerror,'database_sql');
								if (err){
									//console.log(err);
									selfdb.nbsqlerror++;
									logger('ERROR',{msg:"erreur sql",message:err.message,order:order,sql:sql,dataarray:dataarray,err:err},'database_sql');
								}
								lastID=this.lastID;
								callbacke();
							});	
							
						}
				  	   ,function(err){
				  		   //console.log('COMMIT',err);
				  		   transac.exec("COMMIT;", function(e) {
						    	logger('DEBUG',transtnum+" COMMIT;",'database_sql');
							      if (nb>0) {
							    	  logger('ERROR',{transtnum:transtnum,msg:"Commit avant fin des sql",restesqls:nb,order:order},'database_sql');
							      }
							      if (e) {
							      	//console.log(e);
							    	  logger('ERROR',{transtnum:transtnum,msg:"Commit probleme",err:e,order:order},'database_sql');
							      }
							      //console.log(e);
							      transaction_encours=false;
							      if (callback) callback(nborder);
							    });
				  	  });
				  });
			});
		} else {
			var transtnum=selfdb.transationnumber;
			selfdb.nbsqlencours++;
			selfdb.nbsqltotal++;
			selfdb.database[dbsuffixe].run("BEGIN;",function(e){
				if (e) {
					    //console.log(e);
			    	  logger('ERROR',{transtnum:transtnum,msg:"begin transaction probleme",err:e,order:order},'database_sql');
			      }
				var lastID=null;
				
				//logger('DEBUG',{msg:'nb sql en cours: '+selfdb.nbsqlencours+', requete: '+order+', tableau: '+dataarray},'database_sql');
				//console.log(selfdb.nbsqlencours,order,dataarray);
			    var vide;
			    if (!dataarray || dataarray==null) dataarray=vide;
				selfdb.database[dbsuffixe].run(order,dataarray,function(err) {
					selfdb.nbsqlencours--;
					//console.log(selfdb.nbsqlencours + ' '+selfdb.nbsqltotal+ ' '+selfdb.nbsqlerror);
					logger('INFO',"sql en cours:"+selfdb.nbsqlencours+" total:"+selfdb.nbsqltotal+" error:"+selfdb.nbsqlerror,'database_sql');
					if (err){
						//console.log(err);
						selfdb.nbsqlerror++;
						logger('ERROR',{msg:"erreur sql",message:err.message,order:order,dataarray:dataarray,err:err},'database_sql');
					}
					lastID=this.lastID;
				    selfdb.database[dbsuffixe].run("COMMIT;", function(e) {
						logger('DEBUG',transtnum+" COMMIT;",'database_sql');
				    	if (e) {
				    		  //console.log(e);
					    	  logger('ERROR',{transtnum:transtnum,msg:"Commit probleme",err:e,order:order},'database_sql');
					      }
			    		if (callback) callback(lastID);
				    });
				});		

			});
		}

	};

	this.sqlorderexec=function (order,callback,dataarray,database_suffixe){
		var selfdb=this;
		var dbsuffixe='default';
		if (database_suffixe){
            dbsuffixe=database_suffixe;
		}
		if (Array.isArray(order)){
			var nborder=0;
			selfdb.database[dbsuffixe].serialize(function() {
				
				    order.forEach(function(sql) {
				    	nborder++;
				    	
						selfdb.nbsqlencours++;
						selfdb.nbsqltotal++;
						//this.database[dbsuffixe].configure("busyTimeout", 29000);
						selfdb.database[dbsuffixe].all(sql,function(err,rows) {
							selfdb.nbsqlencours--;
							//console.log(selfdb.nbsqlencours + ' '+selfdb.nbsqltotal+ ' '+selfdb.nbsqlerror);
							logger('INFO',"sql en cours:"+selfdb.nbsqlencours+" total:"+selfdb.nbsqltotal+" error:"+selfdb.nbsqlerror,'database_sql');
							if (err){
								selfdb.nbsqlerror++;
								logger('ERROR',{msg:"erreur sql",order:order,sql:sql,err:err},'database_sql');
							}
							callback(rows);
						});
						
						
				    });

			});
		} else {
			selfdb.nbsqlencours++;
			selfdb.nbsqltotal++;
			//this.database[dbsuffixe].configure("busyTimeout", 29000);
			selfdb.database[dbsuffixe].serialize(function() {
				if (dataarray && dataarray!=null) {
					selfdb.database[dbsuffixe].get(order,dataarray,function(err,rows) {
						selfdb.nbsqlencours--;
						//console.log(selfdb.nbsqlencours + ' '+selfdb.nbsqltotal+ ' '+selfdb.nbsqlerror);
						//logger('INFO',"sql en cours:"+selfdb.nbsqlencours+" total:"+selfdb.nbsqltotal+" error:"+selfdb.nbsqlerror,'database_sql');
						if (err){
							selfdb.nbsqlerror++;
							logger('ERROR',{msg:"erreur sql",order:order,dataarray:dataarray,err:err},'database_sql');
						}
						if (rows && !rows[0]) {
							callback([rows]);
						}else {
							callback(rows);
						}
						
					});						
				} else {
					//console.log(order);
					selfdb.database[dbsuffixe].all(order,function(err,rows) {
						selfdb.nbsqlencours--;
						//console.log(selfdb.nbsqlencours + ' '+selfdb.nbsqltotal+ ' '+selfdb.nbsqlerror);
						//logger('INFO',"sql en cours:"+selfdb.nbsqlencours+" total:"+selfdb.nbsqltotal+" error:"+selfdb.nbsqlerror,'database_sql');
						if (err){
							selfdb.nbsqlerror++;
							logger('ERROR',{msg:"erreur sql",order:order,err:err},'database_sql');
						}
						callback(rows);
					});		
				}
			
			});
		}
		/*this.database[dbsuffixe].each(order,);*/
	};
	this.controleColonnes=function(tablemodel){

		var colonnesmodel=tablemodel.colonnes;
		global.obj.app.db.sqlorder("PRAGMA table_info("+tablemodel.name+");",
			function(colonnesdb){
				for (var o = 0; o < colonnesmodel.length; o++) {
					var colonnemodel = colonnesmodel[o];
					var colonneexist=false;
					for (var p = 0; p < colonnesdb.length; p++) {
						var colonnedb = colonnesdb[p];
						if (colonnedb.name.toUpperCase()==colonnemodel.name.toUpperCase()){
							colonneexist=true;
						}
					}
					if (!colonneexist){
						//console.log('colonne manquante',tablemodel.name,colonnemodel.name);
						var sql ='ALTER TABLE '+tablemodel.name+' ADD COLUMN '+colonnemodel.name+' '+colonnemodel.type;
						global.obj.app.db.sqltrans(sql,null,null,tablemodel.table_suffixe);
					} 
				}
			},null,tablemodel.table_suffixe);
		
	}
}
