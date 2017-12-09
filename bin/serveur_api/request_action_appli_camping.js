/**
 * New node file
 */


var parserxml2json = new global.req.xml2js.Parser();

module.exports =function(variables,res,user){
    	
		switch (variables.action) {
		case 'configappli':
			var config={};
			
			switch (user.type){
				case 'GERANT':
					config ={"menubutton": { 
						"accueilbutton": {"name":"Accueil","visible":true,"href":"#Gerant_Acceuil_Page"},
				   		"planbutton": {"name":"Plan","visible":true,"href":"#Gerant_Plan_Page"},
					   	"tachebutton": {"name":"Taches.","visible":true,"href":"#Gerant_Tache_Page"},
						"gestionbutton": {"name":"Gestion","visible":true,"href":"#Gerant_Gestion_Page"}
					   			  } ,
					"menubuttoncountshow":4 ,
					"menuonallpage": true,
					"firstpage":"Gerant_Acceuil_Page",
					"with_graphique_on_tag_page":false ,
					"titre_application":{"name":"Camping","size":"20"} ,
					"icon_application":{"path":"/images/mobilehome.png","width":30, "height":30}};
					break;
				case 'PERSONNEL':
					config ={"menubutton": { 
						"tachebutton": {"name":"Taches à réaliser","visible":true,"href":"#Personnel_Tache_Page"},
						"tachebutton_histo" :{"name":"Taches réalisées","visible":true,"href":"#Personnel_TacheHisto_Page"}
							} ,
					"menubuttoncountshow":2 ,
					"menuonallpage": true,
					"firstpage":"Personnel_Tache_Page",
					"with_graphique_on_tag_page":false ,
					"titre_application":{"name":"Camping","size":"20"} ,
					"icon_application":{"path":"/images/mobilehome.png","width":30, "height":30}};
					break;
				case 'VACANCIER':
					config ={"menubutton": { 
						"accueilbutton": {"name":"Accueil","visible":true,"href":"#Vacancier_Acceuil_Page"},
				   		"tagbutton": {"name":"Emplacement","visible":true,"href":"#Vacancier_Emplacement_Page"},
					   	"programmationbutton": {"name":"Enquete.","visible":true,"href":"#Vacancier_Enquete_Page"},
						"programmationbutton2": {"name":"Service.","visible":true,"href":"#Vacancier_Service_Page"}
					   			  } ,
					"menubuttoncountshow":4 ,
					"menuonallpage": false,
					"firstpage":"Vacancier_Acceuil_Page",
					"with_graphique_on_tag_page":false ,
					"titre_application":{"name":"Camping","size":"20"} ,
					"icon_application":{"path":"/images/mobilehome.png","width":30, "height":30}};
							break;
				default:
					break;
			
			}
			
			var rep = JSON.stringify(config);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;
		case 'PlanCreerEmpl' :
			var objempl=variables.data;
     		sql="INSERT INTO `tag`(`uuid`,`nom`,`icon`,`parent_tag`,`visible`,`type`,`typeprog`,`position_x`,`position_y`,`code_liste`) " +
     				"VALUES ('"+generateUUID()+"','"+objempl.code+"','"+objempl.icon+"','2','O','Piece','Programmation','"+objempl.posx+"','"+objempl.posy+"',NULL);;"
     		global.obj.app.db.sqltrans(sql);
     		var rep = JSON.stringify({});
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;
		case 'getquestion' :
			var sql="select q.*,r.note  from questions q LEFT OUTER JOIN reponses r on r.id_question=q.id order by rang;";
			global.obj.app.db.sqlorder(sql,function(rows){
				var result=rows;
				var rep = JSON.stringify(result);
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			});
			break;			
		case 'circuitpersonnel' :
			var sql="select t.*,e.position_x,e.position_y,e.nom emplacement"+
				" from taches t,tag e"+
				" where personnel is not null and personnel !=''" +
  				" and e.id=t.tag" +
  				" order by personnel,personnel_rang;"
  				
			global.obj.app.db.sqlorder(sql,function(rows){
				var result=rows;
				var rep = JSON.stringify(result);
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			});
			break;	
		case 'setreponse' :
 			var sql="delete from reponses where id_user='"+user.id+"' and id_question='"+variables.question+"';";
 			global.obj.app.db.sqltrans(sql);
     		sql="insert into reponses (id_user,id_question,note) values('"+user.id+"','"+variables.question+"','"+variables.rate+"');"
     		global.obj.app.db.sqltrans(sql);
			var result={};
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;	
		case 'tritaches' :
			for (a in variables.data){
				var affect=variables.data[a];
	     		sql="update taches set personnel='"+affect.id_personnel+"',personnel_rang='"+affect.rang+"' where id='"+affect.id_tache+"';";
	     		global.obj.app.db.sqltrans(sql);
			}
		
			var result={};
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;	
		case 'affecttaches' :

     		sql="update taches set personnel='"+variables.p+"' where id='"+variables.t+"';";
     		global.obj.app.db.sqltrans(sql);
			var result={};
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;	
		
		case 'savetaches_personnel' :
     		sql='update taches set cominterne="'+variables.data.cominterne+'", comexterne="'+variables.data.comexterne+'", etat="'+variables.data.etat+'", date_heure=datetime(\'now\') where id="'+variables.data.id+'";';
     		global.obj.app.db.sqltrans(sql);
			var result={};
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;	
			break;
		case 'listtagplan':
			 //sql="select u.*,date(premier_jour),date('now') from utilisateurs u where  u.type='VACANCIER' ";
			var	sql="Select t.*,'images/rouge.png' icon_probleme ,"
			    sql+= " (select count(1) from taches tt where tt.tag=t.id and tt.type='PROBLEME_TECHNIQUE') nb_probleme_tech,"
			    sql+= " (select count(1) from taches tt where tt.tag=t.id and tt.type='MENAGE') nb_menage,"
			    sql+= " (select count(1) from taches tt where tt.tag=t.id and tt.type='INVENTAIRE') nb_inventaire,"
			    sql+= " (select count(1) from utilisateurs u where u.emplacement=t.id and u.type='VACANCIER'   and date(premier_jour)  <= date('now')  and (dernier_jour is null or date(dernier_jour)  >=date('now'))) occupe"
			    sql+= " from tag t order by nom"
				sql+= ";"
				console.log(sql);
				global.obj.app.db.sqlorder(sql,
				function(rows){
				
					var rep = JSON.stringify(rows);
					console.log(rep);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'savetaches_vacancier':
     		sql=' insert into taches (vacancier,tag,commentaire,date,heure,type,etat,date_heure,comexterne,cominterne)' 
     		sql+=' values ("'+user.id+'","'+variables.data.tag+'","'+variables.data.commentaire+'","'+variables.data.date+'","'+variables.data.heure+'","'+variables.data.type+'","DECLARE", datetime(\'now\'),"","") ;';
     		global.obj.app.db.sqltrans(sql);
     		sql=' update taches set tag =(select emplacement from utilisateurs where id="'+user.id+'") where vacancier="'+user.id+'"; '
     		global.obj.app.db.sqltrans(sql);
			var result={};
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;	
		case 'listtaches':
			var sqlarray=[{objname:"taches",sql:"select * from taches order by personnel,personnel_rang;"},
			             {objname:"personnels",sql:"select * from utilisateurs where type='PERSONNEL';"},
			             {objname:"vacanciers",sql:"select u.* from utilisateurs u where u.type='VACANCIER' and date(u.premier_jour)  <= date('now')  and (u.dernier_jour is null or date(u.dernier_jour)  >=date('now'));"},
			             {objname:"emplacements",sql:"select t.* from tag t ;"},
			             ]
			var rep={};
			global.req.async.map(sqlarray,function(objsql,callbacksql){
				global.obj.app.db.sqlorder(objsql.sql,function(rows){
					rep[objsql.objname]=rows;
					callbacksql(null);
				});
			},function(err,result){
				var repj = JSON.stringify(rep);
				console.log(repj);
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(repj);
			})

			break;		
		case 'listeinventaire_vacancier':
			var sqlarray=[{objname:"liste_inventaire",sql:"select oi.*" +
					" from utilisateurs u,tag t, objets_inventaire oi" +
					" where u.type='VACANCIER'  and u.emplacement=t.id  and oi.code_liste=t.code_liste  and oi.actif='O'" +
					"  and u.id='" +user.id+"'" +
					"order by zone_objet, rang_objet"},
			             ]
			var rep={};
			global.req.async.map(sqlarray,function(objsql,callbacksql){
				global.obj.app.db.sqlorder(objsql.sql,function(rows){
					rep[objsql.objname]=rows;
					callbacksql(null);
				});
			},function(err,result){
				var repj = JSON.stringify(rep);
				console.log(repj);
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(repj);
			})

			break;	
		case 'listtaches_vacancier':
			var sqlarray=[{objname:"taches",sql:"select * from taches where vacancier='"+user.id+"' order by datetime(date_heure);"}
			             ]
			var rep={};
			global.req.async.map(sqlarray,function(objsql,callbacksql){
				global.obj.app.db.sqlorder(objsql.sql,function(rows){
					rep[objsql.objname]=rows;
					callbacksql(null);
				});
			},function(err,result){
				var repj = JSON.stringify(rep);
				console.log(repj);
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(repj);
			})

			break;
		case 'listtaches_personnel':
			var sqlarray=[{objname:"taches",sql:"select * from taches where personnel='"+user.id+"' and etat!='CLOS' order by personnel_rang;"},
			              {objname:"tacheshisto",sql:"select * from taches where personnel='"+user.id+"' and etat='CLOS' order by datetime(date_heure) desc limit 10;"},
			              {objname:"emplacements",sql:"select t.* from tag t ;"},
			              {objname:"vacanciers",sql:"select u.* from utilisateurs u where u.type='VACANCIER' and date(u.premier_jour)  <= date('now')  and (u.dernier_jour is null or date(u.dernier_jour)  >=date('now'));"}
			             ]
			var rep={};
			global.req.async.map(sqlarray,function(objsql,callbacksql){
				global.obj.app.db.sqlorder(objsql.sql,function(rows){
					rep[objsql.objname]=rows;
					callbacksql(null);
				});
			},function(err,result){
				var repj = JSON.stringify(rep);
				console.log(repj);
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(repj);
			})

			break;
			
		case 'userofempl' :
			var sql= "select u.* ,tt.commentaire probleme_commentaire";
			sql+= 	" from tag t left outer join utilisateurs u on u.emplacement=t.id and u.type='VACANCIER' and date(u.premier_jour)  <= date('now')  and (u.dernier_jour is null or date(u.dernier_jour)  >=date('now'))	";
			sql+= 	" left outer join taches tt on tt.tag=t.id and tt.etat !='CLOS' and tt.type='PROBLEME_TECHNIQUE'";
			sql+= 	" where t.uuid='"+variables.uuid+"' ";
			sql+= 	"	;";
			
			global.obj.app.db.sqlorder(sql,function(rows){
				
				var result={};
				result.user=rows[0];
				
				var rep = JSON.stringify(result);
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			});
			break;
		case 'allconfiglite' :
			/*{"action":"allconfiglite","tagname":"Acceuil","v":"1.1.1"}*/
			var sql="Select t.uuid from tag t, utilisateurs u where u.id='"+user.id+"' and t.id=u.emplacement;";
			console.log(sql);
			global.obj.app.db.sqlorder(sql,
				function(rows){
					var result={};
					if (rows[0]) variables.taguuid=rows[0].uuid;
					
					for (p in global.obj.peripheriques){
						var pe=JSON.parse(JSON.stringify(global.obj.peripheriques[p]));
						var pemin={};
						pemin.id=pe.id;
						pemin.uuid=pe.uuid;
						pemin.nom=pe.nom;
						pemin.codei18n=pe.codei18n;
						pemin.ecriture_type=pe.ecriture_type;
						pemin.ecriture_max_value=pe.ecriture_max_value;
						pemin.ecriture_min_value=pe.ecriture_min_value;
						pemin.categorie=pe.categorie;
						if (pemin.categorie) {
							pemin.categorie.iconMin=pemin.categorie.iconmin;
							pemin.categorie.iconMax=pemin.categorie.iconmax;
							pemin.categorie.iconMidle=pemin.categorie.iconmidle;							
						}
						pemin.visibilite=pe.visibilite;
						pemin.box_ip=pe.box_ip;
						pemin.visibleifmanuel=pe.visibleifmanuel;
						pemin.tags=pe.tag;
						var acceuil_coche=false;
						if (variables.tagname=='Acceuil'){
							for (r in rows) {
								if (rows[r].id_peripherique==pe.id) {
									acceuil_coche=true;
								}
							}			
							if (pe.ecriture_type=='ALARME') {
								acceuil_coche=true;
							}
						}
						for (t in pe.tag) {
							if (pe.tag[t] && (pe.tag[t].nom==variables.tagname || pe.tag[t].uuid==variables.taguuid || acceuil_coche) && pe.visibilite=="visible"){
								result[pemin.uuid]=pemin;
							}							
						}

						
					}
					for (p in global.obj.peripheriques_chauffage){
						var pe=JSON.parse(JSON.stringify(global.obj.peripheriques_chauffage[p]));
						var pemin={};
						pemin.id=pe.id;
						pemin.uuid=pe.uuid;
						pemin.nom=pe.nom;
						pemin.ecriture_type=pe.ecriture_type;
						pemin.ecriture_max_value=pe.ecriture_max_value;
						pemin.ecriture_min_value=pe.ecriture_min_value;
						for (c in global.obj.categories){
							if (global.obj.categories[c].type=='sonde_de_temperature'){
								var cat=global.obj.categories[c];
								pemin.categorie=cat;
							}
						}
						if (pemin.categorie) {
							pemin.categorie.iconMin=pemin.categorie.iconmin;
							pemin.categorie.iconMax=pemin.categorie.iconmax;
							pemin.categorie.iconMidle=pemin.categorie.iconmidle;							
						}

						pemin.visibilite=pe.visibilite;
						pemin.box_ip=pe.box_ip;
						pemin.visibleifmanuel=pe.visibleifmanuel;
						pemin.tags=pe.tag;
						var acceuil_coche=false;
						if (variables.tagname=='Acceuil'){
							for (r in rows) {
								if (rows[r].id_peripherique==pe.id) {
									acceuil_coche=true;
								}
							}

						}
						for (t in pe.tag) {
							if (pe.tag[t] && (pe.tag[t].nom==variables.tagname || pe.tag[t].uuid==variables.taguuid || acceuil_coche) && pe.visibilite=="visible"){
								result[pemin.uuid]=pemin;
							}
						}
					}
					result.tags=[];
					var rep = JSON.stringify(result);
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
			});

		
			break;
		case 'allmodes' :
			/*{"action":"allmodes","v":"1.1.1"}*/
			
			var result={};
			result.modes={};
			for (p in global.obj.modes){
				var pe=JSON.parse(JSON.stringify(global.obj.modes[p]));
				var pemin={};
				pemin.id=pe.uuid;
				pemin.nom=pe.nom;
				pemin.codei18n=pe.codei18n;
				pemin.icon=pe.icon;
				result.modes[pe.uuid]=pemin;
			}
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
		
			break;
		case 'getcategories' :
			/*{"action":"allmodes","v":"1.1.1"}*/
			
			var result={};
			
			for (p in global.obj.categories){
				var pe=JSON.parse(JSON.stringify(global.obj.categories[p]));
				if (pe.type=='sonde_de_temperature'
					|| pe.type=='alarme') {
					result[pe.type]=pe;
				}
			}
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
		
			break;
		case 'alltag' :
			/*{"action":"alltag","v":"1.1.1"}*/
			var result={};
			result.tags=[];
			for (p in global.obj.tags){
				var pe=JSON.parse(JSON.stringify(global.obj.tags[p]));
				var pemin={};
				pemin.id=pe.id;
				pemin.nom=pe.nom;
				pemin.codei18n=pe.codei18n;
				pemin.parent_tag=[];
				pemin.icon=pe.icon;
				pemin.uuid=pe.uuid;
				pemin.visible=pe.visible;
				pemin.type=pe.type;
				pemin.typeprog=pe.typeprog;
				if(pemin.visible=='O') {
					result.tags.push(pemin);	
				}
				
			}
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
		
			break;	
		case 'alltagmode' :
			/*{"action":"alltagmode","v":"1.1.1"}*/
			var recursivegetenfant= function(periph_parent){
				var enfants=periph_parent.get_child();
				var res={};
				res.enfants=[];
				res.avecchauffe=false;
				for (e in enfants) {
					var enf=enfants[e];
					var avecchauffe=false;
					var tmin={};
					tmin.id=enf.id;
					tmin.nom=enf.nom;
					tmin.icon=enf.icon;
					tmin.uuid=enf.uuid;
					var findenfants=recursivegetenfant(enf);
					if (findenfants.avecchauffe==true) {
						tmin.enfants=findenfants.enfants;
						res.avecchauffe=true;
						avecchauffe=true;
					} else {
						tmin.enfants=[];
					}
					
					var periphschauffe=getifexistsconsigne(enf.id) 
					if (periphschauffe.length>0) {
						res.avecchauffe=true;
						avecchauffe=true;
					}
					tmin.periphs=periphschauffe;
					
					if (avecchauffe) {
						res.enfants.push(tmin);	
					}
					
				}
				return res;
			
			} 
			
			var getifexistsconsigne =function (tag_id){
				var periphschauffe=[];
				
				for (pc in global.obj.peripheriques_chauffage) {
					/*for (pct in global.obj.peripheriques_chauffage[pc].tag) {*/
						if (pc=="tag_"+tag_id 
								&& global.obj.peripheriques_chauffage[pc].ecriture_type	=="TEMPERATURECONSIGNE"
						) {
							var pchauff={};
							

							pchauff.id=global.obj.peripheriques_chauffage[pc].id;
							pchauff.uuid=global.obj.peripheriques_chauffage[pc].uuid;
							pchauff.nom=global.obj.peripheriques_chauffage[pc].nom;
							periphschauffe.push(pchauff);
							
						}							
					/*}*/
				}
				return periphschauffe;
			}
			var result={};
			result.tagsmode=[];
			for (p in global.obj.tags){
				var pe=JSON.parse(JSON.stringify(global.obj.tags[p]));
				if(!pe.parent_tag /*&& avecchauffe*/) {
					var avecchauffe=false
					var pemin={};
					pemin.id=pe.id;
					pemin.nom=pe.nom;
					pemin.icon=pe.icon;
					pemin.uuid=pe.uuid;
					var findenfants=recursivegetenfant(global.obj.tags[p]);
					if (findenfants.avecchauffe==true) {
						pemin.enfants=findenfants.enfants;
						avecchauffe=true;
					} else {
						pemin.enfants=[];
					}
					var periphschauffe=getifexistsconsigne(pe.id) 
					if (periphschauffe.length>0) {
						res.avecchauffe=true;
						avecchauffe=true;
					}
					pemin.periphs=periphschauffe;
				
					if (avecchauffe) {
						result.tagsmode.push(pemin);	
					}
						
				}
				
			}
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
		
			break;	
		case 'getetat' :
			/*{"action":"getetat","updateTime":"0","v":"1.1.1"}*/
			 
			var boucle60sec = function(res,req_action){
				temps_waiting-=1;
				var result={};
				var etatchanged=false;
				result.updateTime=0;
				for (p in global.obj.peripheriques){
					var pe=JSON.parse(JSON.stringify(global.obj.peripheriques[p]));
					var etat={};
					if (pe.last_etat) {
						etat=pe.last_etat;
						if (pe.last_etat.expression.expr1_val || pe.last_etat.expression.expr1_unit) etat.expression.expr1=pe.last_etat.expression.expr1_val +" "+pe.last_etat.expression.expr1_unit;
						if (pe.last_etat.expression.expr2_val || pe.last_etat.expression.expr2_unit) etat.expression.expr2=pe.last_etat.expression.expr2_val +" "+pe.last_etat.expression.expr2_unit;
						if (pe.last_etat.expression.expr3_val || pe.last_etat.expression.expr3_unit) etat.expression.expr3=pe.last_etat.expression.expr3_val +" "+pe.last_etat.expression.expr3_unit;
					}
					if (etat.TimeOfetat>variables.updateTime){
						result[pe.uuid]=etat;	
						etatchanged=true;
					}
					if (etat.TimeOfetat>result.updateTime){
						result.updateTime=etat.TimeOfetat;
					}
				}
				for (p in global.obj.peripheriques_chauffage){
					var pe=JSON.parse(JSON.stringify(global.obj.peripheriques_chauffage[p]));
					var etat={};
					if (pe.last_etat) {
						etat=pe.last_etat;
						if (pe.last_etat.expression.expr1_val || pe.last_etat.expression.expr1_unit) etat.expression.expr1=pe.last_etat.expression.expr1_val +" "+pe.last_etat.expression.expr1_unit;
						if (pe.last_etat.expression.expr2_val || pe.last_etat.expression.expr2_unit) etat.expression.expr2=pe.last_etat.expression.expr2_val +" "+pe.last_etat.expression.expr2_unit;
						if (pe.last_etat.expression.expr3_val || pe.last_etat.expression.expr3_unit) etat.expression.expr3=pe.last_etat.expression.expr3_val +" "+pe.last_etat.expression.expr3_unit;
					}
					if (etat.TimeOfetat>variables.updateTime){
						result[pe.uuid]=etat;	
						etatchanged=true;
					}
					if (etat.TimeOfetat>result.updateTime){
						result.updateTime=etat.TimeOfetat;
					}
					
				}
				if ((global.req.mode.last_etat && global.req.mode.last_etat.TimeOfetat>=variables.updateTime)
						|| (global.req.type.last_etat && global.req.type.last_etat.TimeOfetat>variables.updateTime)){
						try {
							var etat=global.req.mode.last_etat;
							result['modemaj']=etat;	
							
							if (etat.expression.etat) result['mode']=etat.expression.etat.nom;
							if (etat.TimeOfetat>result.updateTime){
								result.updateTime=etat.TimeOfetat;
							}	
							
							var etat=global.req.type.last_etat;
							result['typemaj']=etat;	
							
							if (etat.expression.etat) result['type']=etat.expression.etat.nom;
							if (etat.TimeOfetat>result.updateTime){
								result.updateTime=etat.TimeOfetat;
							}
							
							etatchanged=true;							
						} catch (e) {
							console.log(e);
							console.log(new Error().stack);
						}

					}

				//console.log('---temps---'+temps_waiting);
				if (etatchanged || temps_waiting<=0) {
					
					
					//result['mode']=mode.nom;
					var rep = JSON.stringify(result);
					//console.log('----> send to '+req_action.req.connection.remoteAddress+' === ' + rep);
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(rep);	
					clearInterval(TimerEtat);						
				

				}

			};
			
			var temps_waiting=60*2;
			var self=this;
			var TimerEtat=setInterval(function(){
				
				boucle60sec(res,self);
				},500);
			

		
			break;	
		case 'setetat' :
			switch (variables.cmd){
				case 'ON':
					var periphe=global.obj.app.core.findobj(variables.uuid,'peripheriques')
					
					if (!periphe) {
						periphe=global.obj.app.core.findobj(variables.uuid,'peripheriques_alarme');
					} 
					periphe.set_etat('ON',null,function(rep_box){
						
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						});
							
					break;
				case 'OFF':
					var periphe=global.obj.app.core.findobj(variables.uuid,'peripheriques')
					if (!periphe) {
						periphe=global.obj.app.core.findobj(variables.uuid,'peripheriques_alarme');
					} 
	
					periphe.set_etat('OFF',null,function(rep_box){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						});
					break;
				case 'UP':
					var periphe=global.obj.app.core.findobj(variables.uuid,'peripheriques')
					periphe.set_etat('UP',null,function(rep_box){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						});
							
					break;
				case 'DOWN':
					var periphe=global.obj.app.core.findobj(variables.uuid,'peripheriques')
					periphe.set_etat('DOWN',null,function(rep_box){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						});
					break;
				case 'DIM':
					var periphe=global.obj.app.core.findobj(variables.uuid,'peripheriques');
					if (!periphe) {
						periphe=global.obj.app.core.findobj(variables.uuid,'peripheriques_chauffage');
					} 
					periphe.set_etat('DIM',variables.valeur,function(rep_box){
						res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
						res.end(JSON.stringify(rep_box));
					});
	
					break;
				default:
					if (variables.mode){
						global.req.mode.set_etat(variables.mode,function(){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify({}));
						})
					}
					if (variables.type){
						global.req.type.set_etat(variables.type,function(){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify({}));
						})
					}
					break;
			}
			break;
			
		case 'getid' :
			var cid=global.obj.app.core.findobj('idapplication','constantes');
			var rep={};
			rep['id']=cid.valeur;			
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify(rep));

			break;
		case 'setacceuil' :
			/*"/index.php?action=setacceuil&uuid=dfd15553caf75d02e01ed2ac272782&bool=1"
			1338:GET : /index.php{"action":"setacceuil","uuid":"dfd15553caf75d02e01ed2ac272782","bool":"1"}
			*/
			var sql="Select * from utilisateurs where user='"+this.user+"';";
			global.obj.app.db.sqlorder(sql,
				function(rows){
					if (rows.length>0) {
						
						var periph_uuid=variables.uuid;
						var is_onacceuil=variables.bool;
						var periph=global.obj.app.core.findobj(periph_uuid,'peripheriques');
						if (!periph) {
							periph=global.obj.app.core.findobj(periph_uuid,'peripheriques_chauffage');
						}
						if (!periph) {
							periph=global.obj.app.core.findobj(periph_uuid,'peripheriques_alarme');
						}
						var sql="delete from peripherique_user_acceuil where id_peripherique='"+periph.id+"' and id_utilisateurs='"+rows[0].id+"';" ;
						global.obj.app.db.sqltrans(sql);
						if (variables.bool=="1") {
						   sql="insert into peripherique_user_acceuil values ('"+periph.id+"','"+rows[0].id+"');" ;
						   global.obj.app.db.sqltrans(sql);
						}
							
					}
					
					rep={};
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));	
			});

			break;	
			
			
		case 'getprogrammation' :
			/*/index.php{"action":"getprogrammation"}*/
			/*{"mode_m0":{"tag_24":[{"heure":"0h00","valeur":"20","jours":{"Lu":"1","Ma":"1","Me":"1","Je":"1","Ve":"1","Sa":"1","Di":"1"}}],"tag_10":[{"heure":"5h00","valeur":"20.5","jours":{"Lu":"0","Ma":"1","Me":"1","Je":"0","Ve":"1","Sa":"0","Di":"1"}},{"heure":"10h00","valeur":"19","jours":{"Lu":"0","Ma":"1","Me":"1","Je":"0","Ve":"1","Sa":"0","Di":"1"}}]},"mode_m2":{"tag_24":[{"heure":"0h00","valeur":"20","jours":{"Lu":"1","Ma":"1","Me":"1","Je":"1","Ve":"1","Sa":"1","Di":"1"}}]}}*/
			var result={};
			var sql="  select distinct 'mode_' || m.uuid mode,'tag_' || t.id tag,c.id prog_id,c.heure,c.valeur,cj.id_jours ";
				sql+=" from consigne_temp c,tag t,mode m, consigne_temp_jours cj";
				sql+=" where c.mode=m.id";
				sql+=" and c.tag=t.id";
				sql+=" and cj.id_consigne_temp=c.id";
				sql+=" order by mode,tag,prog_id"	;
			global.obj.app.db.sqlorder(sql,
				function(rows){
					var obj={};
					for (l in rows){
						var lig=rows[l];
						if (!obj[lig.mode]) obj[lig.mode]={};
						if (!obj[lig.mode][lig.tag]) obj[lig.mode][lig.tag]={};
						if (!obj[lig.mode][lig.tag][lig.prog_id]) obj[lig.mode][lig.tag][lig.prog_id]={};
						if (!obj[lig.mode][lig.tag][lig.prog_id]['valeur']) obj[lig.mode][lig.tag][lig.prog_id]['valeur']=lig.valeur;
						if (!obj[lig.mode][lig.tag][lig.prog_id]['heure']) obj[lig.mode][lig.tag][lig.prog_id]['heure']=lig.heure;
						if (!obj[lig.mode][lig.tag][lig.prog_id]['jours']) obj[lig.mode][lig.tag][lig.prog_id]['jours']={"Lu":"0","Ma":"0","Me":"0","Je":"0","Ve":"0","Sa":"0","Di":"0"};
						obj[lig.mode][lig.tag][lig.prog_id]['jours'][lig.id_jours]="1";
					}
				
					var rep = JSON.stringify(obj);
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			
			break;
		case 'setprogrammation' :
			/* "/http://192.168.1.10:1338/index.php?action=setprogrammation"
			1338:POST: /http://192.168.1.10:1338/index.php{"action":"setprogrammation"}
			Body: {"data":{"mode_dd4912e9ddb325d161cade3aa9aca67d":{"tag_27":[{"heure":"2h15","valeur":"11.5","jours":{"Lu":0,"Ma":1,"Me":0,"Je":1,"Ve":1,"Sa":0,"Di":0}},{"heure":"21h15","valeur":"13","jours":{"Lu":0,"Ma":1,"Me":1,"Je":1,"Ve":1,"Sa":0,"Di":0}}],"tag_5":[{"heure":"18h00","valeur":"11","jours":{"Lu":1,"Ma":0,"Me":0,"Je":0,"Ve":0,"Sa":0,"Di":1}}]}}}
			 */
			/*
			 * {"data":{"id":"1","jours":[{"id":"Lu","value":true},{"id":"Ve","value":true},{"id":"Ma","value":true},{"id":"Di","value":true},{"id":"Je","value":true}],"mode":"2","tag":"5","heure":"0h00","valeur":"20"}}
			 */
			
			
			/*global.req.async.map(global.obj.peripheriques,function(periph,callbacko){
			 	callbacko(obj);
			}
	  		,function(err,objs){
		  		  callback();
	  		});*/
			
			/*global.req.async.series([
			             function(callbackd){
			              	callbackd();
			              }]
			           , function(err){
			           		//fin
			           });*/
			var modesprogs=variables.data;
			global.req.async.series([
			 
					function(callbackd){
						 /*delete consigne_temp_jours des modes recu*/
						 global.req.async.map(Object.keys(modesprogs),function(m,callbacko){
							 	var mode=global.obj.app.core.findobj(m.substring(5, 99),'modes');
								var sql="delete from consigne_temp_jours where id_consigne_temp in (select id from consigne_temp where consigne_temp.mode='"+mode.id+"') ; ";
								console.log("d1mode "+mode.id+" "+mode.nom);
								global.obj.app.db.sqltrans(sql,function(){
									callbacko();	
								});
							 	
							}
					  		,function(err){
					  		    console.log('fin des delete consigne_temp_jours');
					  			callbackd();
					  		});
					      	
					    },
					function(callbackf){
						 /*delete consigne_temp des modes recu*/
						 global.req.async.map(Object.keys(modesprogs),function(m,callbacke){
							 	var mode=global.obj.app.core.findobj(m.substring(5, 99),'modes');
								var sql="delete from consigne_temp where consigne_temp.mode='"+mode.id+"' ; ";
								console.log("d2mode "+mode.id+" "+mode.nom);
								global.obj.app.db.sqltrans(sql,function(){
									callbacke();	
								});
							 	
							}
					  		,function(err){
					  			console.log('fin des delete consigne_temp');
					  			callbackf();
					  		});
					      	
					    },
					function(callbackd){
						 //ajout des modes prog recus
						 global.req.async.map(Object.keys(modesprogs),function(m,callbacko){
							 
							 	var mode=global.obj.app.core.findobj(m.substring(5, 99),'modes');
							 	console.log("inmode "+mode.id+" "+mode.nom);
							 	var objprog={};
								
							 	global.req.async.map(Object.keys(modesprogs[m]),function(t,callbackt){
									var tag=global.obj.app.core.findobj(t.substring(4, 99),'tags');
									console.log("  tag " +tag.id+" "+tag.nom);
									global.req.async.map(Object.keys(modesprogs[m][t]),function(p,callbackp){
										var prog=modesprogs[m][t][p];
										objprog={};
										objprog.mode=mode.id;
										objprog.tag=tag.id;
										objprog.heure=prog.heure;
										objprog.valeur=prog.valeur;
										objprog.jours=[];
										console.log("    prog " +prog.heure+" = "+prog.valeur);
										for (j in prog.jours){
											if (prog.jours[j]==1) {
												var jour={"id":j,"value":true};
												objprog.jours.push(jour);
											}
										}
										var objsave={};
										objsave.action="save";
										objsave.element="consigne_temp";
										objsave.data=objprog;
										console.log(JSON.stringify(objsave));
										global.obj.app.core.majdb(objsave,callbackp);
										
									},
									function(err){
										callbackt();
									});
								}, function(err){
									callbacko();
								});
								
							}
					  		,function(err){
					  			console.log('fin des enregistrement consigne_temp');
					  			callbackd();
					  		});
					      	
					    }
	             ]
	           , function(err){
					var result={};
					var rep = JSON.stringify(result);
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
	           });
			break;
			
		case 'getalarmeprog' :
			/*/index.php?action=getalarmeprog&mode=85685a0ec82e72a280fe6e6e38b58457"
			1338:GET : /index.php{"action":"getalarmeprog","mode":"85685a0ec82e72a280fe6e6e38b58457"}*/
			var result={};
			var mode=obj.app.core.findobj(variables.mode,'modes');
			req.async.map(Object.keys(global.obj.peripheriques_alarme),function(a,callbacks){
				var pa=global.obj.peripheriques_alarme[a];
				result[pa.uuid]=false;
				var sql="select '"+pa.uuid+"' uuid from peripheriquealarme_mode where id_mode='"+mode.id+"' and id_peripheriquealarme='"+pa.id+"';";
				global.obj.app.db.sqlorder(sql,function(rows){
					if (rows[0] && rows[0].uuid) {
						result[rows[0].uuid]=true;
					}
					callbacks();	
				});
				
			},function (err){
				var rep = JSON.stringify(result);
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			});
			
			break;
		case 'confirmPin' :
			//http://192.168.1.10:1339/index.php?action=confirmPin&uuid=6486b4e98228b83d4b13d54febe5f170&pin=227f6afd3b7f89b96c4bb91f95d50f6d
			//variables.uuid
			//variables.pin		
			var md5=calcMD5('alarm');
			if (variables.uuid==calcMD5('alarm')){
				req.constante.get_etat('code_pin_alarme',function(val){
					var rep ={};
					if (val==variables.pin) {
						rep = {res:'OK'};	
					} 					
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));						
				})
			}

		break;
		case 'setalarmeprog' :
			//"/http://192.168.1.10:1338/index.php?action=setalarmeprog&uuid=6486b4e98228b83d4b13d54febe5f170"
			//1338:POST: /http://192.168.1.10:1338/index.php{"action":"setalarmeprog","uuid":"6486b4e98228b83d4b13d54febe5f170"}
			//Body: {"data":{"alarms":{"de181a41ea47a4a6bf2d3dec2b2926":true,"a9aea2406b2000526dd97e6c707edc":true},"mode":"765909642cbcd5c6f7c41e8196713018","pin":"d41d8cd98f00b204e9800998ecf8427e"}}

			var md5=calcMD5('alarm');
			if (variables.uuid==calcMD5('alarm')){
				req.constante.get_etat('code_pin_alarme',function(val){
					var rep ={};
					if (val==variables.data.pin) {
						var mode=obj.app.core.findobj(variables.data.mode,'modes');
						for (a in variables.data.alarms){
							var al=obj.app.core.findobj(a,'peripheriques');
                 			var sql="delete from peripheriquealarme_mode where id_mode='"+mode.id+"' and id_peripheriquealarme='"+al.id+"';";
                 			global.obj.app.db.sqltrans(sql);
             				if (variables.data.alarms[a]==true){
	                 			sql="insert into peripheriquealarme_mode (id_mode,id_peripheriquealarme) values('"+mode.id+"','"+al.id+"');"
	                 			global.obj.app.db.sqltrans(sql);
                 			}                 		       		
						}
					} 	
					var rep ={};
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));						
								
						
				})
			}
			
			break;
		case 'setalarme':
			
			var md5=calcMD5('alarm');
			if (variables.uuid==calcMD5('alarm')){
				req.constante.get_etat('code_pin_alarme',function(val){
					var rep ={};
					if (val==variables.data.pin) {
						
						for (a in variables.data.alarms){
							var al=obj.app.core.findobj(a,'peripheriques');
							if (variables.data.alarms[a]==true) {
								al.set_etat("ON",al.ecriture_max,function(){});
							} else if (variables.data.alarms[a]==false) {
								al.set_etat("OFF",al.ecriture_min,function(){});
							}
							
						}
						
					} 	
					var rep ={};
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));						
							
						
				})
			}
			break;
			
		case 'setmodes' :
			//variables.data.modes	.id/.nom/.icon
			//Body: {"data":{"modes":{"dd4912e9ddb325d161cade3aa9aca67d":{"id":"dd4912e9ddb325d161cade3aa9aca67d","nom":"Confort","icon":"images/alarm0.png"},"85685a0ec82e72a280fe6e6e38b58457":{"id":"85685a0ec82e72a280fe6e6e38b58457","nom":"Eco","icon":"images/alarm0.png"},"765909642cbcd5c6f7c41e8196713018":{"id":"765909642cbcd5c6f7c41e8196713018","nom":"Absence","icon":"images/alarm0.png"},"p448":{"id":"p448","icon":"images/confort.png","nom":"test"}}}}
			var objs={action:'delete',element:'mode'};
			for (m in global.obj.modes){
				if (!variables.data.modes[global.obj.modes[m].uuid]){
					console.log('delete mode '+ global.obj.modes[m].nom +" " +global.obj.modes[m].uuid)
					objs.data=global.obj.modes[m];
					global.obj.app.core.majdb(objs,function(){	});
				}
			}
			objs={action:'save',element:'mode'};
			for (m in variables.data.modes){
				var modesend=variables.data.modes[m];
				objs.data=modesend;
				objs.data.uuid=objs.data.id;
				var modeexists=global.obj.app.core.findobj(objs.data.uuid,'modes');
				if (modeexists) {
					objs.data.id=modeexists.id;
				}else {
					objs.data.id="";
				}
				global.obj.app.core.majdb(objs,function(){
				})
			}
			var rep ={};
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify(rep));	
			break;				
		
			
		case 'confirmpinifchangemode' :
			//"/index.php?action=confirmpinifchangemode&mode=Confort"
			//1338:GET : /index.php{"action":"confirmpinifchangemode","mode":"Confort"}
			//variables.mode =Confort
			var modeselect=global.obj.app.core.findobj(variables.mode,'modes');
			
			var sql="select * from peripheriquealarme_mode where id_mode='"+modeselect.id+"';";
			global.obj.app.db.sqlorder(sql,function(rows){
				
				var rep ={};
				rep.nbdiff=0;
				rep[modeselect.uuid]={};
				rep['alarmeactuel']={};
				for (a in global.obj.peripheriques_alarme){
					var al = global.obj.peripheriques_alarme[a];
					var eta=al.last_etat;
					var modeselect_al_on="0";
					for (r in rows){
						if (rows[r].id_peripheriquealarme==al.id){
							modeselect_al_on="1";
						}
					}
					rep[modeselect.uuid][al.uuid]={etat:modeselect_al_on};
					rep['alarmeactuel'][al.uuid]=al.alarme[0].last_etat.expression.etat;
					if (modeselect_al_on!=al.alarme[0].last_etat.expression.etat) {
						rep.nbdiff+=1;
					}
					
				}
				
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify(rep));	
			});
			break;		
		/*
		case 'getuser' :
			break;		
		case 'adduser' :
			break;
		case 'modifuser' :
			break;			
		case 'deleteuser' :
			break;
			

		case 'differemode' :
			break;
		case 'copiemodeprog' :
			break;
		case 'effacemodeprog' :
			break;*/
			
/*********************/
/*		case 'allconfig2':
			break;
		case 'allconfig':
			break;
		case 'checkconfig':
			break;
		case 'checketat':
			break;	*/	
			
			
		default:
			res.writeHead(404, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end("");
			break;
	}
};
