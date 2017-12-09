/**
 * 
 */


module.exports = {
  perso_post: function (data_post,to_host,to_path,to_port,callback,user,password,protocol) {
	  return PostJSONobj(data_post,to_host,to_path,to_port,callback,user,password,protocol);
  },
  perso_postbody: function (data_post,to_host,to_path,to_port,callback,user,password,protocol) {
	  return PostCode(data_post,to_host,to_path,to_port,callback,user,password,protocol);
  },
  perso_get: function (to_host,to_path,to_port,callback,user,password,protocol) {
	  return GetCode(to_host,to_path,to_port,callback,user,password,protocol);
  },
  getipfromid: function (idinspire_or_ip,callback) {
	  return getipfromid(idinspire_or_ip,callback);
  }
};
function getipfromid(idinspire_or_ip,callback){
	var adr=idinspire_or_ip.split('.');
	if (idinspire_or_ip.trim()==""){
		callback(idinspire_or_ip);
	}
	if (adr.length==4 && !isNaN(adr[0]) && !isNaN(adr[1]) && !isNaN(adr[2]) && !isNaN(adr[3])) {
		callback(idinspire_or_ip);
	} else 	if (idinspire_or_ip.toUpperCase()=='LOCALHOST'){
		callback(idinspire_or_ip);
	} else {
		GetCode('www.inspirelec.com','/adr/dnsdynamic.php?getipsfrom='+idinspire_or_ip,80
				,function(err,httpResponse,body){
			//console.error('----'+body+'----')
			if (!body || body.trim()=="") {
				callback(idinspire_or_ip);
			} else {
				var adrs=body.split(';');
				var adrprinc=adrs[0].split(':')[0];
				if (adrprinc.substr(1,5)=="local") {
					adrprinc=adrprinc.substr(5,20);
				}
				callback(adrprinc.substr(1,20));
			}
		})	;
	}
}
function GetCode(to_host,to_path,to_port,callback,user,password,protocol) {
	  if(!protocol) protocol='http';

	  var options = {
			    headers: {'Content-type' : 'application/x-www-form-urlencoded'
			    },
			    url:     protocol+'://'+to_host+':'+to_port+to_path
			  };                                         
	  if (user && password && user!="" && password!=""){
		  options.headers.Authorization =make_base_auth(user,password);
	  
	  }
	  

	  // Set up the request
	// console.log('--------Send request at '+to_host+':'+to_port+to_path );
	  
	  r=global.req.request.get(options,function(err,httpResponse,body){
		  if (callback) {
			callback(err,httpResponse,body);
		  }
	  })
	  return r;
	  /*var post_req = http.request(post_options, function(res) {
	      //res.setEncoding('utf8');
	      req.on('connect', function(res, socket, head) {
	    	    console.log('got connected!');
	      });
	      res.on('response', function (chunk) {
	          console.log('Response: ' + chunk);
	      });
	  });*/
	  //console.log(JSON.stringify(post_req));
	};
function PostCode(data_post,to_host,to_path,to_port,callback,user,password,protocol) {
	if(!protocol) protocol='http';
  var options = {
		    headers: {'content-type' : 'application/x-www-form-urlencoded'},
		    url:     protocol+'://'+to_host+':'+to_port+to_path,
		    body:    JSON.stringify(data_post)
		  };                                         
  if (user && password && user!="" && password!=""){
	  options.headers.authorization =make_base_auth(user,password);
  }
  
	global.req.request.post(options,function(err,httpResponse,body){
		  if (callback) {
			callback(err,httpResponse,body);
		  }
	  })

};
function PostJSONobj(data_post,to_host,to_path,to_port,callback,user,password,protocol) {
	if(!protocol) protocol='http';
  var options = {                 
		  method: 'POST',             
		  url: protocol+'://'+to_host+':'+to_port+to_path,
		  json: {data:data_post},                       
		  headers: { connection: 'keep-alive'}
		};                                         
  if (user && password && user!="" && password!=""){
	  options.headers.authorization =make_base_auth(user,password);
  }

	global.req.request.post(options,function(err,httpResponse,body){
		  if (callback) {
			callback(err,httpResponse,body);
		  }
	  })

};

function make_base_auth(user, password)

{
    var tok = user + ':' + password;
    var hash = Base64.encode(tok);
    return "Basic " + hash;
}

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
