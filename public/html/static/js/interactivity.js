
const apisUrl='http://161.189.24.17:3005'
var store_id_sel;
var stores_sel;
var startDateTime='';
var endDateTime='';

function enumerateDaysBetweenDates (startDate, endDate){
	let date = []
	date.push(moment(startDate).format("YYYY-MM-DD"));
	while(moment(startDate) < moment(endDate)){
		startDate = moment(startDate).add(1, 'days').format("YYYY-MM-DD");
		date.push(startDate);
	}
	return date;
}

function enumerateMonthsBetweenDates (startDate, endDate){
	let months = []
	months.push(moment(startDate).format("YYYY-MM"));
	while(moment(startDate).month() < moment(endDate).month()){
		startDate = moment(startDate).add(1, 'month').format("YYYY-MM");
		months.push(startDate);
	}
	return months;
}

$('#date_selector').append($('<input>',{
    placeholder:'select a date: ',
    id: 'input'
}));
$.post(apisUrl + '/get_available_date', function(data, textStatus, jqXHR){
    $('#date_selector').daterangepicker({minDate:moment(data[0].start_date), maxDate:moment(data[0].end_date),timePicker: true, timePicker24Hour: true})
    console.log(textStatus);
    console.log(data);
});

  
$('#date_selector').on('apply.daterangepicker',function(){
    // startDate = $('#date_selector').data('daterangepicker').startDate.format('YYYY-MM-DD');
    // endDate = $('#date_selector').data('daterangepicker').endDate.format('YYYY-MM-DD');
    startDateTime = $('#date_selector').data('daterangepicker').startDate.format('YYYY-MM-DD HH:mm:ss');
    endDateTime = $('#date_selector').data('daterangepicker').endDate.format('YYYY-MM-DD HH:mm:ss');
    $('#input').attr('placeholder', startDateTime+' - '+endDateTime);
});


floorGroup.on('loaded',function(){
    cameraControl.on("picked", function (hit) {  
        store_id_sel=selected_store;
        stores_sel=currentFloorStores;   
        console.log('called!',startDateTime,endDateTime,stores_sel);
    });
})
    