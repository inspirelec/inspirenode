/**
 * New node file
 */
var send_ip_on_inspirelec={id:20,nom:"send_ip_on_inspirelec",etat:"OFF",lastrun:null};
var timer=null;



send_ip_on_inspirelec.start=function(){
	if (send_ip_on_inspirelec.etat=='OFF') {
		send_ip_on_inspirelec.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		/*Execution toutes les  30 secondes*/
		timer=setInterval(function(){

                version_git(send_ip);
				/*http://www.inspirelec.com/adr/dnsdynamic.php?id='  obj.app.core.findobj('id_installation','constantes');*/
			}, 300000);
        version_git(send_ip);
	}
}

send_ip_on_inspirelec.stop=function(){
	if (send_ip_on_inspirelec.etat=='ON') {
		send_ip_on_inspirelec.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		clearInterval(timer);
	}

}

var get_ip=function(){
	var interfaces = global.req.os.networkInterfaces();
	var addresses = [];
	for (var k in interfaces) {
	    for (var k2 in interfaces[k]) {
	        var address = interfaces[k][k2];
	        if (address.family === 'IPv4' && !address.internal) {
	            addresses.push(address.address);
	        }
	    }
	}
	//console.log(addresses);
	return addresses;
}



function send_ip(){
	var adresseip=get_ip()[0];
	
	var adr='/adr/dnsdynamic.php?'+
			'id=' +	obj.app.core.findobj('idapplication','constantes').valeur+
			'&iplocal=local'+adresseip +
			'&apiport='+global.obj.app.config.apiport +
			'&httpport='+global.obj.app.config.httpport+
		    '&ap='+applienweb+
		    '&ver='+appversion+
	        '&alerte='+global.obj.app.config.alerte_sendiponinspirelec;
			
    logger('INFO',{msg:'Envoi info ip',adr:adr},'automation_'+send_ip_on_inspirelec.nom);
	global.req.comm.perso_get('www.inspirelec.com',adr
			,80,function(err,httpResponse,body){
		//console.log(body);
	});
}

function version_git(callback){
    var exec = spawn=global.req.child_process.exec;

    try {
        if (process.platform=='linux'){
            exec('git describe --tag', function(error, stdout, stderr) {
                appversion=stdout;
                callback();
            });

        } else if (process.platform=='win32' || process.platform=='win64'){
            exec('git describe --tag', function(error, stdout, stderr) {
                appversion=stdout;
                callback();
            });
        }else {
        	callback();
		};
	} catch (e) {
        callback();
	}



}

module.exports = send_ip_on_inspirelec;