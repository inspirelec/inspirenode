/**
 * New node file
 */



var mailsender = function(to,texte,from,objet) {
	var servicehttp='/adr/comm_with_mail.php?'
	this.to=to;
	this.texte=texte;
	this.from=from;
	this.objet=objet;
	logger('DEBUG',{destinataire:'envoi mail sur  '+to, msg:texte, from:from, objet:objet },'box_mail');
	this.sendmailbyhttp =function (callback){

		logger('DEBUG',{destinataire:'envoi mail sur  '+this.to, msg:this.texte },'box_mail');

		var url=servicehttp+'to='+this.to;
		url+= '&texte='+this.texte;
		url+= '&from='+this.from;
		url+= '&objet='+this.objet;
		global.req.comm.perso_get('www.inspirelec.com',url,80,function(err,httpResponse,body){
		    logger('DEBUG',{msg:'Réponse mail:  '+body, err:err},'box_mail');
			callback(err,body);
		});
	}
}

module.exports = mailsender;