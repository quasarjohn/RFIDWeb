$('#search-field').focus();

$('#search-field').keypress(function(e) {
		if(e.which == 13) 
			search();
});

function search() {
	var param = $("#search-field").val();

	if(param.length > 0) {
		//redirect to activation
		localStorage.setItem('student_no', param);
		window.location = 'id-activation.html';
	}
}

$(document).ready(function() {
	 $(".button-collapse").sideNav();
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	console.log(user);
  	diplayDataInNav(user);

  } else {
  	$('#greeting').addClass('gone');
		$('#avatar').addClass('gone');
		$('#log-in').removeClass('gone');

  }
});

function diplayDataInNav(user) {
	console.log('updating');
	

	$('#greeting a').html('Hi, ' + user.displayName.split(' ')[0] + '!');
	$('#avatar img').attr('src', user.photoURL);
	console.log(user.photoURL);
	$('#greeting').removeClass('gone');
	$('#avatar').removeClass('gone');
}