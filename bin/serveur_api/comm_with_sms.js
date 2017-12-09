/**
 * New node file
 */



var smssender = function(numero,texte) {
	var servicehttp='/adr/smsservice.php?'
	this.numero=numero;
	this.texte=texte;
	
	this.sendsmsbyhttp =function (callback){
		var url=servicehttp+'numero='+this.numero;
		url+= '&texte='+this.texte;
		global.req.comm.perso_get('www.inspirelec.com',url,80,function(err,httpResponse,body){
			console.log(body);
			callback(err,body);
		});
	}
}

module.exports = smssender;