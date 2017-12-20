var database = firebase.database();
var student_no = 1000;
var ready = true;

$(document).ready(function() { $('.modal').modal(); });
loadData();

function loadData() {

	document.getElementById('last-name').focus();

	//load student number
	database.ref('student_no').on('value', function(snapshot) {
		student_no = snapshot.val() + 1;
		console.log(student_no);
		$("#student-no").text("Student No: " + student_no);
	});

};

$("#save_btn").click(function() {
	//adds student to database

	ready = true;

	var last_name = $("#last-name").val();
	var first_name = $("#first-name").val();
	var middle_name = $("#middle-name").val();
	var address = $("#address").val();
	var phone_number = $("#phone").val();
	var birth_date = $("#birth-date").val();
	var civil_status = $("#civil-status").val();
	var nationality = $("#nationality").val();
	var section = $("#section").val();
	var program = $("#program").val();
	var year = $("#year").val();
	var guardian_name = $("#guardian").val();
	var guardian_phone = $("#guardian-phone").val();
	var guardian_address= $("#guardian-address").val();

	var fields = [last_name, first_name, middle_name, address, phone_number, 
								birth_date, civil_status, nationality, section, program, year, 
								guardian_name, guardian_phone, guardian_address];

	fields.forEach(function(field) {
		if(field.length == 0) {
			ready = false;
		}
	});

	if(ready) {
		$('#title').text('Save Data?')
		$('#subtitle').text('Make sure you have double checked the data before saving it.');
		$('#action').text('SAVE');
	}else {
		$('#title').text('Unable to save.')
		$('#subtitle').text('Make sure no field is empty.');
		$('#action').text('OKAY');
	}

	$('#save_modal').modal('open');

});


function saveData() {
	
	var last_name = $("#last-name").val();
	var first_name = $("#first-name").val();
	var middle_name = $("#middle-name").val();
	var address = $("#address").val();
	var phone_number = $("#phone").val();
	var birth_date = $("#birth-date").val();
	var civil_status = $("#civil-status").val();
	var nationality = $("#nationality").val();
	var section = $("#section").val();
	var program = $("#program").val();
	var year = $("#year").val();
	var guardian_name = $("#guardian").val();
	var guardian_phone = $("#guardian-phone").val();
	var guardian_address= $("#guardian-address").val();

	if(ready) {
		database.ref('students').push({
		last_name: last_name,
		first_name: first_name,
		middle_name: middle_name,
		address: address,
		phone_number: phone_number,
		birth_date: birth_date,
		civil_status: civil_status,
		nationality: nationality,
		section: section,
		program: program,
		year: year,
		guardian_name: guardian_name,
		guardian_phone: guardian_phone,
		guardian_address: guardian_address,
		date_added: new Date().getTime(), 
		student_no: student_no
	});

	database.ref('rfid/' + student_no).set(0);
	database.ref('student_no').set(student_no);

	clearFields();
	}
}

function clearFields() {
	$("#last-name").val("");
	$("#first-name").val('');
	$("#middle-name").val('');
	$("#address").val('');
	$("#phone").val('');
	$("#birth-date").val('');
	$("#civil-status").val('');
	$("#nationality").val('');
	$("#section").val('');
	$("#program").val('');
	$("#year").val('');
	$("#guardian").val('');
	$("#guardian-phone").val('');
	$("#guardian-address").val('');

	document.getElementById('last-name').focus();
}


