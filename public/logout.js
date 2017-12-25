function logout() {
	firebase.auth().signOut().then(function() {
  console.log('user signed out');
  document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:8080/RFIDWeb/public/login.html";
	});
}
