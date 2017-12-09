/**
 * New node file
 */

var dir =__dirname+'/../../Log';

var tracelevelsr = {ERROR:0,WARNING:1,INFO:2,DEBUG:3}
var tracagelevelr=0;
var ecritureencoursr=false;
var messageaecrirer=[];

logger_request=function (typel,messagel,fichierl) {
	
	messageaecrirer.push({type:typel,message:messagel,fichier:fichierl});
	
	setTimeout(function(){
		
		if (!ecritureencoursr) {
			ecritureencoursr=true;
			if (global.obj && global.obj.app && global.obj.app.core) {
				var constantetrace=global.obj.app.core.findobj('tracelevel','constantes');
				if (constantetrace) tracagelevel=constantetrace.valeur;
				if (tracagelevelr ==null) tracagelevelr=0;			
			} else {
				tracagelevel=0;
			}
			while (messageaecrirer.length>0) {
				//console.log('logger msg : '+messageaecrire.length)
				try {
					var messageencours=messageaecrirer.shift();
					var type=messageencours.type;
					var message=messageencours.message;
					var fichier=messageencours.fichier;
					
					if (typeof type=='string' && typeof tracelevelsr[type] !='undefined' && tracelevelsr[type]<=tracagelevelr ) {		
						
						if (typeof message !='string') {
							message=JSON.stringify(message);
						}
						
						var Datetime = global.req.moment().format('DD/MM/YY HH:mm:ss.SSSS');
						var Datefile = global.req.moment().format('YYYY-MM-DD');
						
						if (!global.req.fs.existsSync(dir)){
							global.req.fs.mkdirSync(dir);
						}
						
						var info='';
						if (type=='ERROR') {
							var e =new Error();
							var stack=e.stack.split('\n');
							for ( var l in stack) {
								info += stack[l]+'--';	
							}				
						}
	
						
				
						/*if (fichier=='arduino_acces') {
							
							console.log(Datetime+" -- " + type + " "+fichier+" -- " + message+ " -- " + info);
						}*/
						if (type=='ERROR' ){
							console.trace(Datetime+" -- " + type + " "+fichier+" -- " + message+ " -- " + info);
						} else 	if ( (tracagelevelr==tracelevelsr.DEBUG 
								&& (fichier=="box_inspirenode" 
									||fichier=="startstop1"  )
								)) {
							console.log(Datetime+" -- " + type + " "+fichier+" -- " + message+ " -- " + type+" -- " + info);
						
						}
						
						global.req.fs.appendFileSync(dir+"/"+applicationtype+"_"+Datefile+"_"+fichier+".log",Datetime + " -- " + message+" -- " + type+ " -- " + info + "\n");
					}
				} catch (e) {
					/*envoi dans le fichier log géré par le service*/
					/*pas via la fonction logger car c'est elle même qui plante*/
					console.log('Plantage dans le logger')
					console.log(e.stack);
				}
				
			}
			ecritureencoursr=false;
		}
	},0)

}



/*
logger('ERROR',{msg:'message test',id:1,infocomp:'test obj'},'output');
logger('WARNING',{msg:'message test',id:2,infocomp:'test obj'},'output');
logger('INFO',{msg:'message test',id:3,infocomp:'test obj'},'output');
logger('DEBUG',{msg:'message test',id:4,infocomp:'test obj'},'output');

console.log('test des typeof ...');
console.log("numeric 0 : "+typeof 0 );
console.log("numeric 150 : "+typeof 150 );
console.log("float 0.1 : "+typeof 0.1 );
console.log("string 0 : "+typeof "0" );
console.log("string toto : "+typeof "toto" );
var u;console.log("var non definit : "+typeof u );
var bool=false;console.log("var boolean : "+typeof bool );
var un;console.log("var null : "+typeof un );
var o={};console.log("var obj {} : "+typeof o );
var a=[];console.log("var a [] : "+typeof a );
var b=new Buffer(0);console.log("var new buffer(0) : "+typeof b );
var f=function(){};console.log("var function() {} : "+typeof f );
var ft=function test(){};console.log("var function test() {} : "+typeof ft );
var Stri=new String("s");;console.log("var new String('s') : "+typeof Stri );

console.log('\ntest des instanceof ...');
var ft=new function test(){};console.log("var function test() {} : "+(ft).constructor.name );
var Stri=new String("s");;console.log("var new String('s') : "+(Stri).constructor.name );
*/


