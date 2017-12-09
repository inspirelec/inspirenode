/**
 * New node file
 */

var adresseiplocal='192.168.1.41';
var httpport=0;
var apiport=0;
function getJsonObject(callbackfunction,url,data){

	if (typeof device == "undefined"){
		serviceLocal = window.location.protocol+"//"+window.location.hostname+":"+apiport+"/";
		serviceHttp = window.location.protocol+"//"+window.location.hostname+":"+apiport+"/"; 
		imagesHttp = window.location.protocol+"//"+window.location.hostname+":"+httpport+"/";
		imagesLocal = window.location.protocol+"//"+window.location.hostname+":"+httpport+"/";
		pubLocal = window.location.protocol+"//"+window.location.hostname+":8888/";
		pubHttp = window.location.protocol+"//"+window.location.hostname+":8888/";
		serviceURL = serviceLocal;
		imagesURL = imagesLocal;
		pubURL = pubLocal;
		//cameraURL=cameraLocal;
	}

	_ajax_request(serviceURL + url,  {"data":data}, callbackfunction, 'json', 'POST');
}


/*function getJsonObjectTest(callbackfunc,url,callbackfunction) {
	 _ajax_requesttest(url, {"data":{}}, function(data){ callbackfunc(data,'done',callbackfunction);}
    						   , function(){ callbackfunc(null,'error',callbackfunction);}, 'json', 'POST');
}*/



/*$(function(){

	//if (typeof device != "undefined"){
		
		auth = make_base_auth(userlogin, userpassword);
		//alert( "user "+userlogin+" passwd "+userpassword + " =" +auth);
		$.ajaxSetup({
        	beforeSend: function(xhr,settings) {
        	   // alert('setup '+settings.url);
        		
                 xhr.setRequestHeader('Authorization', auth);
             }
    	});
	//}
	

});*/

function initconnexiontype(callbackfunction){
	//$('#btnconnection').html("... en cours"); /* bouton de la boite login*/
	/*utile pour connexion mobile phonegap*/
	auth = make_base_auth(userlogin, userpassword);

	/*$.ajaxSetup({
		  headers: {
		    'Authorization': make_base_auth(userlogin, userpassword)
		  }
		});*/
	var iddemo="";
	if (userlogin=='demo') {
		setInfoMemo('idinspire','demonstration');
		iddemo='demonstration';
	}
	if (userlogin=='vacancier' || userlogin=='personnel' || userlogin=='technique') {
		setInfoMemo('idinspire','camping');
		iddemo='camping';
	}
	protocol="http:";
	$('#btnconnection').html("---->");
	
	if (isitdevice() ){
		var testidinspire=getInfoMemo('idinspire','');
		var testiplocal=getInfoMemo('iplocal','');
		var testippardefaut=adresseiplocal;
		var testhttpadresse=getInfoMemo('httpadresse','');
		var testapiport=getInfoMemo('apiport','1368');
		var testhttpport=getInfoMemo('httpport','1369');
		var parametreipOk=false;
		/*si sur une mobile tablette*/
		
		reseau="";
		
		try {
			reseau=check_network();
		} catch (e) {
		}
		
		async.waterfall([
		                 function(callback) {
		             		if (reseau=='wifi' || reseau=='inconnu') {
		            			/*si connexion wifi*/
		            			//alert('connexion wifi');
		            			if (!parametreipOk && testiplocal && testiplocal!=''){
		            				/*si adresse local existe*/
		            				//alert('iplocal '+testiplocal);
		            				testconnexionserveur(testiplocal,testapiport,function(idtrouve,status){
		            					//alert('iplocal ='+JSON.stringify(idtrouve));
			            				if (controleId(idtrouve)) {
			            					parametreipOk=true;
			            					setadresses(protocol,'local'+testiplocal,testapiport,testhttpport);
			            				}
			            				callback(null,parametreipOk,testiplocal);
		            				});
		            				//

		            			} else {
			             			callback(null,parametreipOk,testiplocal);
			             		}
		            		} else {
		             			callback(null,parametreipOk,testiplocal);
		             		}
		                 }/*,
		                 function(parametreipOk,ipifOk, callback) {
			             		if (reseau=='wifi' || reseau=='inconnu') {
			            		
			            			if (!parametreipOk && testippardefaut && testippardefaut!=''){
			            				
			            				testconnexionserveur(testippardefaut,function(idtrouve,status){
			            					
				            				if (controleId(idtrouve)) {
				            					parametreipOk=true;
				            					setadresses(protocol,'local'+testippardefaut);
				            				}
				            				callback(null,parametreipOk,testippardefaut);
			            				});

			            			} else {
				             			callback(null,parametreipOk,ipifOk);
				             		}
			            		} else {
			             			callback(null,parametreipOk,ipifOk);
			             		}
		                 }*/,
		                 function(parametreipOk,ipifOk, callback) {
		             		if (!parametreipOk && testidinspire !=null){
		            			/*si un identifiant existe*/
		            			//alert('getip by id '+testidinspire);
		            			var ipsretourne=app.getipbyid(testidinspire);
		            			//alert('getip by id ='+JSON.stringify(ipsretourne));
		            			var iparray=[];
		            			if (ipsretourne) iparray=ipsretourne.split(';');
		            			var iptrouveok=ipifOk;
		            			
		            			async.map(iparray,function(iptest,callbackip){
		            				var ipapi=iptest;
		            				var portapi=testapiport;
		            				var porthttp=testhttpport;
		            				try {
		            					ipapi=iptest.split(':')[0];
		            					portapi=iptest.split(':')[1];
		            					porthttp=iptest.split(':')[2];
									} catch (e) {
									}
			            			if (!parametreipOk &&
			            					(ipapi!=testiplocal || portapi!=testapiport) &&
			            					(ipapi!=testhttpadresse || portapi!=testapiport)) {
			            				//alert('getip by id test  ='+iptest);
			            				testconnexionserveur(ipapi,portapi,function(idtrouve,status){
			            					//alert('getip by id  ='+JSON.stringify(idtrouve));
			            					if (controleId(idtrouve)) {
				            					parametreipOk=true;
				            					setadresses(protocol,ipapi,portapi,porthttp);
				            				}
			            					callbackip();
			            				});
			            				
			            			} else {
			            				callbackip();
			            			}
		            			},function(err){
		            				callback(null,parametreipOk,iptrouveok);
		            			});
		            		} else {
		             			callback(null,parametreipOk,ipifOk);
		             		}
		                 },
		                 function(parametreipOk,ipifOk, callback) {
		             		if (!parametreipOk && testhttpadresse && testhttpadresse!=''){
		            			/*si adresse distante existe*/
		            			//alert('ipdistant '+testhttpadresse);
	            				testconnexionserveur(testhttpadresse,testapiport,function(idtrouve,status){
	            					//alert('ipdistant  ='+JSON.stringify(idtrouve));
		            				if (controleId(idtrouve)) {
		            					parametreipOk=true;
		            					setadresses(protocol,testhttpadresse,testapiport,testhttpport);
		            				}
		            				callback(null,parametreipOk,ipifOk);
	            				});
		            		} else {
		             			callback(null,parametreipOk,ipifOk);
		             		}
			             }
		             ], function(err, parametreipOk,ipifOk) {
						if (!parametreipOk) {
							setTimeout(function(){
								showAlert('Connexion serveur impossible');
								$('#btnconnection').html("Connexion");},0);
						} else {
							
							callbackfunction();
						}
						
		             });

		
	} else {
		$.getJSON("../config_app_acces.json", function(data){
			httpport=data.httpport;
			apiport=data.apiport;
			if (data.httpportbrowser) httpport=data.httpportbrowser;
			if (data.apiportbrowser) apiport=data.apiportbrowser;
			
			setadresses(window.location.protocol,window.location.hostname,apiport,httpport);
			callbackfunction();
			return true;		
		});

	}

}
function setadresses(protocol,adresseip,apiport,httpport){
	var hostname=adresseip;
	if (hostname && hostname.substr(0,5)=='local') {
		hostname=hostname.substr(5,40);
		//alert('adresse locale validée ' +protocol + '//'+hostname);
	} else {
		//alert('adresse distante validée ' +protocol + '//'+hostname);
	}
	
	
	
	if (adresseip.substr(0,5)=='local'){
		serviceLocal = protocol+"//"+hostname+":"+apiport+"/";
		imagesLocal = protocol+"//"+hostname+":"+httpport+"/";
		pubLocal = protocol+"//"+hostname+":8888/";
		cameraLocal="http://camlocal:81/";
		serviceURL = serviceLocal;
		imagesURL = imagesLocal;
		pubURL = pubLocal;
		cameraURL=cameraLocal;		
		setInfoMemo('iplocal',hostname);
		
	} else {
		serviceHttp = protocol+"//"+hostname+":"+apiport+"/";
		imagesHttp = protocol+"//"+hostname+":"+httpport+"/";
		pubHttp = protocol+"//"+hostname+":8888/";
		cameraHttp="http://"+getInfoMemo('httpadresse','adresse.synology.me')+":81/";
		serviceURL = serviceHttp;
		imagesURL = imagesHttp;
		pubURL = pubHttp;
		cameraURL=cameraHttp;
		setInfoMemo('httpadresse',hostname);	
	}
	setInfoMemo('apiport',apiport);
	setInfoMemo('httpport',httpport);
}
function testconnexionserveur(adresseip,portapi,callback){
	 if (adresseip && adresseip.substr(0,5)=='local') adresseip=adresseip.substr(5,40);
	 var url =protocol+"//"+adresseip+":"+portapi+"/"+'index.php?action=getid&v='+version;
	 
	 var res=_ajax_request_async(
			 url
			, {"data":{}}
	 		,function(data,statustext,jxhr){callback(data,'done',statustext);}
	 		,function(jxhr,statustext,errorcallback){callback(null,'error',statustext);}
	 		,'json'
	 		, 'POST'
	 		,3000);
	 	
	 //alert('testconnexionserveur ='+JSON.stringify(res));

	return res;
	
}


function controleId(data){
	//alert('controle id = '+data.id);
	idactuel=getInfoMemo('idinspire','');
	//alert('actuel id = '+idactuel);
	if (data && data.id){
		if (idactuel!=data.id) {
			var r = confirm("Voulez vous que le compte '"+data.id+ "' devienne le compte par defaut ?");
			if (r) {
				//alert('save id = '+data.id);
				setInfoMemo('idinspire',data.id);
			}
			return r;
		} 
		return true;
	}
	return false;
	
}



//Authentication and Request
function _ajax_requesttest(url, data, callbacksuccess,callbackerror, type, method,timeoutms)

{

    if (jQuery.isFunction(data))
    {
        callback = data;
        data = {};
    }
    var requestTimeoutms=httprequestTimeoutms;
    if (timeoutms) requestTimeoutms=timeoutms;
    return jQuery.ajax({

        type: method,
        url: url,
        data: data,
        //timeout:requestTimeoutms,
        /*utile pour connexion mobile phonegap*/
        beforeSend : function(req) {
     	   //alert( "user "+userlogin+" passwd "+userpassword + " =" +auth);
            req.setRequestHeader('Authorization', auth);
         },
        success: callbacksuccess,
        error: callbackerror,
        dataType: type
    });

}

function _ajax_request(url, data, callback, type, method,timeoutms)

{
	auth = make_base_auth(userlogin, userpassword);

    if (jQuery.isFunction(data))
    {
        callback = data;
        data = {};
    }
    var requestTimeoutms=httprequestTimeoutms;
    if (timeoutms) requestTimeoutms=timeoutms;
    return jQuery.ajax({
        type: method,
        url: url,
        data: JSON.stringify(data),
        //timeout:requestTimeoutms,
        /*utile pour connexion mobile phonegap*/
        beforeSend : function(req) {
     	  // alert( "user "+userlogin+" passwd "+userpassword + " =" +auth);
            req.setRequestHeader('Authorization', auth);
         },
        success: callback,
        error: callback,
        dataType: type

    });

}
function _ajax_request_async(url, data, callbacksuccess,callbackerror, type, method,timeoutms)

{
    auth = make_base_auth(userlogin, userpassword);

    var requestTimeoutms=httprequestTimeoutms;
    if (timeoutms) requestTimeoutms=timeoutms;
    var xhr= jQuery.ajax({
        type: method,
        url: url,
        data: JSON.stringify(data),
        timeout:requestTimeoutms,
        beforeSend : function(req) {
    	  // alert( "user "+userlogin+" passwd "+userpassword + " =" +auth);
           req.setRequestHeader('Authorization', auth);
        },
        success: callbacksuccess,
        error: callbackerror,
        dataType: type
    });

}
function _ajax_request_sync(url, data,  type, method,timeoutms)

{
	//alert('request sync '+url);
    auth = make_base_auth(userlogin, userpassword);
    var requestTimeoutms=httprequestTimeoutms;
    if (timeoutms) requestTimeoutms=timeoutms;
    var res=jQuery.ajax({
        type: method,
        url: url,
        data: JSON.stringify(data),
        //timeout:requestTimeoutms,
        beforeSend : function(req) {
    	  // alert( "user "+userlogin+" passwd "+userpassword + " =" +auth);
           req.setRequestHeader('Authorization', auth);
        },
        dataType: type,
        async:   false
    });
    //alert(JSON.stringify(res));
    if (res.responseJSON) {
    	return res.responseJSON;
	} else if (res.responseText) {
		try {
			return JSON.parse(res.responseText);	
		} catch (e) {
			return res.responseText;
		}
		
	}
    
}

function make_base_auth(user, password)

{
    var tok = user + ':' + password;
    var hash = Base64.encode(tok);
    return "Basic " + hash;
}

//To Extend jQuery use these functions.

jQuery.fn.extend({
    get_: function(url, data, callback, type)
    {
    	//alert('extend get '+url);
        return _ajax_request(url, data, callback, type, 'GET');
    },
    put_: function(url, data, callback, type)
    {
        return _ajax_request(url, data, callback, type, 'PUT');
    },
    post_: function(url, data, callback, type)
    {
        return _ajax_request(url, data, callback, type, 'POST');
    },
    delete_: function(url, data, callback, type)
    {
        return _ajax_request(url, data, callback, type, 'DELETE');
    }
});


/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Base64 = {
 
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = Base64._utf8_encode(input);
 
        while (i < input.length) {
 
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
 
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
 
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
 
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
        }
 
        return output;
    },
 
    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
        while (i < input.length) {
 
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
 
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
 
            output = output + String.fromCharCode(chr1);
 
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
 
        }
 
        output = Base64._utf8_decode(output);
 
        return output;
 
    },
 
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    },
 
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
 
        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
    }
 
}

 
 



   
