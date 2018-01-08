

var Server = function server(adresseip,port,app) {
	this.adresseip=adresseip;
	this.port=port;
	
	this.requestclient= new global.req.events.EventEmitter();
	
	this.start=function() {
           this.httpserver.listen(this.port, this.adresseip)
			   .on('error', function(err)
           {
           	console.log(err);
           	process.exit();
           });
		this.emit('serveur_api.start',this.port,this.adresseip);
	};
	this.emit=function(){
		var log='Event serveur api emit : ';//+arguments[0];
		var info="";
		if (arguments[1] && arguments[1].id) {
			info+= " id="+arguments[1].id;
		}
		if (arguments[1] && arguments[1].nom) {
			info+= " nom="+arguments[1].nom;
		}
		/*if (info=="" && arguments[1]) {
			try {
				info=JSON.stringify(arguments)
			} catch (e) {
			}
		}*/
		//console.log(log + "   ("+info+" )");
		logger('INFO',log,'evenements');
		Server.prototype.emit.apply(this,arguments);
	}
	this.receivereq=function (req,res){
		  var header=req.headers['authorization']||'';    
		  var token=header.split(/\s+/).pop()||'';            // and the encoded auth token
		  var auth=new Buffer(token, 'base64').toString();    // convert from base64
	      var parts=auth.split(/:/);                          // split on colon
	      var username=parts[0];
	      var password=parts[1];
		  var url_parts = global.req.url.parse((req.url), true);
		  var variables=url_parts.query;
		  //console.log(req.url);
		 // console.log(auth,username,password);
		  var remoteip=req.connection.remoteAddress;
		  if (req.method=='OPTIONS'){
			  res.writeHead(200,{
				  "Access-Control-Allow-Origin": "*",
				  "Access-Control-Allow-Headers": "Authorization,Content-type",
				  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
				  "Access-Control-Max-Age": "1728000"
			  });
			  res.end();
			  return;
		  }
		  if (!username && !password && (variables.type=='piping' || (!variables.type && (variables.action=='createuser' || variables.action=='controleinfouser' || variables.action=='recupmotpasse' || variables.action=='listcpville')))){
			  logger_request('INFO',{remoteip:remoteip,msg:'api sans authorisation necessaire',type:variables.type,action:variables.action,user:username,pass:password},'api_serveur');
			  var reqcli=new global.req.request_action(req,res,app,null);
				reqcli.traitementrequete(variables);
				
		  } /*else if (!username || !password) {
			  logger_request('WARNING',{remoteip:remoteip,msg:'sans login mot de passe',user:username,pass:password},'api_serveur');
              console.log('WARNING',{remoteip:remoteip,msg:'sans login mot de passe',user:username,pass:password},'api_serveur');
			 
			  res.writeHead(404, {'WWW-Authenticate': 'Basic realm="INSPIRATHOME"'});
			  res.end();
			  return;
		  }*/ else  {
			var sql="select * from (select 0 t,u.* from utilisateurs u where (lower(user)=lower(?) or (lower(email)=lower(?) and email like '%@%')) and password=?" +
				"    union select 1 t,u.* from box b,utilisateurs u where b.ip='"+remoteip+"' ) order by t,id limit 1  ;"
			global.obj.app.db.sqlorder(sql,function(rows){
				if (rows && rows[0]) {
					try {
						global.obj.app.core.clientactif(req);
					} catch (e) {

					}
					var userinfo =rows[0];
					logger('INFO',{msg:'login ok',user:username,remoteip:remoteip},'login_user');
					logger_request('INFO',{remoteip:remoteip,msg:'login ok',user:username},'api_serveur');
					 
					global.obj.app.serveur.emit('server.request.login',username);
					//console.log("utilisateur : "+username + " de l'ip : "+remoteip);
					var reqcli=new global.req.request_action(req,res,app,userinfo);
					reqcli.traitementrequete(variables);
					
		 		} else {
		 			logger('WARNING',{msg:'mauvais login mot de passe',user:username,pass:password,remoteip:remoteip},'login_user');
		 			logger_request('WARNING',{remoteip:remoteip,msg:'mauvais login mot de passe',user:username,pass:password},'api_serveur');
					
		 			global.obj.app.serveur.emit('server.request.badlogin',username,password);
					res.writeHead(404, {'WWW-Authenticate': 'Basic realm="INSPIRATHOME"'});
					res.end();
					
				}
			},[username,username,password]);
		 }
	};
	
	this.httpserver=global.req.http.createServer(this.receivereq);
};

Server.prototype= new global.req.events.EventEmitter();
module.exports = Server;

