
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

$('#datetime-body').append($('<input>',{
    placeholder:'选择日期时间: ',
    id: 'input'
}));
$.post(apisUrl + '/get_available_date', function(data, textStatus, jqXHR){
    $('#datetime-body').daterangepicker({minDate:moment(data[0].start_date),
                                         maxDate:moment(data[0].end_date),
                                         timePicker: true, 
                                         timePicker24Hour: true,
                                         alwaysShowCalendars: false})
    console.log(textStatus);
    console.log(data);
});

  
$('#datetime-body').on('apply.daterangepicker',function(){
    startDateTime = $('#datetime-body').data('daterangepicker').startDate.format('YYYY-MM-DD HH:mm:ss');
    endDateTime = $('#datetime-body').data('daterangepicker').endDate.format('YYYY-MM-DD HH:mm:ss');
    $('#input').attr('placeholder', startDateTime+' - '+endDateTime);
});
6

floorGroup.on('loaded',function(){
    cameraControl.on("picked", function (hit) {  
        stores_sel=currentFloorStores;
        if  (stores_sel.includes(hit.mesh.id)){
            store_id_sel=hit.mesh.id
        }
        
        if (store_id_sel){
            loadRangeData(startDateTime,endDateTime,'玩塾');
        }
        // console.log('called!',store_id_sel);
    });
})

function loadRangeData(startDateTime,endDateTime,store_id){

    console.log('store: ', store_id)
    console.log("search btwn: ",startDateTime,endDateTime)

    $.post(apisUrl + '/get_store_kpis2', {'start_time': startDateTime, 'end_time': endDateTime, 'store_id': store_id}, function(data, textStatus, jqXHR){
        if (textStatus=='success'){
            console.log('data requested!');
            console.log(data)

            createRadarChart(data)
        }
        else alert('fail loading data');

    })
}

function createRadarChart(data){
    $('#radar-chart').empty();

    var enter_cnt=new Array();
    var exit_cnt=new Array();
    var watcher_cnt=new Array();
    var passer_cnt=new Array();

    data.forEach(d=> {
        enter_cnt.push(parseInt(d.enter_cnt))
        exit_cnt.push(parseInt(d.exit_cnt))
        watcher_cnt.push(parseInt(d.watcher_cnt))
        passer_cnt.push(parseInt(d.passer_cnt))
    });

    var enter_tot=enter_cnt.reduce(function(a,b){return a+b},0);
    var exit_tot=exit_cnt.reduce(function(a,b){return a+b},0);
    var passer_tot=passer_cnt.reduce(function(a,b){return a+b},0);
    var watcher_tot=watcher_cnt.reduce(function(a,b){return a+b},0);

    var options = {
        series: [{
        name: 'Series 1',
        data: [(enter_tot/passer_tot*100).toFixed(1), (exit_tot/passer_tot*100).toFixed(1), (watcher_tot/passer_tot*100).toFixed(1)],
    }],
        chart: {
        height: 320,
        type: 'radar',
    },
    dataLabels: {
        enabled: true
    },
    plotOptions: {
        radar: {
        size: 140,
        polygons: {
            strokeColors: '#e9e9e9',
            fill: {
            colors: ['#f8f8f8', '#fff']
            }
        }
        }
    },
    title: {
        text: '店铺评级'
    },
    colors: ['#FF4560'],
    markers: {
        size: 4,
        colors: ['#fff'],
        strokeColor: '#FF4560',
        strokeWidth: 2,
    },
    // tooltip: {
    //     y: {
    //     formatter: function(val) {
    //         return val
    //     }
    //     }
    // },
    xaxis: {
        categories: ['进客率(%)', '出客率(%)', '观望率(%)']
    },
    yaxis: {
        min: 0,
        max: 50,
        tickAmount: 8,
        labels: {
        formatter: function(val, i) {
            if (i % 2 === 0) {
            return val
            } else {
            return ''
            }
        }
        }
    }
    };

    var chart = new ApexCharts(document.querySelector("#radar-chart"), options);
    chart.render();}






    