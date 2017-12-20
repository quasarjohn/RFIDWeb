var database = firebase.database();

//listens to new inserts to attendance and shows data on screen
initDataListener();
initRfidWriter();

function initRfidWriter() {

	var date = new Date();
	$('#time').text(formatAMPM(date));
	$('#date').text(formatDate(date));


	//update time every 1 minute
	setInterval(function() {
		var date = new Date();
		$('#time').text(formatAMPM(date));
	}, 1000);

	$('#data_progress').hide();

	setInterval(function() {
		document.getElementById('rfid_input').focus();
	}, 1000);

	$('#rfid_input').on('input', function() {
		var rfid = $(this).val();
		if(rfid.toString().length >= 10) {
			$('#data_progress').show();

			var ref = database.ref('students').orderByChild('rfid').equalTo(rfid);

			ref.once('value')
			  .then(function(snapshot) {
			  	var size = 0;
			  	var student; 
			    snapshot.forEach(function(s) {
			    	student = s.val();
			    	size++;
			    });

					if(size > 0) {
					
						// sendSMS(student);
						writeAttendance(student);
					}
					else {
						$('#name').text("INVALID ID!");
						$('#program').text('');
						$('#year').text('');
						$('#section').text('');
					}

					$('#data_progress').hide();
					document.getElementById("rfid_input").value = null;
				  });
		}
	});
}

function initDataListener() {
	database.ref('attendance').orderByChild('time_stamp').startAt(Date.now()).
	on('child_added', function(snapshot) {

		var student_no = snapshot.val().student_no;
		var time_stamp = snapshot.val().time_stamp;

		var ref = database.ref('students').orderByChild('student_no').equalTo(student_no);
		ref.once('value').then(function(snapshot) {
				snapshot.forEach(function(s) {
					var student = s.val();
					console.log(student);

					var date = new Date(time_stamp);
					// date.setUTCSeconds(time_stamp);

					$('#time_in').text('TIME IN: ' + formatAMPM(date));

					$('#name').text(student.last_name + ", " + student.first_name + " " + student.middle_name);
					$('#program').text('Program: ' +student.program);
					$('#year').text('Year: ' + student.year);
					$('#section').text('Section: ' + student.section);
				})
		}); 
	});


}

function sendSMS(student) {
	var number = student.guardian_phone;

	var message = student.first_name + " just came to school";

	var params = "1="+number +"&2=" + message +"&3=TR-GILBE543398_8GQWC"
	var xhr = requestJson("https://www.itexmo.com/php_api/api.php", params);
	xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(xhr.readyState == 4 && xhr.status == 200) {
        alert(xhr.responseText);
    }
	}
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + day +  ', ' + year;
}

function requestJson(url, params) {
    var xhr = new window.XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.send(params);

    return xhr;
}

function writeAttendance(student) {
	database.ref('attendance').push().set({
		student_no : student.student_no,
		rfid : student.rfid, 
		time_stamp : new Date().getTime()
	})
}