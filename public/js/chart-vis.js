// Any of the following formats may be used
function get_footfall(){
	$.getJSON("/static/json/footfall.json", function(json) {

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var windowWidth = canvas.width = '100%';
		var windowHeight = canvas.height = '200px';
		$('#chart-container').append(canvas);
		json = {'data': json, label: 'J16', borderColor: 'grey'}
		var myLineChart = new Chart(context, {
		    type: 'line',
		    data: {
		        datasets: [json]
		    },
			options: {
				scales: {
					xAxes: [{
				    	type: 'time'
					}]
				}
			}
		});
		console.log(json)

// var s1 = {
//   label: 's1',
//   borderColor: 'blue',
//   data: [
//     { x: '2017-01-06 18:39:30', y: 100 },
//     { x: '2017-01-07 18:39:28', y: 101 },
//   ]
// };

// var chart = new Chart(context, {
//   type: 'line',
//   data: { datasets: [s1, s2] },
//   options: {
//     scales: {
//       xAxes: [{
//         type: 'time'
//       }]
//     }
//   }
// });

	});
}

