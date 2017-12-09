/**
 * New node file
 */
var push_ipx800={id:9,nom:"push_ipx800",etat:"OFF",lastrun:null};


push_ipx800.start=function(){
	if (push_ipx800.etat=='OFF') {
		push_ipx800.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
	}
}

push_ipx800.stop=function(){
	if (push_ipx800.etat=='ON') {
		push_ipx800.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
	}
}






module.exports = push_ipx800;