/**
 * New node file
 */
/*var url = require('url');
var fs = require('fs');
var mime = require('mime');*/
//var pathl = require('path');

var dispatcher= function(req,res){
	var url_parts = global.req.url.parse(req.url, true);
	var variables=url_parts.query;
	var path=url_parts.pathname;
	if (path=='/config_app.json')
		path='/data/config.json';

	if (path=='/data/config.json'){
		var appconf=global.obj.app.config;
		var conf={appli_link_adr_web:appconf.appli_link_adr_web,
			       httpport:appconf.httpport,
			       apiport:appconf.apiport,
			       appli:appconf.appli ,
                   regroup_periph_by_categ:appconf.regroup_periph_by_categ,
                   mainframedisposition: appconf.mainframedisposition};
        var rep = JSON.stringify(conf);
        res.writeHead(200,
            {'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'});
        res.end(rep);
        return;
	}
	
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
        		console.log("Body: " + body);	
        	}
        	res.writeHead(200, {'Content-Type': 'text/html',
				'Access-Control-Allow-Origin': '*'});
        	res.end(body);
        	

        });
	}
	
	var remoteip=req.connection.remoteAddress;
	var pathdefaut="";
    var pathlinkwebdefaut="";
    var pathmainpagedefaut="";
	switch (applicationtype) {
        case 'inspireacces':
            pathdefaut="/appliacces/";
            pathlinkwebdefaut="/appliacces/";
            pathmainpagedefaut=pathdefaut+"main.html";
            break;
		default:

            pathdefaut="/"+global.obj.app.config.appli_folder+"/";
            pathlinkwebdefaut="/"+global.obj.app.config.appli_link_adr_web+"/";
            pathmainpagedefaut=pathdefaut+"index.html";
			break;
	}

    path=path.replace(pathlinkwebdefaut,pathdefaut);

	if (path.substr(0,6)=='/index' || path.substr(0,5)=='/main'){
		//console.log('ok');
		//console.log('api',path);
		global.obj.app.serveur.receivereq(req,res);
	} else if (path && path!="/" && global.req.fs.existsSync(__dirname+"/.."+path)) {
		//logger('INFO',{remoteip:remoteip,msg:'requete utilisteur',requete:url_parts},'http_serveur');
		
		logger_request('INFO',{remoteip:remoteip,msg:'requete utilisteur',requete:url_parts},'http_serveur');
		var content_type=global.req.mime.lookup(__dirname+"/.."+path);
		//if (content_type=='application/json') content_type='application/x-javascript';
		try {
			var content=global.req.fs.readFileSync(__dirname+"/.."+path);
			//console.log('HTTP: '+path+variables);
			//console.log('http ok',path);
			res.writeHead(200, {'Content-Type': content_type,
								'Access-Control-Allow-Origin': '*'});

			res.end(content);
		} catch (e) {
			logger_request('WARNING',{remoteip:remoteip,msg:'mauvaise requete',requete:url_parts},'http_serveur');
			/*res.writeHead(404, {'Content-Type': 'text/html',
								'Access-Control-Allow-Origin': '*'});
			res.end("Bye");*/

			//console.log('pathdefaut',path,pathdefaut);
			var content_type=global.req.mime.lookup(__dirname+"/.."+pathmainpagedefaut);
			//if (content_type=='application/json') content_type='application/x-javascript';
			var content=global.req.fs.readFileSync(__dirname+"/.."+pathmainpagedefaut);
			//console.log('HTTP: '+path+variables);
			res.writeHead(200, {'Content-Type': content_type,
								'Access-Control-Allow-Origin': '*'});

			res.end(content);
		}

	} else if (path && path!="/" && global.req.fs.existsSync(__dirname+"/../.."+path)) {
		logger_request('INFO',{remoteip:remoteip,msg:'requete utilisteur',requete:url_parts},'http_serveur');
		var content_type=global.req.mime.lookup(__dirname+"/../.."+path);
		try {
			var content=global.req.fs.readFileSync(__dirname+"/../.."+path);
			res.writeHead(200, {'Content-Type': content_type,
								'Access-Control-Allow-Origin': '*'});

			res.end(content);
		} catch (e) {
			logger_request('WARNING',{remoteip:remoteip,msg:'mauvaise requete',requete:url_parts},'http_serveur');
			var content_type=global.req.mime.lookup(__dirname+"/../.."+pathmainpagedefaut);
			var content=global.req.fs.readFileSync(__dirname+"/../.."+pathmainpagedefaut);
			res.writeHead(200, {'Content-Type': content_type,
								'Access-Control-Allow-Origin': '*'});
			res.end(content);
		}

	} else {
		//logger('WARNING',{remoteip:remoteip,msg:'mauvaise requete',requete:url_parts},'http_serveur');
		
		/*logger_request('WARNING',{remoteip:remoteip,msg:'mauvaise requete',requete:url_parts},'http_serveur');

		res.writeHead(404, {'Content-Type': 'text/html',
			'Access-Control-Allow-Origin': '*'});
		res.end("Bye");*/
		logger_request('WARNING',{remoteip:remoteip,msg:'mauvaise requete',requete:url_parts},'http_serveur');
		/*res.writeHead(404, {'Content-Type': 'text/html',
							'Access-Control-Allow-Origin': '*'});
		res.end("Bye");*/

		//console.log('pathdefaut',path,pathdefaut);
		var content_type=global.req.mime.lookup(__dirname+"/.."+pathmainpagedefaut);
		//if (content_type=='application/json') content_type='application/x-javascript';
		var content=global.req.fs.readFileSync(__dirname+"/.."+pathmainpagedefaut);
		//console.log('HTTP: '+path+variables);

		res.writeHead(200, {'Content-Type': content_type,
							'Access-Control-Allow-Origin': '*',
            				'Location':'/'+global.obj.app.config.appli_link_adr_web+"/"});

		res.end('<meta http-equiv="Refresh" content="0;URL=/'+global.obj.app.config.appli_link_adr_web+'/">');

	} 


}

module.exports = dispatcher;
