function getConfig(callbackfunction) { 
	
	var urljsonlist='index.php?action=configappli'+'&v='+version; 
	//alert(urljsonlist);
	getJsonObject(function(data){callbackfunction(data);},urljsonlist);
	
}
function getPeriphsByTagName(callbackfunction,tagname) {
	var urljsonlist='index.php?action=allconfiglite&tagname='+tagname+'&v='+version; 
	//alert(urljsonlist);
	if(configbytag[tagname]!=null){
		callbackfunction(configbytag[tagname]);
	} else {
		getJsonObject(function(data){configbytag[tagname]=data;callbackfunction(data);},urljsonlist);
	}	
}

function getPeriphsByTagUuid(callbackfunction,taguuid) { 
	
	var urljsonlist='index.php?action=allconfiglite&taguuid='+taguuid+'&v='+version; 
	//alert(urljsonlist);
	if(configbytag[taguuid]!=null){
		callbackfunction(configbytag[taguuid]);
	} else {
		getJsonObject(function(data){configbytag[taguuid]=data;callbackfunction(data);},urljsonlist);
	}
	
}

function getModes(callbackfunction) { 
	
	var urljsonlist='index.php?action=allmodes'+'&v='+version; 
	//alert(urljsonlist);
	getJsonObject(function(data){callbackfunction(data);},urljsonlist);
	
}
function getTagsEnfant(callbackfunction,taguuid) { 
	
	var urljsonlist='index.php?action=alltag&batiment_uuid='+taguuid+'&v='+version; 
	//alert(urljsonlist);
	getJsonObject(function(data){callbackfunction(data);},urljsonlist);
	
}

function getEtatPeriphs(callbackfunction,md5_etatcheck) { 
	//var urldebuglink='index.php?action=getetat&lastetat='+md5_etatcheck;
	var urldebuglink='index.php?action=getetat&updateTime='+md5_etatcheck+'&v='+version; 
	//alert('getetat</br>'+urldebuglink);
	//alert(urljsonlist);
	getJsonObject(callbackfunction,urldebuglink);
	
}


function getEtatPeriphsSpeed(callbackfunction) { 
	var urldebuglink='command_externe/php_etat_instantane.php'; 
	//alert('getetat</br>'+urldebuglink);
	getJsonObject(callbackfunction,urldebuglink);
	
	
}

