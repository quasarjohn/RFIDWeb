var student_no = localStorage.getItem('student_no_edit');
console.log(student_no);
var edit = false;
var key;
var img_url;

var database = firebase.database();
var ready = true;

$(document).ready(function() { 
	$('.modal').modal();
	loadAutoCompleteData();
	loadData();
});

function loadData() {
	document.getElementById('last-name').focus();

	if(student_no != 0) {
		edit = true;
		console.log('len :' + student_no)
	}
		

	//load student data on the fields if edit is invoked
	if(edit) {
		console.log("LOADING STUDENT DATA for " + student_no);
		loadStudentData();
	}
	else {
		//load student number
		database.ref('student_no').on('value', function(snapshot) {
			student_no = snapshot.val() + 1;
			console.log(student_no);
			$("#student-no").text("Student No: " + student_no);
		});
	}
};

function loadStudentData() {
	database.ref('students').
	orderByChild('student_no').
	equalTo(parseInt(student_no)).on("value", function(snapshot) {
		snapshot.forEach(function(s) {
			var student = s.val();
			key = Object.keys(snapshot.val())[0];

			img_url = student.img_url;
			
			$("#last-name").val(student.last_name);
			$("#last-name").focus();

			$("#first-name").val(student.first_name);
			$("#first-name").focus();

			$("#middle-name").val(student.middle_name);
			$("#middle-name").focus();

			$("#address").val(student.address);
			$("#address").focus();

			$("#phone").val(student.phone_number);
			$("#phone").focus();

			$("#birth-date").val(student.birth_date);
			$("#birth-date").focus();

			$("#civil-status").val(student.civil_status);
			$("#civil-status").focus();

			$("#nationality").val(student.nationality);
			$("#nationality").focus();

			$("#section").val(student.section);
			$("#section").focus();

			$("#program").val(student.program);
			$("#program").focus();

			$("#year").val(student.year);
			$("#year").focus();

			$("#guardian").val(student.guardian_name);
			$("#guardian").focus();

			$("#guardian-phone").val(student.guardian_phone);
			$("#guardian-phone").focus();

			$("#guardian-address").val(student.guardian_address);
			$("#guardian-address").focus();

			$('#last-name').focus();
		});
	});
}

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

		$('#save_modal').modal('open');

	}else {
		Materialize.toast('Make sure no field is empty.', 2000)
	}

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

		//if not edit, push new student
		if(!edit) {
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
		}
		//edit existing student
		else {
			database.ref('students/' + key).set({
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
				student_no: parseInt(student_no),
				img_url: img_url
			});

			localStorage.setItem('student_no', student_no);
			window.location = 'id-activation.html'
		}
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

function loadAutoCompleteData() {
	database.ref('programs').on('value', function(snapshot) {
		$('#program').autocomplete({
		  data: snapshot.val(),
		  limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
		  onAutocomplete: function(val) {
		  	setTimeout(function() {
		  		$('#year').focus();
		  	}, 100);
		  },
		  minLength: 0, // The minimum length of the input for the autocomplete to start. Default: 1.
		});
	});

	$('#section').focus(function(){
		var program = $('#program').val();

		database.ref('sections/' + program).on('value', function(snapshot) {
			$('#section').autocomplete({
		    data: snapshot.val(),
		    limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
		    onAutocomplete: function(val) {
		      setTimeout(function() {
		  		$('#name').focus();
		  	}, 100);
		    },
		    minLength: 0, // The minimum length of the input for the autocomplete to start. Default: 1.
			})
		})
	});
}

function validateInput() {
	
}

