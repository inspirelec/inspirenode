/**
 * New node file
 */



module.exports =function(variables,res){
		var sep="";
		var reponse={};
		switch (variables.action) {
			
			case 'save':
				if (Array.isArray(variables.data)){
					global.req.async.map(variables.data,function(element,callbackbe){
						var vars={element:variables.element,
								data:element,action:variables.action};
						obj.app.core.majdb(vars,callbackbe);
					  },function(err){
							res.writeHead(200, {'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
							res.write(JSON.stringify(reponse));
							res.end();
					  });
					
				} else {
					obj.app.core.majdb(variables,function(variabls,reponse){
						//console.log(JSON.stringify(reponse));
						res.writeHead(200, {'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
						res.write(JSON.stringify(reponse));
						res.end();
					});
				}

				break;
			case 'delete':
				obj.app.core.majdb(variables,function(variabls,reponse){
					res.writeHead(200, {'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
					res.write(JSON.stringify(reponse));
					res.end();
				});
				break;
			case 'keep':

					res.writeHead(200, {'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
					reponse.msg="";
					reponse.page='back'
					//reponse.element=obj
					res.end(JSON.stringify(reponse));
				
				break;
			case 'recupfromconfigfiles':
				
				var content=global.req.fs.readFileSync("/var/www/inspireathome/command_externe/config/modes.config");
				res.write(content+"\n");
				var content_obj=JSON.parse(content);
				var sql="";
				sql="delete from mode;"
				global.obj.app.db.sqltrans(sql);
				res.write(sql+"\n");
				for (m in content_obj.modes){
					var mode=content_obj.modes[m];
					sql="insert into mode (nom,uuid,icon) values ('"+mode.nom+"','"+mode.id+"','"+mode.icon+"');";
					global.obj.app.db.sqltrans(sql);
					res.write(sql+"\n");
				}
				
				res.write("\n\n");
				
				content=global.req.fs.readFileSync("/var/www/inspireathome/command_externe/config/programmation.config");
				res.write(content+"\n");
				content_obj=JSON.parse(content);
				/*{"mode_m0":{"tag_24":[{"heure":"0h00","valeur":"20","jours":{"Lu":"1","Ma":"1","Me":"1","Je":"1","Ve":"1","Sa":"1","Di":"1"}}]},"mode_m2":{"tag_24":[{"heure":"0h00","valeur":"20","jours":{"Lu":"1","Ma":"1","Me":"1","Je":"1","Ve":"1","Sa":"1","Di":"1"}}]}}*/
				
				res.write("\n\n");
				content=global.req.fs.readFileSync("/var/www/inspireathome/command_externe/config/acceuil_preference.txt");
				res.write(content+"\n");
				content_obj=JSON.parse(content);
				res.write("\n\n");
				content=global.req.fs.readFileSync("/var/www/inspireathome/command_externe/config/box_virtuel_etat.txt");
				res.write(content+"\n");
				content_obj=JSON.parse(content);
				res.write("\n\n");
				content=global.req.fs.readFileSync("/var/www/inspireathome/command_externe/config/type_actuel.txt");
				res.write(content+"\n");
				res.write("\n\n");
				content=global.req.fs.readFileSync("/var/www/inspireathome/command_externe/config/mode_actuel.txt");
				res.write(content+"\n");
				res.end('\n\nRecup�ration termin�e\n');
				break;
			case 'recupfrommysql':
				var sql=variables.data;
				/*	sudo nano /etc/mysql/my.cnf
 					CHANGE BIND-ADRESSE 127.0.0.1 to 192.168.1.41
 					sudo service mysql restart
 					controle avec la cmd
 					netstat -petulan | grep 3306

 					*/
				var dbmodel=global.req.dbmodel;
				var sqllitedb=global.obj.app.db;
				var mysql      = global.req.mysql;
				var con_mysql = global.req.mysql.createConnection({
				  host     : '192.168.1.41',
				  user     : 'node',
				  port : 3306,
				  password : 'inspirenode',
				  database : 'inspireathome'
				});

				con_mysql.connect();
				sqllitedb.sqltrans('delete from sqlite_sequence;');
				for (var tableid = 0; tableid < dbmodel.tables.length; tableid++) {
					var table = dbmodel.tables[tableid];
					var table_name=table.name;
					if (table_name=="categorie" ) { table_name="peripherique_categorie";}
					
					
					con_mysql.query('SELECT * from '+table_name+ ' limit 500', 
						function(err, rows, fields) {
							if (!err)	{								
								var tab;
								var tabsel;
								for (var tableid = 0; tableid < dbmodel.tables.length; tableid++) {
									var tab = dbmodel.tables[tableid];
									if (tab.name==fields[0].table ||
											(tab.name=="categorie" && fields[0].table=="peripherique_categorie")) { 
										tabsel=tab;}
								}
								sqllitedb.sqltrans('delete from '+tabsel.name+";");
								for (var r = 0; r < rows.length; r++) {
									
									var row = rows[r];
									var sqlinsert='insert into '+ tabsel.name+ ' (';
									var sqlvalues='(';
									var sep="";

									for (var tc = 0; tc < tabsel.colonnes.length; tc++) {
										
										var colonne = tabsel.colonnes[tc];
										sqlinsert+=sep+colonne.name;
										if (row[colonne.name])	sqlvalues+=sep+"'"+row[colonne.name]+"'";
										if (!row[colonne.name])	sqlvalues+=sep+"null";
										sep=",";
									}
									sqlinsert+=') VALUES ' + sqlvalues + ');';
									//console.log(sqlinsert);
									sqllitedb.sqltrans(sqlinsert);
									
								} 
								//console.log(tabsel.name);
							} else {
								//console.log(err);
							}
						});					
				}


				con_mysql.end();
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end('Recup�ration termin�e\n');
				break;
			default:
				break;
		}
		
	    
	    
	};
	


	
