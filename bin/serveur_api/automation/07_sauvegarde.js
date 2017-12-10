/**
 * Sauvegarde de la base de donnée
 */

var dir =__dirname+'/../../DumpDb';

var sauvegarde={id:7,nom:"sauvegarde",etat:"OFF",lastrun:null};
var timer=null;


sauvegarde.start=function(){
	if (sauvegarde.etat=='OFF') {
		sauvegarde.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		//obj.app.serveur.on('core_charge_all',run_update_etat);
		//obj.app.serveur.on('box.update_etat_box',actions_on_event1);
		//obj.app.serveur.on('box.update_etat_boxs',actions_on_event2);
		
		/*Execution toutes les jours soit 86 400 secondes*/
		/*timer=setInterval(function(){
				run_save();
			}, 86400000);*/
		
		run_save();	
		sauvegarde.etat='OFF';
	}
}

sauvegarde.stop=function(){
	if (sauvegarde.etat=='ON') {
		sauvegarde.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		//obj.app.serveur.removeListener('core_charge_all',actions_on_event1);
		//obj.app.serveur.removeListener('box.update_etat_box',actions_on_event1);
		//obj.app.serveur.removeListener('box.update_etat_boxs',actions_on_event2);
		clearInterval(timer);
	}

}
var run_save = function(){
	global.req.async.series([
		function (callback){
		    	//vérification espace libre
		    	if (!global.req.fs.exists(dir)){
					global.req.fs.mkdir(dir);
				}
				callback();
		    },
		function (callback){
			var Datefile = global.req.moment().format('YYYY-MM-DD');
			// selection des noms des tables de la base de données
			global.obj.app.db.sqlorder("select name from sqlite_master where type='table'",
				function(tablesdb){
					for (var e in tablesdb) {
						if (tablesdb[e].name == 'historique'){
							logger('DEBUG',{msg:"Pas de sauvegarde de la table histo"},'automation_'+sauvegarde.nom);						
						}else{
							logger('DEBUG',{msg:"requête : select * from "+tablesdb[e].name},'automation_'+sauvegarde.nom);
							global.obj.app.db.sqlorder("select * from "+tablesdb[e].name,
							function(rows){
								for (var l in rows) {
									logger('DEBUG',{msg:'données '+rows[l]},'automation_'+sauvegarde.nom);
									var lig = rows[l];
									var ligne="";
									for (var prop in lig) {
									  ligne+=lig[prop]+";";
									}
									global.req.fs.appendFile(dir+"/"+Datefile+"/"+tablesdb[e].name+".csv",ligne + "\n");
								}							
								//sauvergarde terminée	
							}								
							);
						}	
					}
					logger('DEBUG',{msg:'fin de sauvegarde'},'automation_'+sauvegarde.nom);
					callback();
				});
			},
		function (callback){
			//début zip
			var exec = spawn=global.req.child_process.exec;

			if (process.platform=='linux'){
				exec('zip -r '+ dir+"/"+Datefile+'.zip '+ dir+"/"+Datefile+"/", function(error, stdout, stderr) {
					logger('DEBUG',{msg:"Zip du dossier"+dir+"/"+Datefile,erreur:error+', ' +stdout+', '+ stderr},'automation_'+sauvegarde.nom);	
					//fin du zip
					callback();					
				});										
			}
		},
		function (callback){
			//début zip
			var exec = spawn=global.req.child_process.exec;

			if (process.platform=='linux'){
				exec('rm -r '+ dir+"/"+Datefile, function(error, stdout, stderr) {
					logger('DEBUG',{msg:"suppression du dossier"+dir+"/"+Datefile,erreur:error+', ' +stdout+', '+ stderr},'automation_'+sauvegarde.nom);
					// fin de suppression du dossier
					callback();		
				});								
			}
		}
			],function (errsystem,results_erreur){
							  	 
		  });
}


module.exports = sauvegarde;