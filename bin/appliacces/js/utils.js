generateUUID = function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getInfoMemo(key,valdefault){
	
	if (window.localStorage.getItem(key)==null) {
		setInfoMemo(key, valdefault);
		return valdefault;
	} else {
		return window.localStorage.getItem(key);
	}
}

function setInfoMemo(key,valeur){
	
	window.localStorage.setItem(key, valeur);

}
function isitdevice(){
	return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
}
function findobjinarray(array,propertie,value){
	
	for (e in array){
		var obj=array[e];
		if(obj[propertie] && obj[propertie]==value){
			return array[e];
		}
	}
	return null;
}
function EntetePageTaille(pageelement){
	
	if (typeof device != "undefined" && device.platform!="Android"){
		$( pageelement ).find("#entete").children().css( "margin-top", "20px" );
	} else {
		$( pageelement ).find('#settingbutton').hide();
	}
}