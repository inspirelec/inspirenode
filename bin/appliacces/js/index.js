/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var ready=false;

var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("resume", this.onResume, false);
        //if ((device!=null && device.platform!="Android")) {
        //}
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	ready=true;
        app.receivedEvent('deviceready');
    },
    onResume: function() {
    	
    	navigator.app.exitApp();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    	//check_network();
    	//showAlert("testmsg","titre");
    	//deviceInfo();
    	//show_pic();
    	//beep();
    	//vibrate();
    	/*
    	         window.localStorage.removeItem("key");
        window.localStorage.setItem("key2", "value2");
        */
    	//this.initadrs();

    	
    	EntetePageTaille("#loginPage")
    	/*if (device!=null && device.platform!="Android"){
    		$( "#entete" ).children().css( "margin-top", "20px" );
    	}*/
    	//window.localStorage.clear();
    	//displaySetting();
    	
    	//initadrs();

    	//testconnexion(serviceLocal+'index.php?action=checkconfig');
    	//testconnexion(servicURL+'index.php?action=checkconfig');
    	/*$.('#tagListPage').trigger({
    		type: "eventRefreshTags",
    		message: "Hello World!",
    		time: new Date()
    	});*/

    },
    
    savesetting : function(){
    	setInfoMemo('idinspire',$('#idinspire').val());
    	setInfoMemo('iplocal','192.168.1.41');
    	app.getipbyid($('#idinspire').val()); 

    	//showAlert("Configuration enregistr�e","Info");
    	
    },
    
    getipbyid : function(id){
    	//alert('get ip inspirelec='+id);
    	_ajax_request_sync('http://www.inspirelec.com/adr/dnsdynamic.php?getipfrom='+id, null, 
    			function(data){
    				//alert('ip='+data);
    		    	setInfoMemo('httpadresse',data);
    			}, 'text', 'GET');
    }
    
};



