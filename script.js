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







$(document).ready(function () {
  $('#fileInput').on('change', function (e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
          var contents = e.target.result;
          var rows = contents.split('\n');
          var newRows = [];
          for (var i = 0; i < rows.length; i++) {
              var row = rows[i].split(',');
              // Eliminar ocurrencias de "000;"
              for (var j = 0; j < row.length; j++) {
                  row[j] = row[j].replace(/000;/g, '');
              }
              // Unir columna dos y tres
              if (row.length >= 3) {
                  row[1] = row[1] + ',' + row[2]; // Unir con una coma
                  row.splice(2, 1);
              }
              // Cambiar comas por puntos y viceversa
              for (var j = 0; j < row.length; j++) {
                  if (row[j].indexOf('.') !== -1) {
                      row[j] = row[j].replace('.', '|'); // Temporalmente cambiar punto por un carácter especial
                      row[j] = row[j].replace(/,/g, '.'); // Cambiar comas por puntos
                      row[j] = row[j].replace('|', ','); // Cambiar el carácter especial por comas
                  } else {
                      row[j] = row[j].replace(',', '.'); // Cambiar puntos por comas
                  }
              }
              // Convertir columna uno de hertz a megahertz
              if (!isNaN(parseFloat(row[0]))) {
                  row[0] = parseFloat(row[0]) / 1000000;
              }
              newRows.push(row.join(','));
          }
          var csvContent = newRows.join('\n');
          // Descargar archivo CSV
          var downloadLink = document.createElement('a');
          downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
          downloadLink.download = 'LeonSonidoVirtualExport.csv';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
      };
      reader.readAsText(file);
  });
});









document.getElementById('csvFileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const text = e.target.result;
          processCSV(text);
      };
      reader.readAsText(file);
  }
});


function processCSV(csvText) {
  // Actualizar para usar comas como delimitador
  const originalDelimiter = ';';
  const newDelimiter = ',';
  const lines = csvText.split('\n');
  const formattedLines = lines.map(line => {
      const columns = line.split(originalDelimiter);
      if (columns.length > 1) {
          // Convertir valor a MHz con punto después de los primeros 3 dígitos y limitar a 4 decimales
          columns[0] = convertToMHz(columns[0]);
      }
      return columns.join(newDelimiter); // Usar la nueva coma como delimitador
  });
  // Preparar datos para exportar con el nuevo delimitador
  window.formattedCSV = formattedLines.join('\n');
}

function convertToMHz(numberString) {
  const cleanedNumberString = numberString.replace('.', '').trim();
  if (cleanedNumberString.length > 3) {
      let result = cleanedNumberString.substring(0, 3) + '.' + cleanedNumberString.substring(3);
      const parts = result.split('.');
      if (parts.length > 1 && parts[1].length > 4) {
          result = parts[0] + '.' + parts[1].substring(0, 4);
      }
      return result;
  }
  return cleanedNumberString;
}



function exportCSV() {
  const blob = new Blob([window.formattedCSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'LeonSonidoVirtualExport.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
