document.getElementById('csvFile').addEventListener('change', handleFile, false);

function handleFile(e) {
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var contents = e.target.result;
    processData(contents);
  };
  reader.readAsText(file);
}

function processData(csv) {
  var lines = csv.split('\n');
  var data = [];
  for (var i = 0; i < lines.length; i++) {
    var values = lines[i].split(',');
    var x = parseFloat(values[0]);
    var y = parseFloat(values[1]);
    data.push({ x: x, y: y });
  }
  drawChart(data);
}

function drawChart(data) {
  var xData = data.map(function (d) {
    return d.x;
  });
  var yData = data.map(function (d) {
    return d.y;
  });

  var trace = {
    x: xData,
    y: yData,
    mode: 'lines',
    type: 'scatter'
  };

  var layout = {
    title: 'Espectro de RF',
    xaxis: {
      title: 'Frecuencia'
    },
    yaxis: {
      title: 'dBm'
    },
    zoom: {
      enabled: true
    }
  };

  var plotData = [trace];
  Plotly.newPlot('chart', plotData, layout);
}
