
const apisUrl='http://161.189.24.17:3005'

var startDateTime='';
var endDateTime='';

const heights=[0,120000,240000,360000,480000,600000,720000,-120000,-240000];
const fls=['L1','L2','L3','L4','L5','L6','L7','B1','B2']
keys=[];
const id2height={};
const id2fl={};
const color_platter= ['#630063','#FF0091','#FF7D91','#FFAB91'];

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

var button=$('#button-explode').append($('<button>',{
    id: 'btn-explode',
    class: 'btn btn-primary',
    type: 'button',
    text: '展开'
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
    if (selected_floor){
        console.log(id2fl[selected_floor])
        loadRangeData(startDateTime,endDateTime,id2fl[selected_floor]);
    }
});

floorGroup2.on('loaded',function(){
    for (const [key, value] of Object.entries(floorGroup2.meshes)) {
        keys.push(key)
    }
    for (let i=0;i<keys.length;i++) {
        id2height[keys[i]]=heights[i]
        id2fl[keys[i]]=fls[i]
    }

    button.on('click',function(){
        var text=this.lastChild.innerText
        env.visible=false;
        if (text == '展开'){
            this.lastChild.innerText='收起'
            explode();
        }
        else{this.lastChild.innerText='展开';env.visible=true;contract();}
            
    })
    function explode(){
        console.log('exploded!')
        for (const [key, value] of Object.entries(floorGroup2.meshes)) {
           console.log(key)
           value.position=[0,id2height[key],0]
           console.log(value.position)
        }
    }
    
    function contract(){
        console.log('contracted!')
        for (const [key, value] of Object.entries(floorGroup2.meshes)) {
           value.position=[0,0,0]
        //    console.log(value.position)
        }
    }

    cameraControl.on("picked", function (hit) { 
        console.log('picked!') 
        // console.log(hit.mesh.id)
        if(keys.includes(hit.mesh.id)){
            // console.log("selected floor: ", selected_floor)
            if (startDateTime && endDateTime && selected_floor){
                loadRangeData(startDateTime,endDateTime,id2fl[selected_floor]);
            }
        }
    })

});

function loadRangeData(startDateTime,endDateTime,floor_id){

    console.log("search btwn: ",startDateTime,endDateTime)
    console.log("search floor: ",floor_id)

    $.post(apisUrl + '/get_floor_kpis', {'start_time': startDateTime, 'end_time': endDateTime, 'floor_id': "'"+floor_id+"'"}, function(data, textStatus){
        if (textStatus=='success'){
            console.log('floor data requested!');
            console.log(data)

            console.log(dataWrangle(data))
            createStackedBar(dataWrangle(data)[0],['男性','女性'],'性别比例','bar-chart-gender')
            createStackedBar(dataWrangle(data)[1],['16岁以下','17-30岁','31-45岁','46-60岁','60岁以上'],'年龄比例','bar-chart-age')
            createStackedBar(dataWrangle(data)[2],['体型偏胖','体型正常','体型偏瘦'],'体型比例','bar-chart-body')
            createStackedBar(dataWrangle(data)[3],['光头','长发','其他'],'发型比例','bar-chart-hair')
            createStackedBar(dataWrangle(data)[4],['黑色','其他发色'],'发色比例','bar-chart-hair-color')
            createStackedBar(dataWrangle(data)[5],['戴眼镜','不戴眼镜'],'眼镜比例','bar-chart-glass')
            createStackedBar(dataWrangle(data)[6],['戴帽子','不戴帽子'],'戴帽比例','bar-chart-hat')
        }
        else alert('fail loading data');

    })
}

function dataWrangle(data){
    var enter_cnt=new Array();
    var exit_cnt=new Array();
    var female_cnt=new Array();
    var male_cnt=new Array();
    var age16minus_cnt=new Array();
    var age17to30_cnt=new Array();
    var age31to45_cnt=new Array();
    var age46to60_cnt=new Array();
    // var age60plus_cnt=new Array();
    var bodyfat_cnt=new Array();
    var bodynormal_cnt=new Array();
    var bodythin_cnt=new Array();
    var baldhead_cnt=new Array();
    var longhair_cnt=new Array();
    var otherhair_cnt=new Array();
    var blackhair_cnt=new Array();
    var othercolorhair_cnt=new Array();
    var withglasses_cnt=new Array();
    var noglasses_cnt=new Array();
    var hashat_cnt=new Array();
    var nohat_cnt=new Array();

    data.forEach(d=> {
        enter_cnt.push(parseInt(d.enter_cnt))
        exit_cnt.push(parseInt(d.exit_cnt))
        female_cnt.push(Math.round(parseInt(d.enter_cnt)*d.female))
        male_cnt.push(parseInt(d.enter_cnt)-Math.round(parseInt(d.enter_cnt)*d.female))
        age16minus_cnt.push(Math.round(parseInt(d.enter_cnt)*d.ageless16))
        age17to30_cnt.push(Math.round(parseInt(d.enter_cnt)*d.age17to30))
        age31to45_cnt.push(Math.round(parseInt(d.enter_cnt)*d.age31to45))
        age46to60_cnt.push(Math.round(parseInt(d.enter_cnt)*d.age46to60))
        // age60plus_cnt.push(Math.round(parseInt(d.enter_cnt)*(1-d.age17to30-d.ageless16-d.age31to45-d.age46to60)))
        bodyfat_cnt.push(Math.round(parseInt(d.enter_cnt)*d.bodyfat))
        bodynormal_cnt.push(Math.round(parseInt(d.enter_cnt)*d.bodynormal))
        bodythin_cnt.push(Math.round(parseInt(d.enter_cnt)*d.bodythin))
        baldhead_cnt.push(Math.round(parseInt(d.enter_cnt)*d.hs_baldhead))
        longhair_cnt.push(Math.round(parseInt(d.enter_cnt)*d.hs_longhair))
        otherhair_cnt.push(Math.round(parseInt(d.enter_cnt)*(1-d.hs_baldhead-d.hs_longhair)))
        blackhair_cnt.push(Math.round(parseInt(d.enter_cnt)*d.hs_blackhair))
        othercolorhair_cnt.push(Math.round(parseInt(d.enter_cnt)*(1-d.hs_blackhair)))
        withglasses_cnt.push(Math.round(parseInt(d.enter_cnt)*d.hs_glasses))
        noglasses_cnt.push(Math.round(parseInt(d.enter_cnt)*(1-d.hs_glasses)))
        hashat_cnt.push(Math.round(parseInt(d.enter_cnt)*d.hs_hat))
        nohat_cnt.push(Math.round(parseInt(d.enter_cnt)*(1-d.hs_hat)))
    });

    var enter_tot=enter_cnt.reduce(function(a,b){return a+b},0);
    var exit_tot=exit_cnt.reduce(function(a,b){return a+b},0);
    var female_tot=female_cnt.reduce(function(a,b){return a+b},0);
    var male_tot=male_cnt.reduce(function(a,b){return a+b},0);
    var age16minus_tot=age16minus_cnt.reduce(function(a,b){return a+b},0);
    var age17to30_tot=age17to30_cnt.reduce(function(a,b){return a+b},0);
    var age31to45_tot=age31to45_cnt.reduce(function(a,b){return a+b},0);
    var age46to60_tot=age46to60_cnt.reduce(function(a,b){return a+b},0);
    // var age60plus_tot=age60plus_cnt.reduce(function(a,b){return a+b},0);
    var bodyfat_tot=bodyfat_cnt.reduce(function(a,b){return a+b},0);
    var bodynormal_tot=bodynormal_cnt.reduce(function(a,b){return a+b},0);
    var bodythin_tot=bodythin_cnt.reduce(function(a,b){return a+b},0);
    var baldhead_tot=baldhead_cnt.reduce(function(a,b){return a+b},0);
    var longhair_tot=longhair_cnt.reduce(function(a,b){return a+b},0);
    var otherhair_tot=otherhair_cnt.reduce(function(a,b){return a+b},0);
    var blackhair_tot=blackhair_cnt.reduce(function(a,b){return a+b},0);
    var othercolorhair_tot=othercolorhair_cnt.reduce(function(a,b){return a+b},0);
    var withglasses_tot=withglasses_cnt.reduce(function(a,b){return a+b},0);
    var noglasses_tot=noglasses_cnt.reduce(function(a,b){return a+b},0);
    var hashat_tot=hashat_cnt.reduce(function(a,b){return a+b},0);
    var nohat_tot=nohat_cnt.reduce(function(a,b){return a+b},0);

    return [[female_tot,male_tot],
            [age16minus_tot,age17to30_tot,age31to45_tot,age46to60_tot],
            [bodyfat_tot,bodynormal_tot,bodythin_tot],
            [baldhead_tot,longhair_tot,otherhair_tot],
            [blackhair_tot,othercolorhair_tot],
            [withglasses_tot,noglasses_tot],
            [hashat_tot,nohat_tot]]
}

function createStackedBar(data,categories,title,parentElement){
    $('#'+parentElement).empty();

    var series=[]
    var colors=[]
    // console.log(series)
    for (let i=0;i<data.length;i++){
        var object={
            'name':categories[i],
            'data':[data[i]]
        }
        series.push(object)
        colors.push(color_platter[i])
        // console.log(colors)
    }
    var options = {
            series: series,
            chart: {
            type: 'bar',
            height: 100,
            stacked: true,
            stackType: '100%'
        },

        plotOptions: {
            bar: {
            horizontal: true,
            },
        },
        colors: colors,
        xaxis: {
            categories: [title],
            labels:{
                style:{
                    colors: 'white'
                }
            }
        },
        yaxis: {
            labels:{
                style:{
                    colors: 'white'
                }
            }
        },
        stroke: {
            show: false,
            width: 0.1,
            colors: ['#fff']
          },
        tooltip: {
            y: {
            formatter: function (val) {
                return val
            }
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'middle',
            offsetX: 40,
            labels: {
                colors:'white',
              }
        }
      };

      var chart = new ApexCharts(document.querySelector("#"+parentElement), options);
      chart.render();
}