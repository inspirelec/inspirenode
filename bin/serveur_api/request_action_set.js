/**
 * New node file
 */

module.exports =function(variables,res){

	logger('DEBUG',{variables:variables,res:res},'request_action_set');
	switch (variables.action) {
	case 'BOX':
		var periphremote=variables.data.periphremote;
		//periphremote.box_type
		//periphremote.box_identifiant
		//periphremote.box_protocole
		//periphremote.ecriture_max_value
		//periphremote.ecriture_min_value
		//periphremote.id + prefixe 'remote'
		//periphremote.uuid + prefixe 'remote'
		//periphremote.box.id pour recherche box local
		
		if (!periphremote.last_etat) periphremote.last_etat={};
		if (!periphremote.last_etat.expression) periphremote.last_etat.expression={};
		
		var cmd=variables.data.cmd;
		var valm=variables.data.val;
		if (cmd=='ON' || cmd=='UP') {if(periphremote.ecriture_max_value) valm=periphremote.ecriture_max_value; else valm=1;}
		if (cmd=='OFF' || cmd=='DOWN' || cmd=='STOP') {if(periphremote.ecriture_min_value) valm=periphremote.ecriture_min_value; else valm=0;}		
		if (periphremote.box) {
			var box=global.obj.app.core.findobj(periphremote.box.id,'boxs');
			if (box){
				
				periphremote.box=box;
				box.set_etat(periphremote,cmd,valm,function(rep_box){
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					
					var id_box=periphremote.box.id;
					delete(periphremote.box);
					periphremote.box={id:id_box};
					res.end(JSON.stringify({rep_box:rep_box,periphinfo:periphremote}));
				});			
			} 	else {
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify({rep_box:'box non trouvée',periphinfo:periphremote}));
			}		
		}else {
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify({rep_box:'manque les infos de la box a traiter',periphinfo:periphremote}));
		}


		
		break;
	case 'ON':
		var periphe=global.obj.app.core.findinperiphs(variables.data.uuid);
		
		periphe.set_etat('ON',null,function(rep_box){
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify(rep_box));
			});
				
		break;
	case 'STOP':
	case 'OFF':
		var periphe=global.obj.app.core.findinperiphs(variables.data.uuid);

		periphe.set_etat(variables.action,null,function(rep_box){
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify(rep_box));
			});
		break;
	case 'UP':
		var periphe=global.obj.app.core.findinperiphs(variables.data.uuid);
		periphe.set_etat('UP',null,function(rep_box){
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify(rep_box));
			});
				
		break;
	case 'DOWN':
		var periphe=global.obj.app.core.findinperiphs(variables.data.uuid);
		periphe.set_etat('DOWN',null,function(rep_box){
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(JSON.stringify(rep_box));
			});
		break;
	case 'DIM':
		var periphe=global.obj.app.core.findinperiphs(variables.data.uuid);
		periphe.set_etat('DIM',variables.val,function(rep_box){
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify(rep_box));
		});

		break;	
	case 'automation_ON':
		var automat=global.obj.app.core.findobj(variables.data.id,'automation');
		var sqldel="delete from automation_etat where id_automation ='"+variables.data.id+"';";
		global.obj.app.db.sqltrans(sqldel,function(){
			variables.element='automation_etat';
			variables.data.etat='ON';
			variables.data.id_automation=variables.data.id;
			variables.action='save';
			obj.app.core.majdb(variables,function(){});
		});

		automat.start();
		res.writeHead(200, 
				{'Content-Type': 'text/plain',
				 'Access-Control-Allow-Origin': '*'});
		var rep={action:'automation d�marr�',"data": variables.data};
		res.end(JSON.stringify(rep));

		
		break;
	case 'automation_OFF':
		var automat=global.obj.app.core.findobj(variables.data.id,'automation');
		var sqldel="delete from automation_etat where id_automation ='"+variables.data.id+"';";
		global.obj.app.db.sqltrans(sqldel,function(){
			variables.element='automation_etat';
			variables.data.etat='OFF';
			variables.data.id_automation=variables.data.id;
			variables.action='save';
			obj.app.core.majdb(variables,function(){});
		});
		automat.stop();
		res.writeHead(200, 
				{'Content-Type': 'text/plain',
				 'Access-Control-Allow-Origin': '*'});
		var rep={action:'automation stopp�',"data": variables.data};
		res.end(JSON.stringify(rep));

		break;
	case 'transaction':
			var sql=variables.data.requete;

			logger('DEBUG',{nom:'requete set :',sql:sql},'Requete');
			global.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					logger('DEBUG',{nom:'reponse set  :',rep:rep},'Requete');
					res.writeHead(200,
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
	default:
		res.writeHead(404, 
				{'Content-Type': 'text/plain',
				 'Access-Control-Allow-Origin': '*'});
		res.end("");
		break;
}
};
