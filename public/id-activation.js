document.getElementById('search-field').focus();

var student_no = localStorage.getItem("student_no");
localStorage.setItem("student_no", "");
var student_uid; 
var database = firebase.database();

init();
//when the page loads, try to search for a student
searchStudent();

function searchStudentLocal() {
	student_no = $('#search-field').val().toString();
	searchStudent();
}

function searchStudent() {
	// search only if student_no is not empty
	if (student_no.length > 0) {
		$('#search-field').val(student_no);
		$('#data_progress').removeClass('hidden');

		database.ref('students').
		orderByChild('student_no').
		equalTo(parseInt(student_no)).
		on('value', function(snapshot) {
			snapshot.forEach(function(s) {
				var student = s.val();
				student_uid = s.key;
				console.log(s.key);
				$("#name").text(student.last_name + ", " + student.first_name + " " + student.middle_name);
				$('#program').text('Program: ' + student.program);
				$('#year').text("Year Level: " + student.year);
				$('#section').text('Section: ' + student.section);
				$('#guardian').text("Guardian: " + student.guardian_name);
				$('#phone').text("Phone Number: " + student.guardian_phone);
				$('#address').text("Address: " + student.guardian_address);
				$('#student_no').text(student.student_no);

				$('#content').removeClass('hidden');
			});
			
			localStorage.setItem("student_no", "");
			$('#data_progress').hide();
		});
	}
}

$(document).ready(function() { $('.modal').modal(); });

function init() {

	$('#search-field').keypress(function(e) {
		if(e.which == 13) 
			searchStudentLocal();
	}) 

	if(student_no.length == 0)
		$('#content').addClass('hidden');
	
	$('#data_progress').addClass('hidden');
	$("#fingerprint").click(function() {
		$("#modal1").modal('open');
		document.getElementById('rfid_input').focus();
		//make sure the field does not lose focus
		setInterval(function() {
		document.getElementById('rfid_input').focus();
		}, 1000);

		$('#rfid_input').on('input', function() {
			var rfid = $(this).val();
			if(rfid.toString().length >= 10) {
				console.log(rfid);

				//TODO, first check if the ID has already been registered to another student

				updateRfid(student_uid, rfid);

				document.getElementById("rfid_input").value = null;

				setTimeout(function() {
					$("#modal1").modal('close');
				}, 1000);
			}
		});
	});
}

function updateRfid(uid, rfid) {
	database.ref('students/' + uid + "/rfid").set(rfid);
}

function disableRfid() {
	database.ref('students/' + student_uid + "/rfid").set('0');
}

function edit() {
	console.log("STUDENT NO: " + student_no)
	localStorage.setItem("student_no_edit", student_no);
	window.location = 'add-student.html';
}