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
		window.location = 'id-activation.html'
	}
}