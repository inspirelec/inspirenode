

   var urlgetuser='index.php?action=getuser'
   var utilisateurmodif=null;
	   
   function chargeUserListPage() {
	   $.getJSON(serviceURL + urlgetuser, chargeuser);
   };
   
   function chargeuser(usrs){
	  users=usrs;
	  $.mobile.changePage( $("#settingUser"), { transition: "slide"});

   }
   
   
   function adduser(){
	   
	   u={};
	   
	   u['name']=$('#setusername').val();
	   u['password']=$('#setuserpassword').val();
	   u['phone']=$('#setuserphone').val();
	   u['mail']=$('#setusermail').val();
	   u['alarme_phone']=$('#setuserphonealarme').prop("checked");;
	   u['alarme_mail']=$('#setusermailalarme').prop("checked");;
	   u['uuid']=calcMD5(u['password']+'__'+u['name']);
	   
	   
	   
	   if (typeof users[u['uuid']] == "undefined") {
		   users[u['uuid']]=u;
		   sendusertoserver(u,'adduser')
	       refreshlistuser();
	   }
	   videuser();
		$("#savebtn").hide();
		$("#addbtn").show();
   }
   
   function updateuser(){
	   
	   u={};
	   
	   u['name']=$('#setusername').val();
	   u['password']=$('#setuserpassword').val();
	   u['phone']=$('#setuserphone').val();
	   u['mail']=$('#setusermail').val();
	   u['alarme_phone']=$('#setuserphonealarme').prop("checked");;
	   u['alarme_mail']=$('#setusermailalarme').prop("checked");;
	   u['uuid']=utilisateurmodif.uuid;
	   
	   	   
	   /*if (typeof users[u['uuid']] != "undefined") {*/
		   users[u['uuid']]=u;
		   sendusertoserver(u,'modifuser')
	       refreshlistuser();
	   /*}*/
	   videuser();
		$("#savebtn").hide();
		$("#addbtn").show();
   }
   
   function videuser(){
	   $('#setusername').val("");
	   $('#setuserpassword').val("");
	   $('#setuserphone').val("");
	   $('#setusermail').val("");
	   $('#setusermailalarme').prop("checked", false).checkboxradio('refresh');
	   $('#setuserphonealarme').prop("checked", false).checkboxradio('refresh');
		$("#savebtn").hide();
		$("#addbtn").show();
   }
   function refreshlistuser(){
	   $('#userlist li').remove();
	   $('#userlist').append('<li data-role="list-divider">Utilisateurs</li>');
	   $.each(users, function(indexp, u) {
		   info="";
		   if (typeof u.phone !="undefined" && u.phone!=""){
			   info="tel:   "+ u.phone;
			   if (u.alarme_phone==true || u.alarme_phone=="true") info += "       (avec notification alarme)";
		   }
		   if (typeof u.mail !="undefined" && u.mail!=""){
			   info=info+ "</br>"+"email: "+ u.mail;
			   if (u.alarme_mail==true || u.alarme_mail=="true") info += "       (avec notification alarme)";
		   }
		   $('#userlist').append('<li><a href="#" onclick="modifuser(\''+indexp+'\');return false;">'+u.name+'<h6 id="info" style="font-size: 9px">'+info+'</h6></a><a href="#" onclick="deleteuser(\''+indexp+'\');return false" data-rel="popup" data-position-to="window" data-transition="pop">delete</a></li>');				   
	   });
	  // $('#userlist').append('<li><a href="#" onclick="adduser();return false;">Ajouter</a></li>');
	   $('#userlist').listview('refresh');
   }
   
   function deleteuser(uuid){
	   confirmpassword(uuid,deleteusr,'deleteuser');
   }
   
   function deleteusr(uuid){
	   delete users[uuid];
	   refreshlistuser();
		$("#savebtn").hide();
		$("#addbtn").show();
   }
   
   function modifuser(uuid){
	   confirmpassword(uuid,modifusr,'modifuser');
   }
   
   function modifusr(uuid){
	   u=users[uuid];
	   $('#setusername').val(u['name']);
	   $('#setuserpassword').val(/*u['password']*/"");
	   $('#setuserphone').val(u['phone']);
	   $('#setusermail').val(u['mail']);
	   if ( u['alarme_mail']==true || u['alarme_mail']=='true') 
		   $('#setusermailalarme').prop("checked", true).checkboxradio('refresh');
	   else
		   $('#setusermailalarme').prop("checked", false).checkboxradio('refresh');
	   if ( u['alarme_phone']==true || u['alarme_phone']=='true') 
		   $('#setuserphonealarme').prop("checked", true).checkboxradio('refresh');
	   else
		   $('#setuserphonealarme').prop("checked", false).checkboxradio('refresh');
	   utilisateurmodif=u;
		$("#addbtn").hide();
		$("#savebtn").show();
   }
   
   
   function confirmpassword(uuid,callbackfunction,action){
	   pass=prompt("Mot de passe","________");
	   var urljsonaction='index.php?action='+action+'&uuid='+uuid+'&password='+pass; 
	   $.getJSON(serviceURL + urljsonaction,function(data){
		   if (data.res=='OK') {
			   callbackfunction(uuid);
		   } else {
			   alert('Erreur de mot de passe');
		   }
	   });
   }
   
   
   
   function sendusertoserver(user,action){
		
		/*test={};
		test.tutu="coucou";
		test.toto={};
		test.toto.ti=new Array();
		test.toto.ti.push(10);*/
	   var urlpostuser='index.php?action='+action; 
		use={};
		use.user=user;
		$.post(serviceURL + urlpostuser, use, function(response) {
			rep=response;
		}, 'json');
		
		//alert('envoi de la programmation au server');
	}