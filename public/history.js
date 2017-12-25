var picker;
var selected_date = formatDate(new Date());
var database = firebase.database();

$(document).ready(function() {

  $(".button-collapse").sideNav();

	$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 80, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: true // Close upon selecting a date,
  });

  var $input = $('.datepicker').pickadate();
	picker = $input.pickadate('picker');
	picker.on('open', function() {
	    console.log('Opened.. and here I am!');
	});
	picker.on('close', function() {
		var datepicker = $('#date-picker');
		if(datepicker.val != null && datepicker.val().length != 0)
			selected_date = datepicker.val();
	  loadData();
	});

	loadData();
});

function chooseDate() {
	event.stopPropagation();
	picker.open();
}

function loadData() {
  $('#table-body tr').remove();

  console.log('loading data')

	$('#selected_date').html(selected_date);

	database.ref('attendance').orderByChild('string_date').
	equalTo(selected_date).on('child_added', function(snapshot) {
		addRow(snapshot.val());
	}); 
}

function addRow(data) {

	database.ref('students').orderByChild('student_no').
	equalTo(data.student_no).once('child_added').then(function(student) {
		var s = student.val();

		var full_name = s.last_name + ", " + s.first_name + " " + s.middle_name;
		var time = formatAMPM(new Date(data.time_stamp))

		$('#table-body').append('<tr>' +
            '<td>' + full_name + '</td>' +
            '<td>' + data.student_no + '</td>' +
            '<td>' + s.program + '</td>' +
            '<td>' + s.section + '</td>' +
            '<td>' + s.year + '</td>' +
            '<td>' + time + '</td>' +
          '</tr>')	
	}); 
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

  return day + ' ' + monthNames[monthIndex] +  ', ' + year;
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

