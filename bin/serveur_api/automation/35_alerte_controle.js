/**
 * New node file
 */
var alerte_controle={id:35,nom:"alerte_controle",etat:"OFF",lastrun:null};
var timer=null;
var timer2=null;

alerte_controle.start=function(){
	if (alerte_controle.etat=='OFF') {
		alerte_controle.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		//obj.app.serveur.on('peripherique.last_etat.added',controleifalerte);
		obj.app.serveur.on('peripherique.last_etat.changed',controleifalerte);
		
		obj.app.serveur.on('applipiscine.acquitementrecu',function(){
			setTimeout(function(){
				controleglobal();
			},5000);
		});
		
		timer=setInterval(function(){
			/*controle toutes les 1,5 minutes*/
			controleglobal();	
		}, 90000);
		
		timer2=setTimeout(function(){
			/*purge au démarrage de l'automation*/
			controleglobal();
		},30000);
	}
}
alerte_controle.stop=function(){
	if (alerte_controle.etat=='ON') {
		alerte_controle.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');

		//obj.app.serveur.removeListener('peripherique.last_etat.added',controleifalerte);
		obj.app.serveur.removeListener('peripherique.last_etat.changed',controleifalerte);
		clearInterval(timer);
	}
}


function controleifalerte(periph,previous_etat,new_etat_expressions){
	if (periph.categorie && periph.categorie.type=='alerte') {
		//console.log(periph.nom,new_etat_expressions.etat);
		if (new_etat_expressions.etat==periph.ecriture_max_value) {
			insertAlerte_ifnotexists(periph,1);
		} else if (new_etat_expressions.etat==periph.ecriture_min_value) {
			insertAlerte_ifnotexists(periph,0);
		}
		
	}
}

function controleglobal(){
	logger('INFO',{msg:'--Controle globale des alertes--'},'automation_'+alerte_controle.nom);
	for (var p in global.obj.peripheriques) {
		var periph=global.obj.peripheriques[p];
		if (periph.categorie && periph.categorie.type=='alerte') {
			if (periph.last_etat && periph.last_etat.expression && periph.last_etat.expression.etat &&
					periph.last_etat.expression.etat==periph.ecriture_max_value){
				//console.log(periph.nom,periph.last_etat.expression.etat);
				insertAlerte_ifnotexists(periph,1,true);
			}
			
		}
	}
	
	var sql2=["insert into alerte_historique select * from alerte where date_acquitement is not null",
	          "delete from alerte  where date_acquitement is not null"];
	global.obj.app.db.sqltrans(sql2,function(e){});

}

function insertAlerte_ifnotexists(periph,new_etat,ifnotexists){
	/*
	 * 						             {"name" : "etat" , "type" : "TEXT"},
						             {"name" : "date_alerte" , "type" : "TEXT"},
						             {"name" : "date_acquitement" , "type" : "TEXT"},
						             {"name" : "libelle" , "type" : "TEXT"},
						             {"name" : "commentaire" , "type" : "TEXT"},
						             {"name" : "uuid_peripherique" , "type" : "TEXT"},
						             {"name" : "uuid" , "type" : "TEXT"},
	 */
	//console.log('insert alerte',periph.nom,new_etat);
	var sql="insert into alerte  (uuid_peripherique,uuid,libelle,date_alerte,etat,timestamp_modif) ";
		sql+=" select ?,?,?,?,?,? ";
	if(ifnotexists) {
		sql+=" where not exists (select 1 from alerte aa where aa.uuid_peripherique=? and aa.date_acquitement is null and etat=?)";			
	}

	
	var timestamp_str=req.moment().format('YYYY-MM-DD HH:mm:ss');
	var timestamp=new Date().getTime();	
	
	var alerte_uuid=generateUUID();
	
	var sql_bind=[periph.uuid,alerte_uuid,periph.nom,timestamp_str,new_etat,timestamp/*,periph.uuid,new_etat*/];
	if(ifnotexists) {
		sql_bind=[periph.uuid,alerte_uuid,periph.nom,timestamp_str,new_etat,timestamp,periph.uuid,new_etat];			
	}
	
	global.obj.app.db.sqltrans(sql,function(e){
		
		/*via le champ ajustement permet de traiter automatiquement les alertes qui clignote sur un laps de temps*/
		var sql2="update alerte  set date_acquitement=?, commentaire='auto_suppr',timestamp_modif=?";
		sql2+=" where exists (select 1 from alerte aa  inner join peripherique p on p.uuid=aa.uuid_peripherique";
		sql2+="              where aa.date_acquitement is null";
		sql2+="				   and aa.uuid_peripherique=alerte.uuid_peripherique";
		sql2+="				   and aa.etat!=alerte.etat";
		sql2+="					and aa.timestamp_modif>=alerte.timestamp_modif-(p.ajustement+0)*1000";
		sql2+="					and aa.timestamp_modif<=alerte.timestamp_modif+(p.ajustement+0)*1000";
		sql2+="					and aa.id!=alerte.id)";
		sql2+="    and alerte.date_acquitement is null";
		var timestamp_str2=req.moment().format('YYYY-MM-DD HH:mm:ss');
		var timestamp2=new Date().getTime();
		var sql_bind2=[timestamp_str2,timestamp2];
		global.obj.app.db.sqltrans(sql2,function(e){
		},sql_bind2);
	
	},sql_bind);
}


module.exports = alerte_controle;