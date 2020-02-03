// Any of the following formats may be used
var ctx = $('#footfall-chart');
var canvas = document.createElement('canvas');
var firstblock = $('#chart-container');
var context = canvas.getContext('2d');
var windowWidth = canvas.width = window.innerWidth;
var windowHeight = canvas.height = window.innerHeight;

var myLineChart = new Chart(context, {
    type: 'line',
    data: data,
    options: {}
});

