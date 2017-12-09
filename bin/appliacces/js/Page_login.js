/**
 * 
 */

$(document).on("pagecreate","#loginPage",function(){ // When entering pagetwo
	//alert('lastlogin: ' + getInfoMemo('lastlogin',"z"));
	//alert('lastpassword: ' + getInfoMemo('lastpassword',"z"));
	/*if (typeof device == "undefined"){
		serviceLocal = window.location.protocol+"//"+window.location.hostname+":1348/";
		serviceHttp = window.location.protocol+"//"+window.location.hostname+":1348/"; 
		imagesHttp = window.location.protocol+"//"+window.location.hostname+":1349/";
		imagesLocal = window.location.protocol+"//"+window.location.hostname+":1349/";
		pubLocal = window.location.protocol+"//"+window.location.hostname+":8888/";
		pubHttp = window.location.protocol+"//"+window.location.hostname+":8888/";
		serviceURL = serviceLocal;
		imagesURL = imagesLocal;
		pubURL = pubLocal;
		//cameraURL=cameraLocal;
	}*/
	
	
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	if ( app ) {
	    // PhoneGap application
	    $('#un').val(getInfoMemo('lastlogin',""));
		$('#pw').val(getInfoMemo('lastpassword',""));	
		//alert('chargement login='+getInfoMemo('lastlogin',"")+" passwd="+getInfoMemo('lastpassword',""));
		//$('[type="checkbox"]').checkboxradio();		
		if (getInfoMemo('savepw','')==true || getInfoMemo('savepw','')=='true' ) {
			//alert('check savepw');
			$('#savepw').prop('checked', true).checkboxradio("refresh");;
		} else {
			//alert('uncheck savepw');
			$('#savepw').prop('checked', false).checkboxradio("refresh");;
			
		}

	} else {
	    // Web page
	    //chargeAcceuil();
	}
	if (traductionactive) {
		var widthcolumn=100/traductions.langues.length;
		var html_l='';
		for (t in traductions.langues){
				html_l+='<div style="width:'+widthcolumn+'%;float: left;"><input type="radio" name="radio-choice" id="radio-'+traductions.langues[t].code+'" value="'+traductions.langues[t].code+'"/>'+
	     		'<label for="radio-'+traductions.langues[t].code+'">'+traductions.langues[t].name+
	     		'<img id="icon" style = "float:right;" src="img/'+traductions.langues[t].icon+'" height="30" />'+
	     		'</label></div>'
		}
		html_l+="";
		var controlgroup=$("#loginPage").find("#langues");
		controlgroup.html($(html_l));
		$("#loginPage").trigger('create');
		//controlgroup.controlgroup( "refresh" );
		$("#loginPage").find("#langues").find("input[type='radio']").bind( "change", function(event, ui) {
			// event.currentTarget.value;
			 $.i18n().locale= event.currentTarget.value;
			 $( '[data-role="page"]' ).i18n();
			});
		
		var lang=$.i18n().locale
		
		$("input[type=radio]").attr("checked",false).checkboxradio("refresh");
		$("#radio-"+lang).attr("checked",true).checkboxradio("refresh");
		$.i18n().load(traductions).done(
			function() {
				$( '[data-role="page"]' ).i18n();
			} );

	}

	
    //$("#pub").get(0).play();
    //$("#pub").get(0).play();
	//navigator.splashscreen.hide();
});

	function gotFS(fileSystem) {
	    alert("got filesystem");
	    // save the file system for later access
	    alert(fileSystem.root.fullPath);
	    window.rootFS = fileSystem.root;
	}
	function fail(){
		
	}
function testdownload(){
	

        DownloadFile();
}

/*$(document).on("pageshow","#loginPage",function(){ // When entering pagetwo
	
	//navigator.splashscreen.hide();
	alert('show login');
	
	
});*/

