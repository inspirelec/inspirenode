/**
 * New node file
 */
var update_etats={id:4,nom:"update_etats",etat:"OFF",lastrun:null};
var timer=null;


update_etats.start=function(){
	if (update_etats.etat=='OFF') {
		update_etats.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		obj.app.serveur.on('core_charge_all',run_update_etat);
		obj.app.serveur.on('box.update_etat_box',actions_on_event1);
		obj.app.serveur.on('box.update_etat_boxs',actions_on_event2);
		
		/*Execution toutes les  30 secondes*/
		timer=setInterval(function(){
				run_update_etat();
			}, 30000);
		
		run_update_etat();	
	}
}

update_etats.stop=function(){
	if (update_etats.etat=='ON') {
		update_etats.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		obj.app.serveur.removeListener('core_charge_all',run_update_etat);
		obj.app.serveur.removeListener('box.update_etat_box',actions_on_event1);
		obj.app.serveur.removeListener('box.update_etat_boxs',actions_on_event2);
		clearInterval(timer);
	}

}
var run_update_etat = function(){
	req.box.update_etat_boxs(function(){});
}

var actions_on_event1=function(box){
	update_etats.lastrun=req.moment().format('DD/MM/YY HH:mm:ss');
	req.peripherique.update_etat_periph_of_box(box,function(){
		//req.periph_chauffage.update_etat_periphchauff(function(){});
		//req.periph_alarme.update_etat_periphalarme(function(){});
	});
	
	
}
var actions_on_event2=function(box){
	req.mode.update_etat();
	req.type.update_etat();
	req.periph_chauffage.update_etat_periphchauff(function(){});
	req.periph_alarme.update_etat_periphalarme(function(){});
	req.periph_batterie.update_etat_periphbatterie(function(){});
	req.periph_deporte.update_etat_periphdeporte(function(){});
	
}

module.exports = update_etats;