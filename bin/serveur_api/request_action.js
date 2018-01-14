/**
 * New node file
 */


/*var request = require('./comm.js');
var actionmaj=require('./request_action_maj');
var actionget=require('./request_action_get');
var actionset=require('./request_action_set');
var actionpush=require('./request_action_push');
var actionupdate=require('./request_action_update');*/

var Request_action = function(req,res,app,user) {
	this.req=req;
	this.res=res;
	this.user=user;
	this.traiteaction=function(variables,res){
		res.writeHead(200, 
				{'Content-Type': 'text/plain',
			 	 'Access-Control-Allow-Origin': '*'});
		res.end('Hello World\n');
	};
	
	this.traitementrequete= function(variables){
		console.log(JSON.stringify(req.url));
		var url_parts = global.req.url.parse((req.url), true);
		//var variables=url_parts.query;
		var user=this.user;
		var path=url_parts.pathname;

		logger('DEBUG',{msg:'requete api',requete:url_parts},'api_serveur');
		switch (variables.type) {
		case 'piping':
			this.traiteaction=global.req.request_action_piping;
			break;
		case 'maj':
			this.traiteaction=global.req.request_action_maj;
			break;
		case 'get':
			this.traiteaction=global.req.request_action_get;
			break;
		case 'set':
			this.traiteaction=global.req.request_action_set;
			break;
		case 'push':
			this.traiteaction=global.req.request_action_push;
			break;
		case 'update':
			this.traiteaction=global.req.request_action_update;
			break;
		default:
			if (variables.v) {
				var version=variables.v.split(".");
				switch (version[0]) {
				case 'home':
					//console.log('appli Home');
					this.traiteaction=global.req.request_action_appliphp;
					break;
				case 'indus':
					//console.log('appli Camp');
					this.traiteaction=global.req.request_action_appli;
					break;
				case 'acces':
					//console.log('appli Camp');
					this.traiteaction=global.req.request_action_appli_acces;
					break;
				case 'piscine':
					//console.log('appli Home');
					this.traiteaction=global.req.request_action_appli;
					break;
				case 'voyage':
					//console.log('appli Home');
					this.traiteaction=global.req.request_action_appli;
					break;
					
				default:
					break;
				}
			} else {
				//console.log('appli Home');
				this.traiteaction=global.req.request_action_appliphp;
			}
			
			break;
		}
		
		var self=this;
		if (req.method=='POST') {
			var body="";
			req.on('data', function (data) {
				if (!body) body="";
	            body += data.toString();
	            //console.log("Partial body: " + body);
	        });
	        req.on('end', function () {
	        	//console.log('POST: '+path+JSON.stringify(variables));
	        	if (body) {
	        		variables.data=(body); 
	        		//console.log("Body: " + body);	
	        		try {
						variables.data=JSON.parse(variables.data).data;
					} catch (e) {
						variables.data=decodeURI(variables.data);
						logger('ERROR',{msg:'requete api JSON parse impossible',requete:url_parts,error:e},'api_serveur');

					}
		        	
		           
	        	}
	        	/*try {*/
					self.traiteaction(variables, res,user,req);
				/*} catch (e) {
					console.log(e);
					console.log(new Error().stack);
				}*/
	            
	            
	        });
	        
		} else {
			//console.log('not post');
			self.traiteaction(variables, res,user,req);
			//console.log('1339:GET : '+path+JSON.stringify(variables));
		}
		
		
		
	};
};

module.exports = Request_action;