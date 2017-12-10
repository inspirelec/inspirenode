/**
 * New node file
 */

module.exports =function(variables,res){
	logger('DEBUG',{variables:variables,res:res},'request_action_push');
	switch (variables.action) {
	case 'sendmessage':
		if (variables.data.type_envoi=='smshttp'){
			var smssender=new global.req.comm_with_sms(variables.data.destinataire,'From:'+variables.data.from+'\n'+'Objet:'+variables.data.objet+'\n****Message****\n'+variables.data.message);
			smssender.sendsmsbyhttp(function(err,body){
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify({msg:body.split('<br />').join('\n').split('\n'),erreur:err}));
			});				
		}else if (variables.data.type_envoi=='mailhttp'){
			var mailsender=new global.req.comm_with_mail(variables.data.destinataire,variables.data.message,variables.data.from,variables.data.objet);
			mailsender.sendmailbyhttp(function(err,body){
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify({msg:body.split('<br />').join('\n').split('\n'),erreur:err}));
			});	
		}else {
			res.writeHead(404, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end("");
		}

		break;
		
	default:
		res.writeHead(404, 
				{'Content-Type': 'text/plain',
				 'Access-Control-Allow-Origin': '*'});
		res.end("");
		break;
	};
}