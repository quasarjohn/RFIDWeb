firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	console.log(user);
  	diplayDataInNav(user);

  } else {
  	$('#greeting').addClass('gone');
		$('#avatar').addClass('gone');
		$('#log-in').removeClass('gone');

		window.location = 'login.html'
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