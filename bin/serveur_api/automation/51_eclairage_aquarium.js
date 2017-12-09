/**
 * Gestion de l'aquarium.
 */
var EclAq={id:51,nom:"Gestion_aquarium",etat:"OFF",lastrun:null};

//id de p�riph�rique deport� pour la gestion
var id_ecl_aqu=2;
var id_ecl=3;
var id_co2=5;
var id_pompe=6;


EclAq.start=function(){
	if (EclAq.etat=='OFF') {
		EclAq.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		// boucle toutes les minutes (delai en ms)
		timer=setInterval(function(){
			controleEclAq();
		}, 60000);				
		controleEclAq();
	}
}

EclAq.stop=function(){
	if (EclAq.etat=='ON') {
		EclAq.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');		
		clearInterval(timer);
	}
}

function controleEclAq(){
	EclAq.lastrun=req.moment().format('DD/MM/YY HH:mm:ss');
	
	var periph_ecl_aqu=obj.app.core.findobj(id_ecl_aqu,'peripheriquesdeportes');	
	var periph_ecl=obj.app.core.findobj(id_ecl,'peripheriquesdeportes');
	var periph_pompe=obj.app.core.findobj(id_pompe,'peripheriquesdeportes');
	var periph_co2=obj.app.core.findobj(id_co2,'peripheriquesdeportes');
	var heure=parseInt(req.moment().format('HH'));
	var minutes=parseInt(req.moment().format('mm'));
		
	if (periph_ecl_aqu.last_etat && periph_ecl_aqu.last_etat.expression
		&& periph_ecl.last_etat && periph_ecl.last_etat.expression
		&& periph_pompe.last_etat && periph_pompe.last_etat.expression
		&& periph_co2.last_etat && periph_co2.last_etat.expression) {	
		var etat_ecl_aqu = periph_ecl_aqu.last_etat.expression.etat;
		var etat_ecl = periph_ecl.last_etat.expression.etat;
		var etat_co2 = periph_co2.last_etat.expression.etat;
		var etat_pompe = periph_pompe.last_etat.expression.etat;
		
		if(heure == 8 && minutes > 00 && minutes < 15 && etat_ecl_aqu != 5){
			periph_ecl_aqu.set_etat('DIM', '5', function(){});
			periph_ecl.set_etat('ON', null, function(){});
			logger('INFO',{msg:'Eclairage 5%',nom:this.nom},'Aquarium');	
		} 
		if(heure == 8 && minutes > 15 && minutes < 30 && etat_ecl_aqu != 10){
			periph_ecl_aqu.set_etat('DIM', '10', function(){});
			logger('INFO',{msg:'Eclairage 10%',nom:this.nom},'Aquarium');	
		} 
		if(heure == 8 && minutes > 30 && minutes < 45 && etat_ecl_aqu != 20){
			periph_ecl_aqu.set_etat('DIM', '20', function(){});
			logger('INFO',{msg:'Eclairage 20%',nom:this.nom},'Aquarium');	
		} 
		if(heure == 8 && minutes > 45 && minutes <= 59 && etat_ecl_aqu != 40){
			periph_ecl_aqu.set_etat('DIM', '40', function(){});
			logger('INFO',{msg:'Eclairage 40%',nom:this.nom},'Aquarium');	
		} 
		if(heure == 9 && minutes > 00 && minutes < 15 && etat_ecl_aqu != 60){
			periph_ecl_aqu.set_etat('DIM', '60', function(){});
			logger('INFO',{msg:'Eclairage 60%',nom:this.nom},'Aquarium');	
		} 
		if(heure == 9 && minutes > 15 && minutes < 30 && etat_ecl_aqu != 80){
			periph_ecl_aqu.set_etat('DIM', '80', function(){});
			logger('INFO',{msg:'Eclairage 80%',nom:this.nom},'Aquarium');	
			periph_pompe.set_etat('ON', null, function(){});
			logger('INFO',{msg:'Demarrage pompe',nom:this.nom},'Aquarium');	
		} 
		if(heure == 9 && minutes > 30 && minutes < 45 && etat_ecl_aqu != 100){
			periph_ecl_aqu.set_etat('DIM', '100', function(){});
			logger('INFO',{msg:'Eclairage 100%',nom:this.nom},'Aquarium');	
			periph_co2.set_etat('ON', null, function(){});
			logger('INFO',{msg:'Ouverture CO2',nom:this.nom},'Aquarium');	
		} 
		
		
		if(heure == 20 && minutes > 00 && minutes < 15 && etat_ecl_aqu != 80){
			periph_ecl_aqu.set_etat('DIM', '80', function(){});
			logger('INFO',{msg:'Eclairage 80%',nom:this.nom},'Aquarium');	
			periph_pompe.set_etat('OFF', null, function(){});
			logger('INFO',{msg:'Arret pompe',nom:this.nom},'Aquarium');	
			periph_co2.set_etat('OFF', null, function(){});
			logger('INFO',{msg:'Arret CO2',nom:this.nom},'Aquarium');	
		} 
		if(heure == 20 && minutes > 15 && minutes < 30 && etat_ecl_aqu != 60){
			periph_ecl_aqu.set_etat('DIM', '60', function(){});
			logger('INFO',{msg:'Eclairage 60%',nom:this.nom},'Aquarium');	
		} 
		if(heure == 20 && minutes > 30 && minutes < 45 && etat_ecl_aqu != 40){
			periph_ecl_aqu.set_etat('DIM', '40', function(){});
			logger('INFO',{msg:'Eclairage 40%',nom:this.nom},'Aquarium');	
		} 
		if(heure == 21 && minutes > 45 && minutes <= 59 && etat_ecl_aqu != 20){
			periph_ecl_aqu.set_etat('DIM', '20', function(){});
			logger('INFO',{msg:'Eclairage 20%',nom:this.nom},'Aquarium');	
		} 
		if(heure == 21 && minutes > 00 && minutes < 15 && etat_ecl_aqu != 10){
			periph_ecl_aqu.set_etat('DIM', '10', function(){});
			logger('INFO',{msg:'Eclairage 10%',nom:this.nom},'Aquarium');	
		} 
		if(heure == 21 && minutes > 30 && minutes < 45 && etat_ecl_aqu != 5){
			 periph_ecl_aqu.set_etat('DIM', '5', function(){});
			logger('INFO',{msg:'Eclairage 5%',nom:this.nom},'Aquarium');	
		}
		if(heure == 21 && minutes > 45 && minutes < 50 && etat_ecl != 0){
			periph_ecl.set_etat('OFF', null, function(){});
			logger('INFO',{msg:'Extinction eclairage',nom:this.nom},'Aquarium');	
		} 
		
	}
}

module.exports = EclAq;