/**
 * automation de surveillance
 */
var surveillance={id:6,nom:"surveillance",etat:"OFF",lastrun:null};
var timer=null;
//var infos={};


surveillance.start=function(){
	if (surveillance.etat=='OFF') {
		surveillance.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		//obj.app.serveur.on('core_charge_all',run_update_etat);
		//obj.app.serveur.on('box.update_etat_box',actions_on_event1);
		//obj.app.serveur.on('box.update_etat_boxs',actions_on_event2);
		
		/*Execution toutes les jours soit 86 400 secondes*/
		timer=setInterval(function(){
				run_surveillance();
			}, 86400000);
		
		run_surveillance();	
	}
}

surveillance.stop=function(){
	if (surveillance.etat=='ON') {
		surveillance.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		//obj.app.serveur.removeListener('core_charge_all',actions_on_event1);
		//obj.app.serveur.removeListener('box.update_etat_box',actions_on_event1);
		//obj.app.serveur.removeListener('box.update_etat_boxs',actions_on_event2);
		clearInterval(timer);
	}

}
var run_surveillance = function(){
		 surveillance.lastrun={};
		global.req.async.series([
		    function (callback){
		    	//vérification espace libre
		    	 espace_libre(function (espace_disk_responce){
		    	 	  if(espace_disk_responce){
						 
						 surveillance.lastrun.espace_disk=espace_disk_responce;
		    	 	  	logger('DEBUG',{msg:'espace disque libre: '+espace_disk_responce.available},'automation_'+surveillance.nom);
		    	 	  	if(espace_disk_responce.available < 100000){
									var erreur = "Problème d'espace disque, reste "+espace_disk_responce.available+" octets de libre.\n" ;
									callback(null,erreur);
								} else {
								  callback();
								}
		    	 	  } else {
		    	 	  	callback(null,"Espace disk retourné = vide");
		    	 	  }
		    	 });
		    },
		    
		    function (callback){
		    	//Vérification du code unique des automations	
						
						var sql="select nom, count(*) as nb from automation_etat group by nom"
						global.obj.app.db.sqlorder(sql,
								function(rows){				
									logger('DEBUG',{msg:'requete: '+sql,reponse:rows },'automation_'+surveillance.nom);
									if (rows[0]) {	
										var arrayerreur=[];
										for (var l in rows){
												logger('DEBUG',{msg:'reponse '+l,reponse:rows[l] },'automation_'+surveillance.nom);
											
											if((rows[l].nb*1)>1){
												logger('ERROR',{msg:'reponse en erreur '+l,reponse:rows[l] },'automation_'+surveillance.nom);
												arrayerreur.push("Problème avec l'automation: "+ rows[l].nom+", "+rows[l].nb+" répétitions.\n");
												
											} 
										}
                                        if (arrayerreur[0]) {
                                            callback(null,arrayerreur);
                                        } else {
                                            callback();
                                        }
									} else {
										callback();
									}					
											
								});
		    },
		    function(callback){
		    		//Vérification du code unique des constantes	

						var sql="select code, count(*) as nb from constantes group by code"
						global.obj.app.db.sqlorder(sql,
								function(rows){				
									logger('DEBUG',{msg:'requete: '+sql,reponse:rows },'automation_'+surveillance.nom);
									if (rows[0]) {	
										var arrayerreur=[];
										for (var l in rows){
											logger('DEBUG',{msg:'reponse '+l,reponse:rows[l] },'automation_'+surveillance.nom);
											
											if((rows[l].nb*1)>1){							
												logger('ERROR',{msg:'reponse en erreur '+l,reponse:rows[l] },'automation_'+surveillance.nom);
												arrayerreur.push("Problème avec la constante: "+ rows[l].code+", "+rows[l].nb+" répétitions.\n");
											}
										}
										if (arrayerreur[0]) {
                                            callback(null,arrayerreur);
										} else {
                                            callback();
										}

									}	else {
										callback();
									}				
											
								});
		    }
		  ],function (errsystem,results_erreur){
		  	
		  		//envoi d'un mail avec les erreurs
					logger('DEBUG',{msg:'Erreurs du système: ',erreurs:results_erreur},'automation_'+surveillance.nom);
					if (results_erreur && results_erreur.length>0){
						surveillance.lastrun.ERROR=results_erreur;
						logger('DEBUG',{destinataires:'1_envoi mail sur  '+global.obj.app.core.findobj('emailsupport','constantes').valeur, msg:results_erreur.join("\n") },'automation_'+surveillance.nom);
						
						var smssender=new global.req.comm_with_mail(global.obj.app.core.findobj('emailsupport','constantes').valeur,results_erreur.join("\n"),global.obj.app.core.findobj('idapplication','constantes').valeur + '@inspirelec.com','** Surveillance **');
						logger('DEBUG',{destinataires:'2_envoi mail sur  '+smssender.to, msg:results_erreur.join("\n") },'automation_'+surveillance.nom);
						smssender.sendmailbyhttp(function(err,body){
							logger('INFO',{msg:'retour envoi mail',body:body },'automation_'+surveillance.nom);
							
						});		
						
						logger('INFO',{msg:'3_envoi mail sur  '+global.obj.app.core.findobj('emailsupport','constantes').valeur, msg:results_erreur.join("\n") },'automation_'+surveillance.nom);
						
					}
					
					surveillance.lastrun=JSON.stringify(surveillance.lastrun);
		  	 
		  });
		    
		

		


//////	

}

function parseRow(row) {
		var reCaptureCellsLinux = /^([^\s]+\s?[^\s]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)%\s+[^/]*(.*?)\s*$/;
		logger('DEBUG',{msg:'ligne de la réponse '+row},'automation_'+surveillance.nom);
		var cells = row.match(reCaptureCellsLinux);
		logger('DEBUG',{msg:'decomposition de la réponse '+cells},'automation_'+surveillance.nom);

    var espace_disk={};

    if (!cells) {
      return espace_disk;
    }
    
		espace_disk.filesystem= cells[1];
		espace_disk.blocks= parseInt(cells[2], 10);
		espace_disk.used= parseInt(cells[3], 10);
		espace_disk.available = parseInt(cells[4], 10);
		espace_disk.percent= parseInt(cells[5], 10);
		espace_disk.mountpoint=cells[6];
		
		logger('DEBUG',{msg:'parseRow espace disque: '+espace_disk.available},'automation_'+surveillance.nom);
		return espace_disk;
}

var espace_libre = function(callback){
			var exec = spawn=global.req.child_process.exec;
	       
    	if (process.platform=='linux'){
    		exec('df /home/', function(error, stdout, stderr) {
						logger('DEBUG',{msg:'espace disque: '+stdout,erreur:stderr+', '+error},'automation_'+surveillance.nom);
        		if (stdout) {							
							 
							 var table = stdout.split(/\n/g);
							 logger('DEBUG',{msg:'Table decomposée: '+table},'automation_'+surveillance.nom);
							 table.pop();
							 logger('DEBUG',{msg:'Table decomposée 2: '+table},'automation_'+surveillance.nom);
							 //table.forEach(parseRow);
							 var espace_disk=parseRow(table[1]);
							
							 logger('DEBUG',{msg:'espace disque: '+espace_disk.available},'automation_'+surveillance.nom);
							 callback(espace_disk);
							 
						} else {
						   callback();
						}
    		});

		 		logger('DEBUG',{msg:'--fin exec'},'automation_'+surveillance.nom);
    	} else {
    		callback();
		};
		 	logger('DEBUG',{msg:'---fin espace libre'},'automation_'+surveillance.nom);

}


module.exports = surveillance;