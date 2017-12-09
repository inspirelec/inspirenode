


/*$(document).on("swiperight","#settingListPage",function(){ // When entering pagetwo
	parent.history.back();
});*/

$(document).on('pagecreate', "#settingListPage", function() {
	displaySetting();
});
$(document).on('pageshow', "#settingListPage", function() {
	$("#settingListPage").trigger('pagecreate');
});
$(document).on('pagebeforehide', "#settingListPage", function() {
	refreshacceuil=true;
	refreshtag=true;
	configbytag={};
	app.savesetting();
	if ($('#connectmode').val()=="local") {
		//initconnexiontype(chargeAcceuil);
	} else {
		//initconnexiontype(chargeAcceuil);
	}
});
function displaySetting() {
	reseau=check_network();
	$('#settingList li').remove();
	//$('#settingList').append('<li data-icon="false"><label for="lbldevice">Nom : '+device.name+'</label></li>');
	$('#settingList').append('<li data-icon="false"><label for="lbldevice">Platforme : '+device.platform+'</br>Identifiant : '+device.uuid+'</label></li>');
	
	$('#settingList').append('<li data-icon="false"><label for="lbliplocal">Identifiant inspirathome:</label> <input id="idinspire" type="text" data-mini="true" '
			+'value="'+getInfoMemo('idinspire','')+'" ></li>'		);
	/*$('#settingList').append('<li data-icon="false"><label for="lbliplocal">Adresse ip locale :</label> <input id="iplocal" type="text" data-mini="true" '
			+'value="'+getInfoMemo('iplocal','192.168.1.41')+'" ></li>'	);
	$('#settingList').append('<li data-icon="false"><label for="lblhttpadresse">Domaine par internet :</label><input id="httpadresse" type="text" data-mini="true" '
			+'value="'+getInfoMemo('httpadresse','adresse.synology.me')+'" ></li>'		);*/
	$('#settingList').append('<li data-icon="false"><label for="lblconnexion">Reseau : '+reseau+'</label></li>');
	/*$('#settingList').append('<li data-icon="false"><label for="lbltypeadresse">Mode de connexion :</label><select name="flip-min" id="connectmode" data-role="slider">'+
								'<option value="local">Local</option>'+
								'<option value="distante">Distant</option>'+
							 '</select>');*/
	
	/*$('#settingList').append('<li data-icon="false"><input onClick="app.savesetting();app.initadrs();return false;" id="save" type="button" data-mini="true" '
			+'value="Enregistrer" ></li>'		);*/
	
	$('#settingList').listview('refresh');
	EntetePageTaille("#settingListPage");

	$("#settingListPage").trigger('create');

	if (reseau!='wifi')
	$('#connectmode').val(typeconnexion);
	$('#connectmode').slider('refresh');
};

