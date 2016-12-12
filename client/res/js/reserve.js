'use strict'
var $ = require('jquery')
require('fullCalendar')
require('moment')

$('#reservaForm').on('submit', function (e) {
  e.preventDefault()
  var formData = $('#reservaForm').serializeArray()
  var jsonData = {
    dia: formData[0].value.split('-')[0],
    mes: formData[0].value.split('-')[1],
    anio: formData[0].value.split('-')[2],
    hora: formData[1].value,
    experimento: $('#experimentsSelector').val(),
  }
  var jsonData2 = JSON.stringify(jsonData)
  $.ajax({
    url: '/users/reserve',
    cache: false,
    type: 'POST',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    data: jsonData2,
    dataType: 'json',
    contentType: 'application/json',
    success: function (json) {
      $('#reservaResponse').html(
        '<p>Reserva realizada para:</p>'
        + '<p>Hora Inicial: ' + new Date(json.date) + '</p>'
        + '<p>Hora Final: ' + new Date(Date.parse(json.date) + json.duration) + '</p>'
        /*+ '<p>Día: ' + json.dia + '</p>'
        + '<p>Mes: ' + json.mes + '</p>'
        + '<p>Año: ' + json.anio + '</p>'
        + '<p>Hora inicial: ' + json.hora + '</p>'
        + '<p>Hora final: ' + parseInt(parseInt(json.hora) + 2) + '</p>'*/
      )
      reservaHistory()
    },
    error: function (json) {
      if (json.responseJSON.statusCode === 401) {
        $('#reservaResponse').html(
          '<p>Login expiro</p>'
        )
      } else {
        $('#reservaResponse').html(
          '<p>Error ' + json.responseJSON.message + '</p>'
        )
      }
    }
  })
})


function reservaHistory() {
  $.ajax({
    type: 'POST',
    url: '/users/reservas',
    dataType: 'json',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    success: function (json) {
      var values = 'Reservas: <br>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        var table =
          '<table>'
          + '<tr>'
          + '<td>Token No: </td>'
          + '<td>' + Number(index + 1) + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Fecha de creación: </td>'
          + '<td>' + new Date(element.created_At) + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Fecha Reservada: </td>'
          + '<td>' + new Date(element.initialDate) + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Duración: </td>'
          + '<td>' + new Date(element.duration).getUTCHours() + ' Hora(s)</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Usado: </td>'
          + '<td>' + element.used + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Ir al workbench: </td>'
          + '<td><a href="/users/workbench/' + element.token + '">Click Here</a></td>'
          + '</tr>'
          + '</table >'
        values += table
      }
      $('#reservaHist').html(values)
    },
    error: function (json) {
      //alert(json)
    }
  })
}

var reservaHist = document.getElementById('reservaHist')
if (reservaHist) {
  reservaHistory()
}

function getExperimentos() {
  $.ajax({
    type: 'POST',
    url: '/users/experimentsAdmin',
    dataType: 'json',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    success: function (json) {
      console.log(json)
      var arra = json
      for (var index = 0; index < arra.length; index++) {
        var element = arra[index]

        var id = element._id
        var name = element.name
        var schedule = element.schedule
        var duration = element.duration
        var university = element.university
        $('#experimentsSelector').append('<option value="'+id+'">'+name+'</option>')
      }
    },
    error: function (json) {
      //alert(json)
    }
  })
}

var experimentsSelector = document.getElementById('experimentsSelector')
if (experimentsSelector) {
  getExperimentos()
}







/////////////////////////testing area/////////////////////

var calendarDiv = document.getElementById('calendarDiv')
if (calendarDiv) {
  reservaHistory()
}

$('#calendarDiv').fullCalendar({
    // put your options and callbacks here
})
