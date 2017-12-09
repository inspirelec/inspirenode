/**
 * Gestion des volets roulants.
 */
var VR={id:50,nom:"Volets_roulants",etat:"OFF",lastrun:null};
var timer=null;
var timer_1=null;
var timer_2=null;
var timer_3=null;
var timer_4=null;
var ete = null;  // été = 1 ou hiver = 0
var nuit = null; // jour = 0 ou nuit = 1
var mode = null; // soleil = 1, confort = 2 , autre = 0
var exe_unique = 0; //exécution unique
var exe_temp = 0;   //  exécution pour limiter les ouvertures/fermetures delai à definir
var delai_temp = 3600000; // delai pour execution temporaire en ms (1h)
var delai_temp_court = 60000; // delai pour execution temporaire en ms (1 min)
var temp_switch_saison = 19; // température de changement entre été et hivers
var temp_confort = 20; // température de confort
var delta_temp_confort = 2; // delta autour de la température de confort (+ ou -)
var seuil_lum=10; // seuil de luminosité pour le jour/nuit

//id de périphérique pour la gestion
var id_temp_ext=162;
var id_temp_soleil=228;
var id_vr_parent=174;
var id_vr_sdj=175;
var id_vr_garage=195;
var id_lumino_ext=163;


VR.start=function(){
	if (VR.etat=='OFF') {
		VR.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		// boucle toutes les minutes (delai en ms)
		timer=setInterval(function(){
			controleVR();
		}, 60000);				
		controleVR();
	}
}

VR.stop=function(){
	if (VR.etat=='ON') {
		VR.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		
		clearInterval(timer);
	}
}

function controleVR(){
	VR.lastrun=req.moment().format('DD/MM/YY HH:mm:ss');
	
	var periph_temp_ext=obj.app.core.findobj(id_temp_ext,'peripheriques');
	var periph_temp_soleil=obj.app.core.findobj(id_temp_soleil,'peripheriques');

	var periph_vr_parent=obj.app.core.findobj(id_vr_parent,'peripheriques');
	var periph_vr_sdj=obj.app.core.findobj(id_vr_sdj,'peripheriques');
	var periph_vr_garage=obj.app.core.findobj(id_vr_garage,'peripheriques');
		
	var periph_lumino_ext=obj.app.core.findobj(id_lumino_ext,'peripheriques');
	
	// derterminer été ou hiver
	if (periph_temp_ext.last_etat && periph_temp_ext.last_etat.expression ) {		
		var temp_ext = periph_temp_ext.last_etat.expression.etat;
		if (temp_ext>=temp_switch_saison) {
		    if(ete==0){				
				logger('DEBUG',{msg:'Temperature exterieure : '+temp_ext,nom:this.nom},'VR');
				logger('INFO',{msg:'Temperature été',nom:this.nom},'VR');
			}
			ete = 1;
		}else{
		    if(ete==1){
				logger('DEBUG',{msg:'Temperature exterieure : '+temp_ext,nom:this.nom},'VR');
				logger('INFO',{msg:'Temperature hiver',nom:this.nom},'VR');
			}
			ete = 0;		    		
		}
	}
	// determiner jour ou nuit
	if (periph_lumino_ext.last_etat && periph_lumino_ext.last_etat.expression ) {		
		var lumino_ext = periph_lumino_ext.last_etat.expression.etat;
		if (lumino_ext<=seuil_lum) {
			if(nuit==0){
				logger('DEBUG',{msg:'Luminosité exterieure : '+lumino_ext,nom:this.nom},'VR');
				logger('INFO',{msg:'Nuit',nom:this.nom},'VR');
			}
			nuit = 1;		    
			
		}else{
			if(nuit==1){				
				logger('DEBUG',{msg:'Luminosité exterieure : '+lumino_ext,nom:this.nom},'VR');
				logger('INFO',{msg:'Jour',nom:this.nom},'VR');
			}
			nuit = 0;
			// remise zero de l'exécution unique tout les jours
			exe_unique = 0;	
		}
	}
	
	//determiner si soleil, température de confort ou autre
	if (periph_temp_ext.last_etat && periph_temp_ext.last_etat.expression 
	&& periph_temp_soleil.last_etat && periph_temp_soleil.last_etat.expression ) {	
		var temp_ext = periph_temp_ext.last_etat.expression.etat;	
		var temp_soleil = periph_temp_soleil.last_etat.expression.etat;
		var diff_temp  =  temp_soleil - temp_ext;				
		if(diff_temp>5){
			if(mode != 1){
				logger('DEBUG',{msg:'Temperature soleil : '+temp_soleil,nom:this.nom},'VR');				
				logger('DEBUG',{msg:'Temperature exterieure : '+temp_ext,nom:this.nom},'VR');			
				logger('DEBUG',{msg:'Mode Soleil',nom:this.nom},'VR');					
			}
			// mode soleil
			mode = 1;	
			
		}else{
			if(diff_temp < 3){
				if(mode != 0){
					logger('DEBUG',{msg:'Temperature soleil : '+temp_soleil,nom:this.nom},'VR');				
					logger('DEBUG',{msg:'Temperature exterieure : '+temp_ext,nom:this.nom},'VR');			
					logger('DEBUG',{msg:'Mode Autre',nom:this.nom},'VR');					
				}
				// mode autre
				mode = 0;			
			}
		}
		if(mode == 0 && temp_ext<=temp_confort+delta_temp_confort && temp_ext>=temp_confort-delta_temp_confort){
			if(mode != 2){
					logger('DEBUG',{msg:'Temperature soleil : '+temp_soleil,nom:this.nom},'VR');				
					logger('DEBUG',{msg:'Temperature exterieure : '+temp_ext,nom:this.nom},'VR');			
					logger('DEBUG',{msg:'Mode confort',nom:this.nom},'VR');					
				}
			//mode confort
			mode = 2;
		}							
	}
	
	if (nuit == 1 && exe_unique == 0){
	//Scénario nuit
	periph_vr_parent.set_etat('DOWN',null,function(){});
	periph_vr_sdj.set_etat('DOWN',null,function(){});
	periph_vr_garage.set_etat('DOWN',null,function(){});
	exe_unique = 1;
	logger('INFO',{msg:'Fermeture VR nuit',nom:this.nom},'VR');		
	}
	
	if (nuit == 0 && exe_temp == 0){
		//Scénario journée et delai entre 2 actions		
		if (ete == 1) {		
			//Scénario été 			
			if (mode == 1) {
				// conservation de la fraicheur intérieur
				periph_vr_parent.set_etat('DOWN',null,function(){});
				periph_vr_sdj.set_etat('DOWN',null,function(){});
				exe_temp = 1;
				timer_1=setTimeout(function(){
				exe_temp = 0;
				}, delai_temp);						
				logger('INFO',{msg:'Fermeture VR',nom:this.nom},'VR');		
			}
			if (mode == 2 || mode == 0) {
				// profiter de la luminosité extérieure
				//periph_vr_parent.set_etat(periph_vr_parent,'UP',null,function(){});
				periph_vr_sdj.set_etat('UP',null,function(){});
				exe_temp = 1; 
				timer_2=setTimeout(function(){
				exe_temp = 0;
				}, delai_temp_court);	
				logger('INFO',{msg:'Ouverture VR',nom:this.nom},'VR');		
			}
			
		}else{					
			//Scénario hiver				
			if (mode == 1 || mode == 2) {
				// recuperation de chaleur du soleil
				//periph_vr_parent.set_etat(periph_vr_parent,'UP',null,function(){});
				periph_vr_sdj.set_etat('UP',null,function(){});
				exe_temp = 1; 
				timer_3=setTimeout(function(){
				exe_temp = 0;
				}, delai_temp);	
				logger('INFO',{msg:'Ouverture VR',nom:this.nom},'VR');		
			}
			if (mode == 0) {
				// conservation de la chaleur 
				periph_vr_parent.set_etat('DOWN',null,function(){});
				periph_vr_sdj.set_etat('DOWN',null,function(){});
				exe_temp = 1; 
				timer_4=setTimeout(function(){
				exe_temp = 0;
				}, delai_temp_court);	
				logger('INFO',{msg:'Fermeture VR',nom:this.nom},'VR');		
			}
			
		}
	}
/*	
	if (periph_temp_ext.last_etat && periph_temp_ext.last_etat.expression 
	&& periph_temp_soleil.last_etat && periph_temp_soleil.last_etat.expression ) {	

//		heure = new Date(); 
//		diff_heure = dateDiff(heure_exe_temp,heure);
//		logger('DEBUG',{msg:'Date de derniere action : '+heure_exe_temp,nom:this.nom},'VR');
//		logger('DEBUG',{msg:'Date actuelle : '+heure,nom:this.nom},'VR');
//		logger('DEBUG',{msg:'Difference entre les 2 dates : '+diff_heure,nom:this.nom},'VR');
//		logger('DEBUG',{msg:'Comparaison entre les 2 dates : '+diff_heure.min+' , '+delai_temp,nom:this.nom},'VR');

		
		if (nuit == 0 && exe_temp == 0){
			//Scénario journée et delai entre 2 actions			
			var temp_ext = periph_temp_ext.last_etat.expression.etat;	
			var temp_soleil = periph_temp_soleil.last_etat.expression.etat;
			var diff_temp  =  temp_soleil - temp_ext;
			if (ete == 1) {		
				//Scénario été 			
				if (diff_temp > 3) {
					// conservation de la fraicheur intérieur
					periph_vr_parent.box.set_etat(periph_vr_parent,'DOWN',null,function(){});
					periph_vr_sdj.box.set_etat(periph_vr_sdj,'DOWN',null,function(){});
					exe_temp = 1;
					timer=setTimeout(function(){
					exe_temp = 0;
					}, delai_temp);						
					logger('INFO',{msg:'Fermeture VR',nom:this.nom},'VR');		
				}
				if (diff_temp < 2) {
					// profiter de la luminosité extérieure
					periph_vr_parent.box.set_etat(periph_vr_parent,'UP',null,function(){});
					periph_vr_sdj.box.set_etat(periph_vr_sdj,'UP',null,function(){});
					exe_temp = 1; 
					timer=setTimeout(function(){
					exe_temp = 0;
					}, delai_temp_court);	
					logger('INFO',{msg:'Ouverture VR',nom:this.nom},'VR');		
				}
				
			}else{					
				//Scénario hiver				
				if (diff_temp > 5) {
					// recuperation de chaleur du soleil
					periph_vr_parent.box.set_etat(periph_vr_parent,'UP',null,function(){});
					periph_vr_sdj.box.set_etat(periph_vr_sdj,'UP',null,function(){});
					exe_temp = 1; 
					timer=setTimeout(function(){
					exe_temp = 0;
					}, delai_temp);	
					logger('INFO',{msg:'Ouverture VR',nom:this.nom},'VR');		
				}
				if (diff_temp < 2) {
					// conservation de la chaleur 
					periph_vr_parent.box.set_etat(periph_vr_parent,'DOWN',null,function(){});
					periph_vr_sdj.box.set_etat(periph_vr_sdj,'DOWN',null,function(){});
					exe_temp = 1; 
					timer=setTimeout(function(){
					exe_temp = 0;
					}, delai_temp_court);	
					logger('INFO',{msg:'Fermeture VR',nom:this.nom},'VR');		
				}
				
			}
		}
	}*/
}
/*
//retourne la différence entre 2 dates 
function dateDiff(date1, date2){
    var diff = {}                           // Initialisation du retour
    var tmp = date2 - date1;
 
    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes
 
    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
    diff.min = (mp % 60);                    // Extraction du nombre de minutes
 
    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures
     
    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
    diff.day = tmp;
	
	diff.hour = (diff.day*24) + diff.hour;
	diff.min = (diff.hour*60) + diff.min;
	diff.sec = (diff.min*60) + diff.sec;
     
    return diff;
}*/

module.exports = VR;