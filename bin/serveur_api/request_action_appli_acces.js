/**
 * New node file
 */


var parserxml2json = new global.req.xml2js.Parser();
var preferenceuser={};

module.exports =function(variables,res,user,req){
    	//console.log(userselect);
		if (user && user.validkey) {
			res.writeHead(404, {'WWW-Authenticate': 'Basic realm="INSPIRATHOME"'});
			res.end();
			return;
		}
	
    	var userselect=getpreference(user,'userselect');
    	
    	
		if (userselect && userselect!=''){
			//console.log(userselect + ' ok');	
			var sql="select * from utilisateurs where id='"+userselect+"';"
			global.obj.app.db.sqlorder(sql,function(rows){
				var userclient
				if (rows && rows[0]) {
					userclient =rows[0];
		 		} else {
		 			userclient=user;
		 		}
				//console.log(userclient.id + '= client ,'+user.id + '= admin');
				traitementSwitch(variables,res,userclient,user,req);
			});
		} else {
			traitementSwitch(variables,res,user,user,req);
		}
		
	

};
function setpreference(user,namepropertie,value){
	if (!preferenceuser['user_'+user.id]){
		preferenceuser['user_'+user.id]={};
	}
	
	if (value==null && preferenceuser['user_'+user.id][namepropertie]) {
		delete preferenceuser['user_'+user.id][namepropertie];
	} else {
		preferenceuser['user_'+user.id][namepropertie]=value;
	}
}
function getpreference(user,namepropertie) {
	if (user && preferenceuser['user_'+user.id] && 
			preferenceuser['user_'+user.id][namepropertie] && 
			preferenceuser['user_'+user.id][namepropertie]!=''){
		return preferenceuser['user_'+user.id][namepropertie];
	} else {
		return undefined;
	}
}
function sallefromtag(taginfo){
	var salletag={};
	if (taginfo) {
		salletag.id=taginfo.id;
		salletag.nom=taginfo.nom;
		salletag.type=taginfo.type;
		salletag.uuid=taginfo.uuid;		
	}

	return salletag;
}
function getRandomIntInclusive(min, max) {
	return Math.floor(Math.random() * (max - min +1)) + min;
}
function getnewcodeacces(){
	return getRandomIntInclusive(10000,99999);
}
function traitementSwitch(variables,res,user,userreq,req){
	var salleselected=getpreference(userreq,'salleselect');
	
		switch (variables.action) {
		case 'configappli':
			var config={};
			console.log(user.type);
			switch (user.type){
				case 'ADMINISTRATEUR':
				case 'GERANT':
					config ={"menubutton": { 
						"resabutton": {"name":"Réservation","visible":true,"href":"#Acces_Resa_Page"},
				   		"profilbutton": {"name":"Profil","visible":true,"href":"#Acces_Profil_Page"},
					   	"paramsbutton": {"name":"Parametres","visible":true,"href":"#Acces_Parametres_Page"},
						"tagbutton": {"name":"Salles","visible":true,"href":"#Acces_Batiment_Page"}
					   			  } ,
					"menubuttoncountshow":4 ,
					"menuonallpage": true,
					"firstpage":"Acces_Resa_Page",
					"with_graphique_on_tag_page":false ,
					"titre_application":{"name":"Contrôle acces","size":"20"} ,
					"icon_application":{"path":"/images/siege_social.png","width":30, "height":30}};
					break;
				case 'CLIENT':
				case 'SERVICE':
					config ={"menubutton": { 
						"resabutton": {"name":"Réservation","visible":true,"href":"#Acces_Resa_Page"},
				   		"profilbutton": {"name":"Profil","visible":true,"href":"#Acces_Profil_Page"}//,
					   	//"paramsbutton": {"name":"Parametres","visible":true,"href":"#Acces_Parametres_Page"},
						//"tagbutton": {"name":"Salles","visible":true,"href":"#Acces_Tag_Page"}
					   			  } ,
					"menubuttoncountshow":2 ,
					"menuonallpage": true,
					"firstpage":"Acces_Resa_Page",
					"with_graphique_on_tag_page":false ,
					"titre_application":{"name":"Contrôle acces","size":"20"} ,
					"icon_application":{"path":"/images/siege_social.png","width":30, "height":30}};
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
	
		case 'alltag' :
			/*{"action":"alltag","v":"1.1.1"}*/
			var result={};
			result.tags=[];
			for (p in global.obj.tags){
				if (global.obj.tags[p].visible=='O' && global.obj.tags[p].type=='Piece'
					&& (!variables.batiment || variables.batiment==global.obj.tags[p].parent_tag)) {
					
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
			}
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
		
			break;	
		case 'allbatiment' :
			/*{"action":"alltag","v":"1.1.1"}*/
			var result={};
			result.tags=[];
			for (p in global.obj.tags){
				if (global.obj.tags[p].visible=='O' && global.obj.tags[p].type=='Batiment') {
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
			}
			var rep = JSON.stringify(result);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
		
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
		case 'allconfiglite' :
			/*{"action":"allconfiglite","tagname":"Acceuil","v":"1.1.1"}*/
				
					var result={};
					//if (rows[0]) variables.taguuid=rows[0].uuid;
					
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
		case 'controleinfouser':
			
			/*var test={"data":{"to":"jerome.bonnesoeur@orange.fr","from":"jerome.bonnesoeur@orange.fr","objet":"Confirmation de creation de compte","user":{"usersel":"","id":31,"uuid":"3429867bf9ca0d282af4bdd9d994c304","nom":"d","prenom":"d","societe":"","siret":"12345678912345","adresse1":"d","adresse2":"","ville":"01000 Saint-Denis-lÃ¨s-Bourg","telephone":"0215546598","telephone_portable":"","email":"jerome.bonnesoeur@orange.fr","codeacces":"","badge_numero":"","badge_abonnement_date_fin":"","type":"CLIENT","validkey":"b0b6e087372ff3db8bb9381cfd1d8d13"},"linkactivation":"http://www.inspirelec.com/adr/activecompte.php?id=&test_developpementvalidkey=b0b6e087372ff3db8bb9381cfd1d8d13"}};
			global.req.comm.perso_post(test,'www.inspirelec.com','/adr/comm_with_mail.php?sendmail=O',80,function(err,httpResponse,body){
				console.log('body',body);
			}); */
			
			var sql ="select case when siret is null then 'OK' when (trim(upper(?)) = trim(upper(siret))  and trim(upper(siret)) !='') then 'KO' else 'OK' end siret," +
					" case when email is null then 'KO' when (trim(upper(?)) = trim(upper(email))) then 'KO' else 'OK' end email" +
					" from utilisateurs" +
					" where ((trim(upper(?)) = trim(upper(siret)) and trim(upper(siret)) !='')" +
					"    or trim(upper(?)) = trim(upper(email)))" +
					"    and id != ?;" ;
					
			var params=[variables.data.siret,variables.data.email,variables.data.siret,variables.data.email,variables.data.id];
			
			global.obj.app.db.sqlorder(sql,
				function(rows){
					var rep={email:'OK',siret:'OK'};
					if (rows && rows[0]) {
						if (rows[0].email=='KO' ){
							rep.email='Un compte avec cet email existe déjà';
						}
						if (rows[0].siret=='KO' ){
							rep.siret='Un compte avec ce numéro de siret existe déjà';
						}
					}
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));
				
				},params)
			
			break;
		case 'recupmotpasse' :
			var mail={to:variables.data.email,
				from:global.obj.parametres.params_general.params_emailexped,
				objet:'Récupération de mot de passe',
				password:generateUUID().substr(1, 10),
				type:'NEW_PASSWORD'};
			global.req.comm.perso_post(mail,'www.inspirelec.com','/adr/comm_with_mail.php?sendmail=O',80,function(err,httpResponse,body){
				console.log(body);
			}); 
			var sql="update utilisateurs set password=? where email=?;"
			var params=[mail.password,variables.data.email];			
			global.obj.app.db.sqltrans(sql,function(){
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end('Votre compte est actif');			
			},params);
			break;
		case 'validcompteuser':
			var sql="update utilisateurs set validkey=null where validkey=?;"
			var params=[variables.validkey];			
			global.obj.app.db.sqltrans(sql,function(){
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end('Votre compte est actif');			
			},params);

			break;
		case 'createuser' :
			//console.log(JSON.stringify(variables.data));
			variables.action='save';
			variables.element='utilisateurs';
			if (!userreq || userreq.type!='ADMINISTRATEUR') {
				if (user){
					variables.data.codeacces=user.codeacces;
					variables.data.badge_numero=user.badge_numero;
					variables.data.badge_abonnement_date_fin=user.badge_abonnement_date_fin;
					variables.data.type='CLIENT';
				} else {
					/*creation d'un compte*/
					variables.data.codeacces=getnewcodeacces();
					variables.data.badge_numero='';
					variables.data.badge_abonnement_date_fin='';
					variables.data.type='CLIENT';
				
				}
			}
			variables.data.user=generateUUID();
			variables.data.validkey=generateUUID();
			
			obj.app.core.majdb(variables,function(variabls,reponse){
				//console.log(JSON.stringify(reponse));
				res.writeHead(200, {'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
				res.write(JSON.stringify({res:'CREER'}));
				res.end();
				delete variables.data.password;
				delete variables.data.passwordconfirm;
				var mail={to:variables.data.email,from:global.obj.parametres.params_general.params_emailexped,objet:'Confirmation de creation de compte'};
				mail.user=variables.data;
				mail.linkactivation="http://www.inspirelec.com/adr/activecompte.php?id="+global.obj.app.core.findobj('idapplication','constantes').valeur+"&validkey="+variables.data.validkey;
				mail.type='NEW_USER';
				global.req.comm.perso_post(mail,'www.inspirelec.com','/adr/comm_with_mail.php?sendmail=O',80,function(err,httpResponse,body){
					console.log(body);
				}); 

			});
			
			
			
			break;
		case 'setAfficheAide':
			
			var sql="update utilisateurs set afficheaide=? where id=?;";
			var paramsql=[variables.data.afficheaide,user.id];
			
			global.obj.app.db.sqltrans(sql,function(){
				var rep=JSON.stringify({res:'OK'});
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			},paramsql) 
			break;
			
		case 'setinfouser' :
			
			
			//console.log(JSON.stringify(variables.data));
			variables.action='save';
			variables.element='utilisateurs';
			if (userreq.type!='ADMINISTRATEUR') {
				variables.data.codeacces=user.codeacces;
				variables.data.type=user.type;
				variables.data.badge_numero=user.badge_numero;
				variables.data.badge_abonnement_date_fin=user.badge_abonnement_date_fin;
			}
			/*{"id":"1","uuid":"f121df454gfd1g2d1d4fg4fd",
			 * "nom":"Dupont","prenom":"Jean",
			 * "societe":"","siret":"","adresse1":"8","adresse2":"",
			 * "ville":"85500 Saint-Paul-en-Pareds",
			 * "telephone":"0251640731","telephone_portable":"",
			 * "email":"jean.dupont@inspirelec.com",
			 * "password":"******","passwordconfirm":"******",
			 * "codeacces":"13595","badge_numero":"1234567890","badge_abonnement_date_fin":"2016-04-30"}*/
			obj.app.core.majdb(variables,function(variabls,reponse){
				//console.log(JSON.stringify(reponse));
				res.writeHead(200, {'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
				res.write(JSON.stringify(reponse));
				res.end();
			});

	
			break;
		case 'validpaiement':
			var rep=JSON.stringify(variables);
			//console.log('retour paiement',rep);
			/*retour paiement {"action":"validpaiement","v":"acces.1.1.1","remoteip":"83.206.120.51",
			 * "data":{"numcli":"011453","exer":"2016","refdet":"1604082120223","objet":"36cbe71a10de1c9d6d5cb770d5c6a3c6","montant":"800","mel":"jerome.bonnesoeur@orange.fr","saisie":"T","resultrans":"P","numauto":"3feabd","dattrans":"08042016","heurtrans":"2122"}}*/
			
        	var remoteipinspirelec=req.connection.remoteAddress;
        	var remoteiptipi=variables.remoteip;
        	var infocde=variables.data;
        	var dns = require('dns');
        	dns.lookup('www.tipi.budget.gouv.fr', function (err, dnsadrtipi, family) {
            	dns.lookup('www.inspirelec.com', function (err, dnsadrinspirelec, family) {
            		
            		if (infocde.resultrans=='P') {
	        			var sql="update reservations set etat=? where cde_validcode=? and cde_no=? and etat=? and supprime=? and montant_tot_cde=?;";
	        			var paramsql=['ACTIF',infocde.objet,infocde.refdet,'PAIEMENT','N',infocde.montant];
	        			
						global.obj.app.db.sqltrans(sql,function(){
							var rep=JSON.stringify({res:'OK'});
							res.writeHead(200, 
										{'Content-Type': 'text/plain',
										 'Access-Control-Allow-Origin': '*'});
							res.end(rep);
							
							var sql=" select u.email,u.codeacces,u.nom,u.prenom,r.montant_tot_cde montant from reservations r inner join utilisateurs u on u.id=r.clientid  where cde_validcode=? and cde_no=? limit 1;";
							global.obj.app.db.sqlorder(sql,
								function(rows){
									if (rows && rows[0] && rows[0].email){
										var mail={to:rows[0].email,from:global.obj.parametres.params_general.params_emailexped,
												objet:'Confirmation de commande'};
										mail.cde=infocde.refdet;
										mail.montant=rows[0].montant;
										mail.user_nom=rows[0].nom;
										mail.user_prenom=rows[0].prenom;
										mail.user_mail=rows[0].email;	
										mail.user_codeacces=rows[0].codeacces;
										mail.type='CONF_CDE_CLIENT';
										
										global.req.comm.perso_post(mail,'www.inspirelec.com','/adr/comm_with_mail.php?sendmail=O',80,function(err,httpResponse,body){
											console.log(body);
										});
										mail.to=global.obj.parametres.params_general.params_emaildesticde;
										mail.objet='Confirmation de commande client '+mail.user_nom+ ' '+mail.user_prenom;
										mail.type='CONF_CDE_ADMIN';
										setTimeout(function(){
											global.req.comm.perso_post(mail,'www.inspirelec.com','/adr/comm_with_mail.php?sendmail=O',80,function(err,httpResponse,body){
												console.log(body);
											});
										},10000)
										
									}
								},[infocde.objet,infocde.refdet]);

						},paramsql)            			
            		} else {
	        			var sql="update reservations set supprime=? where cde_validcode=? and cde_no=? and etat=? and supprime=?;";
	        			var paramsql=['O',infocde.objet,infocde.refdet,'PAIEMENT','N'];
	        			
						global.obj.app.db.sqltrans(sql,function(){
							var rep=JSON.stringify({res:'KO'});
							res.writeHead(200, 
										{'Content-Type': 'text/plain',
										 'Access-Control-Allow-Origin': '*'});
							res.end(rep);
						},paramsql)  
            		}

        			
					var objretour={element:'retourpaiement',data:infocde,action:'save'};
					objretour.data.dnsadrtipi=dnsadrtipi;
					objretour.data.dnsadrinspirelec=dnsadrinspirelec;
					objretour.data.remoteiptipi=remoteiptipi;
					objretour.data.remoteipinspirelec=remoteipinspirelec;
					
        			obj.app.core.majdb(objretour,function(variabls,reponse){});
            		
            	});
        	});

			break;
		case 'getpaiement':
			deleteResaPaiementAttente(user,	function(){
				if (userreq.type=='CLIENT'  || userreq.type=='SERVICE') {
					//console.log(sql);
					getinfopanier(user.id,
							function(panier){
								global.req.numerotation.create_numero(function(num){
									console.log('recu num',lpad(num,3));
									var annee= global.req.moment().format('YYYY');
									var cde_no= 'FLOTILLE'+global.req.moment().format('YYMM')+lpad(num,3);
									
									if (panier.reservations && panier.reservations.encommande && panier.reservations.encommande.montant && panier.reservations.encommande.montant>0) {

										var validcode=generateUUID();
										var sql="update reservations set etat=?,cde_validcode=?,cde_no=?,montant_tot_cde=?,cde_dat=? where etat=? and clientid=?;";
										var cde_dat=global.req.moment.utc(new Date);//.toISOString();
										cde_dat=cde_dat.add(-global.req.moment.timeZoneOffset,'minutes');
										
										var paramsql=['PAIEMENT',validcode,cde_no,panier.reservations.encommande.montant*100,cde_dat.toISOString(),'COMMANDE',user.id]
										global.obj.app.db.sqltrans(sql,function(){
											var cid=global.obj.app.core.findobj('idapplication','constantes');
											var url="/tpa/paiement.web?" +
											"numcli=" +global.obj.parametres.params_general.params_numclienttipi+
											"&exer="+annee +
											"&refdet="+cde_no +
											"&objet="+validcode +
											"&montant="+(panier.reservations.encommande.montant*100) +
											"&mel="+user.email +
											"&urlcl=http://www.inspirelec.com/adr/validpaiement.php?idretour="+cid.valeur +
											"&saisie=T";
											//console.log('TIPI *********',url);
											/*global.req.comm.perso_get('www.tipi.budget.gouv.fr',url,80,function(err,httpResponse,body){
												console.log(body);
												
											},null,null,'https');*/
											
											url="https://www.tipi.budget.gouv.fr"+url;
											//console.log(url);
											var rep=JSON.stringify({link:url});
											res.writeHead(200, 
													{'Content-Type': 'text/plain',
													 'Access-Control-Allow-Origin': '*'});
											res.end(rep);	
										},paramsql);								
									}else {
	
											var sql="update reservations set etat=?,cde_validcode=?,cde_no=?,montant_tot_cde=? where etat=? and clientid=?;";
											var paramsql=['ACTIF','administrateur_validation',cde_no,panier.reservations.encommande.montant*100,'COMMANDE',user.id,]
											global.obj.app.db.sqltrans(sql,function(){
												var rep=JSON.stringify({});
												res.writeHead(200, 
															{'Content-Type': 'text/plain',
															 'Access-Control-Allow-Origin': '*'});
												res.end(rep);
											},paramsql);
									
	
									}
							},'commande',global.req.moment().format('YYYYMM'));
					});
				} else {

					getinfopanier(user.id,
						function(panier){
							var cde_no= global.req.moment().format('YYMMDDHHmmss')+user.id;
							var sql="update reservations set etat=?,cde_validcode=?,cde_no=?,montant_tot_cde=? where etat=? and clientid=?;";
							var paramsql=['ACTIF','administrateur_validation',cde_no,panier.reservations.encommande.montant*100,'COMMANDE',user.id,]
							global.obj.app.db.sqltrans(sql,function(){
								var rep=JSON.stringify({});
								res.writeHead(200, 
											{'Content-Type': 'text/plain',
											 'Access-Control-Allow-Origin': '*'});
								res.end(rep);
							},paramsql)
						});

				}
				
				
				
			});
			

			break;
		case 'setparametres':
			if (userreq && userreq.type!='CLIENT' &&  userreq.type!='SERVICE'){
				if (!global.obj.parametres) global.obj.parametres={};
				for (var p in variables.data){
					global.obj.parametres[p]=variables.data[p];
				}
				//console.log('parametres',JSON.stringify(global.obj.parametres));
			}
			var sql=['delete from parametres'
			         ,'insert into parametres (jsonparam) values (\''+JSON.stringify(global.obj.parametres)+'\');'];
			global.obj.app.db.sqltrans(sql,function(){
				rep=JSON.stringify({});
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(rep);				
			});

			break;
		case 'infosparametres':
			var sql=" select t.id,t.uuid,t.nom,pt.nom parent_nom" +
					" from tag t left outer join tag pt on pt.id=t.parent_tag" +
					" where t.visible!='N' " +
					" and t.typeprog='Reservation'"
					" order by pt.nom,t.nom";
			global.obj.app.db.sqlorder(sql,
				function(rows){
				    var rep={};
					rep.parametres=global.obj.parametres;
					rep.tags=rows;
					
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));
				});
			
			break;
		case 'setuserselect':
			if (userreq && userreq.type!='CLIENT'  && userreq.type!='SERVICE'){
				setpreference(userreq,'userselect',variables.clientid);
			}
			rep=JSON.stringify({});
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;
		case 'setsalleselect':
			//if (userreq && userreq.type!='CLIENT'){
			setpreference(userreq,'salleselect',variables.salle);
			//}
			rep=JSON.stringify({});
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;
		case 'listsalle' :
			//deleteResaPaiementAttente(user,function(){
				deleteResaPaiementAttente(null,function(){});
			//});
			

			var result=[];
			
			result.push({id:'',nom:'***',type:'all',uuid:'all'});
			
			for (var t in global.obj.tags){
				if (!global.obj.tags[t].parent){
					var toptag= sallefromtag(global.obj.tags[t]);
					var childs=global.obj.tags[t].get_child();
					if(childs.length>0){
						toptag.childs=[];
						for (var ch in childs){
							var childtag=sallefromtag(childs[ch]);
							toptag.childs.push(childtag);
						}
					}
					result.push(toptag);
				}
			}
			rep=JSON.stringify(result);
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			
			break;
		case 'listcpville' :
			//listuserresa&callback=jQuery21409632077763136282_1458551945211&q=ddd&_=1458551945212
			var nbmaxenreg=15;
			if (variables.q.length>=5) nbmaxenreg=30;
			var sql="Select id,codepostal || ' ' || nom_reel label from cpville u "+
			" where upper(nom) like '%"+variables.q+"%'"+
			" or upper(nom_simple) like '%"+variables.q+"%'"+
			" or upper(codepostal) like '%"+variables.q+"%'"+
			"order by codepostal limit "+nbmaxenreg
			global.obj.app.db.sqlorder(sql,
				function(rows){
					rep=JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
				
				
			break;
		case 'getMoisDispo' :
			getMoisDispo(salleselected,user,userreq,function(result){
				rep=JSON.stringify(result);
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			})
			break;
		case 'getSemaineDispo' :
			getSemaineDispo(salleselected,user,userreq,function(result){
				rep=JSON.stringify(result);
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			})
			break;
		case 'listuserresa' :
			
			//listuserresa&callback=jQuery21409632077763136282_1458551945211&q=ddd&_=1458551945212
			var sql="Select uuid,clientid,start,end,title,etat,supprime from reservations u where supprime='N' ";
			if (userreq.type=='CLIENT'  || userreq.type=='SERVICE') {
				rep=JSON.stringify([]);
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			} else {
				sql="Select u.id,u.nom || ' '  || u.prenom value,u.nom || ' '  || u.prenom || '(' || u.ville || ') -- ' || u.type  label"+
				" from utilisateurs u"+
				" where (upper(nom) like '%"+variables.q+"%'"+
				  " or upper(prenom) like '%"+variables.q+"%'"+
				  " or upper(ville) like '%"+variables.q+"%'"+
				  " or upper(user) like '%"+variables.q+"%')"+
				  " and user!='administrateur' and user !='validpaiement' order by upper(nom),upper(prenom)";//" and type = 'CLIENT'";
				 // console.log(sql);
				global.obj.app.db.sqlorder(sql,
					function(rows){
						rep=JSON.stringify(rows);
						res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
						res.end(rep);
					});
				
				
			}
			break;
		case 'getparamscalendar':
			var params=global.obj.parametres;
			var rep={minTime:'08:00:00',maxTime:'17:00:00'};
			if (params.params_general.params_calendar_heure_deb) rep.minTime=params.params_general.params_calendar_heure_deb+':00';
			if (params.params_general.params_calendar_heure_fin) rep.maxTime=params.params_general.params_calendar_heure_fin+':00';
			
			rep=JSON.stringify(rep);
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;
		case 'eventplanning' :
			var sql="Select uuid,clientid,r.salle,start,end,title,etat,supprime,cde_no from reservations r where supprime='N' ";
			if (user.type=='CLIENT'  || user.type=='SERVICE') {
				sql +=" and clientid='"+user.id+"'";
			} else {
				sql="Select r.uuid,r.clientid,r.salle,r.start,r.end,r.title,r.etat,r.supprime,cde_no,";
				sql+=" u.user,u.codeacces,u.badge_numero,u.nom,u.prenom,u.adresse1,u.adresse2,u.codepostal,u.ville,u.pays,u.email,u.telephone,u.telephone_portable,u.fax";
				sql+=" from reservations r ,utilisateurs u"; 
				sql+=" where r.supprime='N'";
				sql+="    and r.clientid=u.id";
			}
			
			if(salleselected) {
				sql+="    and r.salle='"+salleselected+"'";
			}
			sql+=";";
			var self=this
			global.obj.app.db.sqlorder(sql,
				function(rows){
					var resultsevents=[];
					for (var r in rows){
						if (rows[r].etat=='COMMANDE') {
							rows[r].editable=true;
							var duration=global.req.moment.duration(global.req.moment(rows[r].end).diff(global.req.moment(new Date)));
							var durationmillis=duration._milliseconds;
							/*if(user.id!=rows[r].clientid){
								rows[r].color='#528f8e';
							}*/
							if (durationmillis<0) {
								rows[r].color='red';
							}
						} else if (rows[r].etat=='PAIEMENT') {
							if (userreq.type=='CLIENT' || userreq.type=='SERVICE') {
								rows[r].editable=false;
							} else {
								rows[r].editable=true;
							}
							rows[r].color='#700450'
						} else {
							if (userreq.type=='CLIENT' || userreq.type=='SERVICE') {
								rows[r].editable=false;
							} else {
								rows[r].editable=true;
							}
							rows[r].color='#a0845c'
						}
						if (rows[r].salle) {
							rows[r].salle=sallefromtag(global.obj.app.core.findobj(rows[r].salle,'tags'));
						}
						var durationresa=global.req.moment.duration(global.req.moment(rows[r].end).diff(global.req.moment(rows[r].start)));
						durationresa=durationresa._milliseconds/1000/60/60/24;
						if (durationresa>=6 && durationresa<=7){
							
							var opentimes=getOpenHour(rows[r].start,rows[r].end,rows[r].salle.id);
							//rows[r].color='yellow';
							for (var o in opentimes ){
								var newrow={};
								for (var d in rows[r]){
									newrow[d]=rows[r][d];
								}
								newrow.start=opentimes[o].start;
								newrow.end=opentimes[o].end;
								newrow.id=newrow.uuid;
								newrow.deletable=true;
								newrow.editable=false;
								resultsevents.push(newrow);
							}
						} else if (durationresa>=28 && durationresa<=32){
							var opentimes=getOpenHour(rows[r].start,rows[r].end,rows[r].salle.id);
							//rows[r].color='pink';
							for (var o in opentimes ){
								var newrow={};
								for (var d in rows[r]){
									newrow[d]=rows[r][d];
								}
								newrow.start=opentimes[o].start;
								newrow.end=opentimes[o].end;
								newrow.id=newrow.uuid;
								newrow.deletable=true;
								newrow.editable=false;
								resultsevents.push(newrow);
							}
						} else {
							resultsevents.push(rows[r]);
						}
						//rows[r].constraint='availableForMeeting';
					}
					rep=JSON.stringify(resultsevents);
					
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
	
		case 'avaibleplanning' :
			
			if (salleselected) {
				/*var repdetailcomplete=getCompleteDispo(variables.start,variables.end,
						salleselected,user.id,function(result){
					
					rep=JSON.stringify(result);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});	*/			
				var repdetailcomplete=[];
				
				var repopen=getOpenHour(variables.start,variables.end,salleselected);
				
				global.req.async.map(repopen,function(creneauopen,callbackp){
					var creneaudetail=getCompleteDispo(creneauopen.start,creneauopen.end,
							salleselected,user,userreq,function(result){
						repdetailcomplete=repdetailcomplete.concat(result);
						callbackp();
					});
					
				},
				function(err){
					rep=JSON.stringify(repdetailcomplete);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			} else {
				rep=JSON.stringify({});
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			}

			break;
		case 'businessHoursplanning' :
			var repopen=[];//getOpenHour(variables.start,variables.end,salleselected);
			var repclose=getCloseHour(variables.start,variables.end,salleselected);
			var rep=repopen.concat(repclose	);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify(rep));
	
			break;
		case 'infoUser' :
			//if (user.type!='CLIENT' && variables.clientid
			var rep={};
			rep.nom=user.nom;
			rep.id=user.id;
			rep.prenom=user.prenom;
			rep.user=user.user;
			rep.email=user.email;
			rep.codeacces=user.codeacces;
			rep.badge_numero=user.badge_numero;
			rep.badge_abonnement_date_debut=user.badge_abonnement_date_debut;
			rep.badge_abonnement_date_fin=user.badge_abonnement_date_fin;
			rep.type=user.type;
			//if (userreq.type=='CLIENT') {
				rep.afficheaide=user.afficheaide;
				if (rep.afficheaide=="")
					{
						rep.afficheaide=true;
					}
			//} else {
			//	rep.afficheaide=false;
			//}
			
			
			
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify(rep));
			break;		
		case 'infoProfil' :
			//if (user.type!='CLIENT' && variables.clientid
			var rep={};
			rep=user
			
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify(rep));
			break;
		case 'infoEvent' :
	
			getinfopanier(user.id,function(rep){
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify(rep));					
			});
	
			break;	
		case 'addEvent' :
			var ev=variables.data;
			var sql="insert into reservations (uuid,clientid,start,end,title,etat,supprime,salle) "+
			"values ('"+ev.uuid+"','"+user.id+"','"+ev.start+"','"+ev.end+"','"+ev.title+"','COMMANDE','N','"+salleselected+"');"   
			
			global.obj.app.db.sqltrans(sql,function(){
				getinfopanier(user.id,function(rep){
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));					
				});
			});
			
			break;		
		case 'updateEvent' :
			var ev=variables.data;
			var sql="update reservations set start='"+ev.start+"', end='"+ev.end+"',title='"+ev.title+"' where uuid='"+ev.uuid+"';";
			//console.log(sql);
			global.obj.app.db.sqltrans(sql,function(){
				getinfopanier(user.id,function(rep){
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));					
				});
			});
	
	
			break;
		case 'deleteEvent' :
			var ev=variables.data;
			var sql="delete from reservations where uuid='"+ev.uuid+ "';";
			global.obj.app.db.sqltrans(sql,function(){
				getinfopanier(user.id,function(rep){
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(JSON.stringify(rep));					
				});
			});
	
			break;
		default:
			res.writeHead(404, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end("");
			break;
		case 'getetat' :
			/*{"action":"getetat","updateTime":"0","v":"1.1.1"}*/
			 
			var boucle60sec = function(res,req_action){
				temps_waiting-=1;
				var result={};
				var etatchanged=false;
				result.updateTime=0;
				for (var p in global.obj.peripheriques){
					var pe={};
					var etat={};
					if (global.obj.peripheriques[p].last_etat) {
						if (global.obj.peripheriques[p].last_etat.TimeOfetat>variables.updateTime) {
							pe=JSON.parse(JSON.stringify(global.obj.peripheriques[p].last_etat));
							etat=pe;
							if (pe.expression.expr1_val || pe.expression.expr1_unit) etat.expression.expr1=pe.expression.expr1_val +" "+pe.expression.expr1_unit;
							if (pe.expression.expr2_val || pe.expression.expr2_unit) etat.expression.expr2=pe.expression.expr2_val +" "+pe.expression.expr2_unit;
							if (pe.expression.expr3_val || pe.expression.expr3_unit) etat.expression.expr3=pe.expression.expr3_val +" "+pe.expression.expr3_unit;
							result[global.obj.peripheriques[p].uuid]=etat;
							etatchanged=true;		
						}
					}

					if (global.obj.peripheriques[p].last_etat && global.obj.peripheriques[p].last_etat.TimeOfetat>result.updateTime){
						result.updateTime=global.obj.peripheriques[p].last_etat.TimeOfetat;
					}
				}
				for (p in global.obj.peripheriquesdeportes){
					var pe={};
					var etat={};
					if (global.obj.peripheriquesdeportes[p].last_etat) {
						if (global.obj.peripheriquesdeportes[p].last_etat.TimeOfetat>variables.updateTime) {
							pe=JSON.parse(JSON.stringify(global.obj.peripheriquesdeportes[p].last_etat));
							etat=pe;
							if (pe.expression.expr1_val || pe.expression.expr1_unit) etat.expression.expr1=pe.expression.expr1_val +" "+pe.expression.expr1_unit;
							if (pe.expression.expr2_val || pe.expression.expr2_unit) etat.expression.expr2=pe.expression.expr2_val +" "+pe.expression.expr2_unit;
							if (pe.expression.expr3_val || pe.expression.expr3_unit) etat.expression.expr3=pe.expression.expr3_val +" "+pe.expression.expr3_unit;
							result[global.obj.peripheriquesdeportes[p].uuid]=etat;
							etatchanged=true;		
						}
					}

					if (global.obj.peripheriquesdeportes[p].last_etat && global.obj.peripheriquesdeportes[p].last_etat.TimeOfetat>result.updateTime){
						result.updateTime=global.obj.peripheriques[p].last_etat.TimeOfetat;
					}
				}
				
				for (p in global.obj.peripheriques_chauffage){
					var pe={};
					var etat={};
					if (global.obj.peripheriques_chauffage[p] && global.obj.peripheriques_chauffage[p].last_etat) {
						if (global.obj.peripheriques_chauffage[p].last_etat.TimeOfetat>variables.updateTime) {
							pe=JSON.parse(JSON.stringify(global.obj.peripheriques_chauffage[p].last_etat));
							etat=pe;
							if (pe.expression.expr1_val || pe.expression.expr1_unit) etat.expression.expr1=pe.expression.expr1_val +" "+pe.expression.expr1_unit;
							if (pe.expression.expr2_val || pe.expression.expr2_unit) etat.expression.expr2=pe.expression.expr2_val +" "+pe.expression.expr2_unit;
							if (pe.expression.expr3_val || pe.expression.expr3_unit) etat.expression.expr3=pe.expression.expr3_val +" "+pe.expression.expr3_unit;
							result[global.obj.peripheriques_chauffage[p].uuid]=etat;
							etatchanged=true;		
						}
					}

					if (global.obj.peripheriques_chauffage[p].last_etat && global.obj.peripheriques_chauffage[p].last_etat.TimeOfetat &&  global.obj.peripheriques_chauffage[p].last_etat.TimeOfetat>result.updateTime){
						result.updateTime=global.obj.peripheriques_chauffage[p].last_etat.TimeOfetat;
					}
					
				}
				for (p in global.obj.peripheriques_batterie){
					var pe={};
					var etat={};
					if (global.obj.peripheriques_batterie[p] && global.obj.peripheriques_batterie[p].last_etat) {
						if (global.obj.peripheriques_batterie[p].last_etat.TimeOfetat>variables.updateTime) {
							pe=JSON.parse(JSON.stringify(global.obj.peripheriques_batterie[p].last_etat));
							etat=pe;
							if (pe.expression.expr1_val || pe.expression.expr1_unit) etat.expression.expr1=pe.expression.expr1_val +" "+pe.expression.expr1_unit;
							if (pe.expression.expr2_val || pe.expression.expr2_unit) etat.expression.expr2=pe.expression.expr2_val +" "+pe.expression.expr2_unit;
							if (pe.expression.expr3_val || pe.expression.expr3_unit) etat.expression.expr3=pe.expression.expr3_val +" "+pe.expression.expr3_unit;
							result[global.obj.peripheriques_batterie[p].uuid]=etat;
							etatchanged=true;		
						}
					}

					if (global.obj.peripheriques_batterie[p].last_etat && global.obj.peripheriques_batterie[p].last_etat.TimeOfetat &&  global.obj.peripheriques_batterie[p].last_etat.TimeOfetat>result.updateTime){
						result.updateTime=global.obj.peripheriques_batterie[p].last_etat.TimeOfetat;
					}
					
				}
				if ((global.req.mode.last_etat && global.req.mode.last_etat.TimeOfetat>=variables.updateTime)
						|| (global.req.type.last_etat && global.req.type.last_etat.TimeOfetat>variables.updateTime)){
						try {
							var etat=global.req.mode.last_etat;
							result['modemaj']=etat;	
							
							if (etat.expression.etat) {
								result['mode']=etat.expression.etat.nom;
							}
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
					//console.log('----> send etat '+' === ' + rep);
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.end(rep);	
					clearInterval(TimerEtat);						
				

				}

			};
			//console.log('----> client wait etat ');
			
			var temps_waiting=60*2;
			var self=this;
			var TimerEtat=setInterval(function(){
				
				boucle60sec(res,self);
				},500);
			

		
			break;	
		case 'setetat' :
			switch (variables.cmd){
				case 'ON':
					var periphe=global.obj.app.core.findinperiphs(variables.uuid);
					
					periphe.set_etat('ON',null,function(rep_box){
						
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						});
							
					break;
				case 'OFF':
				case 'STOP':
					var periphe=global.obj.app.core.findinperiphs(variables.uuid);
	
					periphe.set_etat(variables.cmd,null,function(rep_box){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						});
					break;
				case 'UP':
					var periphe=global.obj.app.core.findinperiphs(variables.uuid);
					periphe.set_etat('UP',null,function(rep_box){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						});
							
					break;
				case 'DOWN':
					var periphe=global.obj.app.core.findinperiphs(variables.uuid);
					periphe.set_etat('DOWN',null,function(rep_box){
							res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
							res.end(JSON.stringify(rep_box));
						});
					break;
				case 'DIM':
					var periphe=global.obj.app.core.findinperiphs(variables.uuid);
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
		}
}
function getMoisDispo(salleselected,user,userreq,callback){
	var sql="select datetime('now','start of month','+'||x||' month') debut,datetime('now','start of month','+'||(x+1)||' month') fin "+
		"from (select 1 x ";
	for (var m=2;m<=12;m++){
		sql+= " union all select "+m+" x ";
	}
	sql+=")";
	//console.log(sql);
	var res=[];
	
	global.obj.app.db.sqlorder(sql,
		function(rows){
			global.req.async.eachSeries(rows, function(row,callbackDone){
				getCompleteDispo(row.debut,row.fin,salleselected,/*user*/undefined,userreq,
					function(result,vstarttime,vendtime){
						var dispo=true;
						var minreste=999999;
						for (r in result){
							var resa=result[r];
							if (resa.reste<minreste){
								minreste=resa.reste;
							}
							if (!resa.reste || resa.reste<=0){
								dispo=false;
							}
						}		
						var objmois={start:vstarttime,end:vendtime,salle:salleselected};
						if (dispo){
							objmois.title=minreste+'  (Dispo)';
							objmois.descriptif='Mois '+global.req.moment(vstarttime).format('MM/YYYY');
							objmois.editable=false;
							objmois.color = 'green';
							objmois.reste=minreste;
						} else {
							objmois.title='Complet';
							objmois.descriptif='Mois '+global.req.moment(vstarttime).format('MM/YYYY');
							objmois.editable=false;
							objmois.color = 'red';
							objmois.reste=0;
						}
						if (objmois.salle) {
							objmois.salle=sallefromtag(global.obj.app.core.findobj(objmois.salle,'tags'));
						}
						res.push(objmois);
						//console.log(JSON.stringify(objmois));
						callbackDone();
				});
			}, 
			function (err) {
				callback(res);
			});

	});
}
function getSemaineDispo(salleselected,user,userreq,callback){
	var sql="select datetime('now','weekday 1','+'||(x*7)||' days','start of day') debut,"+
				   "datetime('now','+'||((x+1)*7)||' days','weekday 1','start of day') fin "+
	"from (select 0 x ";
for (var s=1;s<=52;s++){
	sql+= " union all select "+s+" x ";
}
sql+=")";
//console.log(sql);
var res=[];

global.obj.app.db.sqlorder(sql,
	function(rows){
		global.req.async.eachSeries(rows, function(row,callbackDone){
			getCompleteDispo(row.debut,row.fin,salleselected,/*user*/undefined,userreq,
				function(result,vstarttime,vendtime){
					var dispo=true;
					var minreste=999999;
					for (r in result){
						var resa=result[r];
						if (resa.reste<minreste){
							minreste=resa.reste;
						}
						if (!resa.reste || resa.reste<=0){
							dispo=false;
						}
					}		
					var objmois={start:vstarttime,end:vendtime,salle:salleselected};
					if (dispo){
						objmois.title=minreste+'  (Dispo)';
						objmois.descriptif='Semaine du '+global.req.moment(vstarttime).format('DD/MM')+' au '+global.req.moment(vendtime).format('DD/MM');
						objmois.editable=false;
						objmois.color = 'green';
						objmois.reste=minreste;
					} else {
						objmois.title='Complet';
						objmois.descriptif='Semaine du '+global.req.moment(vstarttime).format('DD/MM')+' au '+global.req.moment(vendtime).format('DD/MM');
						objmois.editable=false;
						objmois.color = 'red';
						objmois.reste=0;
					}
					if (objmois.salle) {
						objmois.salle=sallefromtag(global.obj.app.core.findobj(objmois.salle,'tags'));
					}
					res.push(objmois);
					//console.log(JSON.stringify(objmois));
					callbackDone();
			});
		}, 
		function (err) {
			callback(res);
		});

});
}
function getCompleteDispo(vstarttime,vendtime,salleselected,user,userreq,callback){

	var params=global.obj.parametres;
	var nbplace=params['params_'+salleselected].params_nbplaces;
	if (!user) {
		user={id:-1};
	}
	var sql="with resa as (select r.*,"+nbplace+" nbplaces " +
			" , case when (select max(1) from tag t where t.parent_tag="+salleselected+" and t.id=r.salle)=1 then 100 else 1 end coef_enfant " +
			" , case when (select max(1) from tag t where t.id="+salleselected+" and t.parent_tag=r.salle)=1 then 100 else 1 end coef_parent " +
			"from reservations r where clientid!='"+user.id+"'"; 
	sql+="				 	and (datetime(start)>=datetime('"+vstarttime+"')";
	sql+="				      or datetime(end)>=datetime('"+vstarttime+"'))";
	sql+="				 	and (datetime(start)<=datetime('"+vendtime+"')";
	sql+="				      or datetime(end)<=datetime('"+vendtime+"'))";
	sql+="                  and (salle='"+salleselected+"' or exists (select 1 from tag t where t.parent_tag='"+salleselected+"' and t.id=r.salle) or exists (select 1 from tag t where t.id='"+salleselected+"' and t.parent_tag=r.salle))	";
	sql+="				  	and (etat='ACTIF' or etat='PAIEMENT'))";
	sql+=" , 	  startend as ( select salle,'start' type,1*coef_enfant*coef_parent val,start dat,id,nbplaces from resa";
	sql+=" 						union all";
	sql+=" 						select "+salleselected+" salle,'start' type,0 val,'"+vstarttime+"' dat,0 id,"+nbplace+" nbplaces";
	sql+=" 						union all";
	sql+=" 						select "+salleselected+" salle,'end' type,0 val,'"+vendtime+"' dat,0 id,"+nbplace+" nbplaces";
	sql+=" 						union all";
	sql+=" 					 	select salle,'end' type,-1*coef_enfant*coef_parent val,end dat,id,nbplaces from resa )";
			 
	sql+=" select '"+salleselected+"' salle,type,val,dat,sum(cumul) cumul,nbplaces,case when nbplaces-sum(cumul)>=0 then nbplaces-sum(cumul) else 0 end reste";
	sql+=" from (";					 

	sql+=" 	select a.salle,a.type,a.val,a.dat,a.id,b.val cumul ,a.nbplaces";
	sql+=" 	from startend a,startend b";
	sql+=" 	where datetime(a.dat)>=datetime(b.dat)";
	sql+=" 	and a.salle=b.salle"; 

	sql+=" )";
	sql+=" group by salle,type,val,dat,nbplaces";
	sql+=" order by salle,datetime(dat)";	
	//console.log(vstarttime,vendtime,salleselected,user.id,sql);
		var self=this
		global.obj.app.db.sqlorder(sql,
			function(rows){
				var result=[];
				var bloquetime;
				var creneautime;
				var oktime=true;
				var params=global.obj.parametres;
				var lasttimeline='';
				
				for (var r in rows){
					//console.log(JSON.stringify(rows[r]));
					var nbreResaMaxSimultanee=1;
					if(rows[r].salle && params['params_'+rows[r].salle] && params['params_'+rows[r].salle].params_nbplaces!=""){
						nbreResaMaxSimultanee=params['params_'+rows[r].salle].params_nbplaces;
					}
					if (lasttimeline!=rows[r].dat ){

							if (creneautime && global.req.moment(vendtime)>global.req.moment(rows[r].dat) &&
									global.req.moment(vstarttime)<=global.req.moment(rows[r].dat)) {
								creneautime.end=rows[r].dat;
								result.push(creneautime);
							}
							if (global.req.moment(vendtime)>global.req.moment(rows[r].dat) &&
									global.req.moment(vstarttime)<=global.req.moment(rows[r].dat)){
								if (rows[r].reste>0){
									creneautime={
										title:rows[r].reste+'  (Dispo)',
										start: rows[r].dat,
										editable:false,
										//end: '2016-03-17T16:00:00',
										color : 'green',
										/*id: 'availableForMeeting',
										rendering: 'background',*/
										reste:rows[r].reste
									};										
								} else {
									creneautime={
										title:'Complet',
										start: rows[r].dat,
										editable:false,
										//end: '2016-03-17T16:00:00',
										color : 'red',
										reste:0
									};
								}
			
								if (rows[r].salle) {
									creneautime.salle=sallefromtag(global.obj.app.core.findobj(rows[r].salle,'tags'));
								}
							}
				
							lasttimeline=rows[r].dat;
						

					}

				}
				if (creneautime && !creneautime.end  ) {
					creneautime.end=vendtime;
					result.push(creneautime);
				}
				
				for (var c in result){
					//if (userreq.type=='CLIENT') {
						result[c].id= 'availableForMeeting';
						result[c].rendering= 'background';
						//result[c].color = 'red';
					//} 
				}
				callback(result,vstarttime,vendtime);
			});
}

function deleteResaPaiementAttente(user,callback){
	var sql;
	
	if (user && user.id){
		sql="update reservations  set etat='CLOS', supprime='O' where clientid='"+user.id+"' and etat='PAIEMENT';";
		//console.log(sql);
	} else {
		
		var actualtime=global.req.moment.utc(new Date);//.toISOString();
		actualtime=actualtime.add(-global.req.moment.timeZoneOffset,'minutes');
		
		var maxtimeretourpaiemnt=parseFloat(global.obj.parametres.params_general.params_tpsmaxtipivld);
		
		if (!maxtimeretourpaiemnt || maxtimeretourpaiemnt=="" || maxtimeretourpaiemnt<=0 ) {
			maxtimeretourpaiemnt=parseFloat(30);
		}
		actualtime.add(-maxtimeretourpaiemnt,'minutes');
		sql="update reservations  set etat='CLOS', supprime='O' where datetime(cde_dat)<=datetime('"+actualtime.toISOString()+"') and etat='PAIEMENT';";
		//console.log(sql);
	}
	global.obj.app.db.sqltrans(sql,callback);
	
}

function getOpenHour(vstart,vend,salleselected){
	var params=global.obj.parametres;
	var rep=[];
	//console.log('requete','start',variables.start,'end',variables.end,variables._);
	var horaires=[];
	if (salleselected && params['params_'+salleselected]) {
		horaires=params['params_'+salleselected].params_dispolist;
	}
	var selfirstday=global.req.moment(vstart, "YYYY-MM-DD");
	var sellastday=global.req.moment(vend, "YYYY-MM-DD");
	var controlday=global.req.moment(vstart, "YYYY-MM-DD");
	while (controlday<sellastday){
		var daynum=controlday.day();
		//console.log(daynum);

		var horairesforthisday=[];
		
		for (var dh in horaires){					
			var horaire={start:global.req.moment("01/01/1970 "+horaires[dh].start,"DD/MM/YYYY HH:mm"),
					end:global.req.moment("01/01/1970 "+horaires[dh].end,"DD/MM/YYYY HH:mm"),
					dow:horaires[dh].dow}
			for (var d in horaire.dow){
				if (""+horaire.dow[d]==daynum){
					horairesforthisday.push(horaire);
				}
			}
		}
		
		function comparehoraire(a,b) {
			  if (a.start < b.start)
			    return -1;
			  else if (a.start > b.start)
			    return 1;
			  else 
			    return 0;
		}
		horairesforthisday.sort(comparehoraire);
		
		for (var h in horairesforthisday){
			var opentime={
			        start: controlday.format("YYYY-MM-DD")+"T"+horairesforthisday[h].start.format('HH:mm:ss'),
			        end: controlday.format("YYYY-MM-DD")+"T"+horairesforthisday[h].end.format('HH:mm:ss'),
			        color: 'green',
			        rendering: 'background'
			    }
			rep.push(opentime);
			
		}
		controlday=controlday.add(1, 'days');
	}
	return rep;
	
}


function getCloseHour(vstart,vend,salleselected){
	var params=global.obj.parametres;
	var rep=[    
			{
				start: '1970-01-01T00:00:00',
				end: global.req.moment(new Date).toISOString(),
				rendering: 'background',
				color: 'gray'
			}];
	//console.log('requete','start',variables.start,'end',variables.end,variables._);
	var horaires=[];
	if (salleselected && params['params_'+salleselected]) {
		horaires=params['params_'+salleselected].params_dispolist;
	}
	var selfirstday=global.req.moment(vstart, "YYYY-MM-DD");
	var sellastday=global.req.moment(vend, "YYYY-MM-DD");
	var controlday=global.req.moment(vstart, "YYYY-MM-DD");
	while (controlday<sellastday){
		var daynum=controlday.day();
		//console.log(daynum);

		var horairesforthisday=[];
		
		for (var dh in horaires){					
			var horaire={start:global.req.moment("01/01/1970 "+horaires[dh].start,"DD/MM/YYYY HH:mm"),
					end:global.req.moment("01/01/1970 "+horaires[dh].end,"DD/MM/YYYY HH:mm"),
					dow:horaires[dh].dow}
			for (var d in horaire.dow){
				if (""+horaire.dow[d]==daynum){
					horairesforthisday.push(horaire);
				}
			}
		}
		
		function comparehoraire(a,b) {
			  if (a.start < b.start)
			    return -1;
			  else if (a.start > b.start)
			    return 1;
			  else 
			    return 0;
		}
		horairesforthisday.sort(comparehoraire);

		var nbopenperiode=0;
		
		var time=global.req.moment("01/01/1970 00:00:00","DD/MM/YYYY HH:mm:ss");
		for (var h in horairesforthisday){
			if (time<horairesforthisday[h].start) {
				var closetime={
				        start: time.format('HH:mm:ssZ'),
				        end: horairesforthisday[h].start.format('HH:mm:ssZ'),
				        color: 'gray',
				        rendering: 'background',
				        dow: [daynum]
				    }
				rep.push(closetime);
			}
			if(horairesforthisday[h].end>time){
				time=horairesforthisday[h].end;
			}
		}
		var timelast=global.req.moment("01/01/1970 23:59:00","DD/MM/YYYY HH:mm:ss");
		if (timelast>time){
			var closetime={
			        start: time.format('HH:mm:ssZ'),
			        end: timelast.format('HH:mm:ssZ'),
			        color: 'gray',
			        rendering: 'background',
			        dow: [daynum]
			    }
			rep.push(closetime);
		}
		
		controlday=controlday.add(1, 'days');
	}
	return rep;
	
}
function getinfopanier(clientid,callback){
	var sql='Select r.start,r.end,r.salle, case when date(u.badge_abonnement_date_fin)>=date(r.end) then 0 else 1 end payant'+
		' from reservations r inner join utilisateurs u on u.id=r.clientid'+
		' where r.etat="COMMANDE" and r.supprime="N" '+
		'  and clientid="'+clientid+'" '+
		' order by r.salle,r.start;';
	
	var self=this
			
	global.obj.app.db.sqlorder(sql,
		function(rows){
			var counter_nb=0;
			var counter_invalid_nb=0;
			var counter_time=0;
			var counter_time_free=0;
			var counter_time_total=0;
			var counter_forfaitweek=0;
			var counter_forfaitweek_free=0;
			var counter_forfaitmonth=0;
			var counter_forfaitmonth_free=0;
			var counter_mt=0;
			var params=global.obj.parametres;
			var salle_courante=-1;
			var salles=[];
			var salle;
			for (var r=0;r<rows.length+1;r++){

				if (!rows[r] || (rows[r].salle && rows[r].salle!=salle_courante)){
					
					if (salle){
						salle.nombre=counter_nb;
						salle.invalidpastdate=counter_invalid_nb;
						salle.temps=counter_time;
						salle.temps_abonnement=counter_time_free;
						salle.temps_total=counter_time_total;
						salle.devise="€";
						var calculmt=findbesttariflot(salle.temps,params['params_'+salle.id].params_tariflist);
						//salle.prixU=findbesttariflot(salle.temps,params['params_'+salle.id].params_tariflist);
						//salle.montant=Number((salle.temps*salle.prixU).toFixed(4));
						salle.montant=calculmt.montantTot;
						
						salle.prixU=Number((calculmt.montantTot/salle.temps).toFixed(4));
						
						if (counter_forfaitweek>0 && params['params_'+salle.id].params_forfaitsemaine) {
							salle.montant+=Number(params['params_'+salle.id].params_forfaitsemaine).toFixed(2)*counter_forfaitweek;
						}
						if (counter_forfaitmonth>0 && params['params_'+salle.id].params_forfaitmois) {
							salle.montant+=Number(params['params_'+salle.id].params_forfaitmois).toFixed(2)*counter_forfaitmonth;
						}
						/*if (params['params_'+salle.id].params_minfactresa){
							var montantminresa=parseFloat(salle.nombre*params['params_'+salle.id].params_minfactresa);
							if(montantminresa>salle.montant){
								salle.montant=montantminresa;
							}
						}
						if (params['params_'+salle.id].params_minfactcde){
							var montantmincde=parseFloat(params['params_'+salle.id].params_minfactcde);
							if(montantmincde>salle.montant){
								salle.montant=montantmincde;
							}
						}*/
						salles.push(salle);
					}
					if (rows[r]){
						salle_courante=rows[r].salle;
						salle=sallefromtag(global.obj.app.core.findobj(rows[r].salle,'tags'));
					}
					counter_nb=0;
					counter_invalid_nb=0;
					counter_time=0;
					counter_time_free=0;
					counter_time_total=0;
					counter_forfaitweek=0;
					counter_forfaitweek_free=0;
					counter_forfaitmonth=0;
					counter_forfaitmonth_free=0;
				}
				if (rows[r]) {
					counter_nb++;
					var durationresa=global.req.moment.duration(global.req.moment(rows[r].end).diff(global.req.moment(rows[r].start)));
					durationresa=durationresa._milliseconds/1000/60/60/24;
					

					
					if (durationresa>=6 && durationresa<=8){
						/*resa semaine*/
						if(rows[r].payant==1){
							counter_forfaitweek+=1;
						} else {
							counter_forfaitweek_free+=1;
						}
						
					} else if (durationresa>=28 && durationresa<=32){
						/*resa mois*/
						if(rows[r].payant==1){
							counter_forfaitmonth+=1;
						} else {
							counter_forfaitmonth_free+=1;
						}
					} else {
						/*resa horaire*/
						var duration=global.req.moment.duration(global.req.moment(rows[r].end).diff(global.req.moment(rows[r].start)));
						var durationminutes=duration._milliseconds/1000/60;
						if(rows[r].payant==1){
							counter_time+=durationminutes/60;
						} else {
							counter_time_free+=durationminutes/60;
						}
						counter_time_total+=durationminutes/60;
						
						var durationj=global.req.moment.duration(global.req.moment(rows[r].end).diff(global.req.moment(new Date)));
						var durationmillis=durationj._milliseconds;
						if (durationmillis<0) {
							counter_invalid_nb++;
						}
					}
					if ((durationresa>=6 && durationresa<=7) || (durationresa>=28 && durationresa<=32)){
						
						var opentimes=getOpenHour(rows[r].start,rows[r].end,salle.id);
						//rows[r].color='yellow';
						var durationcumulopen=0;
						for (var o in opentimes ){
							durationresa=global.req.moment.duration(global.req.moment(opentimes[o].end).diff(opentimes[o].start));
							durationcumulopen+=durationresa._milliseconds/1000/60;
						}
						var durationminutes=durationcumulopen;
						counter_time_total+=durationminutes/60;
					}
				}
			}
			var rep={
					reservations:{encommande:{	nombre:0,
												invalidpastdate:0,
												temps:0,
												temps_abonnement:0,
												temps_total:0,
												montant:0,
												prixU:0,
												devise:"€"}
									}
				};
			for(var s in salles){
				rep.reservations.encommande.nombre+=salles[s].nombre;
				rep.reservations.encommande.invalidpastdate+=salles[s].invalidpastdate;
				rep.reservations.encommande.temps+=salles[s].temps;
				rep.reservations.encommande.temps_abonnement+=salles[s].temps_abonnement;
				rep.reservations.encommande.temps_total+=salles[s].temps_total;
				rep.reservations.encommande.montant+=salles[s].montant;
			}
			rep.reservations.encommande.prixU=Number((rep.reservations.encommande.montant/rep.reservations.encommande.temps).toFixed(4));
			

			rep.reservations.encommande.montant=Number((rep.reservations.encommande.montant).toFixed(2));
			rep.reservations.encommande.salles=salles;
			callback(rep);
		});
}

function findbesttariftranche(timeheure,tariflist){
	var tranche=-1;
	var index_besttarif;
	if (tariflist) {
		for (var t in tariflist){
			if(parseFloat(tariflist[t].tranche)>tranche &&
					parseFloat(tariflist[t].tranche)<=timeheure){
				index_besttarif=t;
				tranche=parseFloat(tariflist[t].tranche);
			}
		}
	}
	if (index_besttarif) {
		return parseFloat(tariflist[index_besttarif].tarif);
	}
	return 0;
}
function findbesttariflot(timeheure,tariflist){
	/*":[{"typeparams":" +
			""params_tariflist","idparams":5,
			"tranche":"0","tarif":"2",
			"text":"2 Euros Ã  partir de 0 Heures","id":"params_tarif"}]*/
	
	var nbheure_rest=timeheure;
	var montant={detail:[],montantTot:0,nbheure:nbheure_rest};

	if (tariflist) {
		while (nbheure_rest>0) {
			var indexbesttariflot=-1;
			var maxqteheurelot=0;
			var besttariflot=0;
			/*recherche qte lot inferieure optimum pour aplquer le meilleure tarif par lot*/
			for (t in tariflist){
				if (nbheure_rest>=parseFloat(tariflist[t].uniteheures) && 
						parseFloat(tariflist[t].uniteheures)>maxqteheurelot){
					maxqteheurelot=parseFloat(tariflist[t].uniteheures);
					indexbesttariflot=t;
					besttariflot=parseFloat(tariflist[t].tarif);
				}
			}
			if(indexbesttariflot>=0) {
				var objfact={lottarifde:maxqteheurelot,tarif:besttariflot};
				objfact.nbforfaitlot=Math.floor(nbheure_rest/maxqteheurelot);
				objfact.montant=objfact.nbforfaitlot*objfact.tarif;
				montant.montantTot+=objfact.montant;
				montant.detail.push(objfact);
				nbheure_rest-=objfact.nbforfaitlot*maxqteheurelot;				
			}

			
			if(indexbesttariflot==-1){
				/*reste quelques heures a facturer par le tarif lot le plus petit*/
				var indexlesstariflot=-1;
				var minqteheurelot=9999999999999;
				var lesstariflot=0;
				/*recherche qte lot inferieure optimum pour aplquer le meilleure tarif par lot*/
				for (t in tariflist){
					if (nbheure_rest<=parseFloat(tariflist[t].uniteheures) && 
							parseFloat(tariflist[t].uniteheures)<minqteheurelot){
						minqteheurelot=parseFloat(tariflist[t].uniteheures);
						indexlesstariflot=t;
						lesstariflot=parseFloat(tariflist[t].tarif);
					}
				}
				if(indexlesstariflot>=0) {
					objfact={lottarifde:minqteheurelot,tarif:lesstariflot};
					objfact.nbforfaitlot=1;
					objfact.montant=objfact.nbforfaitlot*objfact.tarif;
					montant.montantTot+=objfact.montant;
					montant.detail.push(objfact);
				}
				nbheure_rest=0;		
			}
			
		}
		
	} 
	return montant;	
}

