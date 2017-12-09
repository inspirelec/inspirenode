$(document).on("pageshow","#startPage",function(){ // When entering pagetwo

	//navigator.splashscreen.hide();

	window.history.replaceState( {} , 'login', 'main.html#loginPage' );
	
});