'use strict'
var $ = require('jquery')
require('fullCalendar')
var moment = require('moment')

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
        $('#experimentsSelector').append('<option value="' + id + '">' + name + '</option>')
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
$(document).ready(function () {
  var calendarDiv = document.getElementById('calendarDiv')
  if (calendarDiv) {
    var json = {
      selectable: true,
      maxResTime: 7200000,
      experimentID: '526584523602541252301524',
      events: [
        {
          id: 999,
          title: 'Repeating Event',
          start: '2014-06-09T16:00:00'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2014-06-16T16:00:00'
        },
        {
          title: 'Meeting',
          start: '2014-06-12T10:30:00',
          end: '2014-06-12T12:30:00',
          backgroundColor: '#ffff00',
          borderColor: '#00ff00',
          textColor: '#6666ff'
        },
        {
          title: 'Lunch',
          start: '2014-06-12T12:00:00'
        },
        {
          title: 'Birthday Party',
          url: 'http://google.com/',
          start: '2014-06-13T07:00:00'
        },
      ],
      selectConstraint: {
        start: '10:00', // a start time (10am in this example)
        end: '18:00', // an end time (6pm in this example)

        dow: [1, 2, 3, 4, 5, 6]
        // days of week. an array of zero-based day of week integers (0=Sunday)
        // (Monday-Thursday in this example)
      },
      businessHours: [
        {
          dow: [1, 2, 3, 4, 5, 6],
          start: '10:00',
          end: '18:00'
        },
      ]
    }
    calendarDivF(json)
  }
})

function calendarDivF(json) {

  $('#calendarDiv').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    weekNumbers: true,
    weekNumbersWithinDays: true,
    allDaySlot: false,
    navLinks: true, // can click day/week names to navigate views
    selectable: json.selectable,
    selectHelper: true,
    selectOverlap: false,
    eventLimit: true,
    eventLimitClick: 'week',
    scrollTime: '08:00:00',
    snapDuration: '00:30:00',
    slotDuration: '00:30:00',
    eventBackgroundColor: '#500006',
    eventBorderColor: '#ff0000',
    eventTextColor: '#000056',
    defaultView: 'agendaWeek',
    editable: false,
    defaultDate: '2014-06-11',

    selectAllow: function (selectInfo) {
      var start = moment(selectInfo.start)
      var end = moment(selectInfo.end)
      var diff = end.diff(start)
      if (diff <= json.maxResTime) {
        return true
      } else {
        return false
      }
    },
    select: function (start, end) {
      var startF = start.format('dddd d [de] MMMM YYYY, hh:mm a')
      var endF = end.format('dddd d [de] MMMM YYYY, hh:mm a')
      var dur = moment.duration(end.diff(start)).asMinutes()
      var r = confirm(
        'Esta seguro de realizar esta reserva?'
        + '\nInicio: ' + startF
        + '\nFin: ' + endF
        + '\nDuración: ' + dur + ' minutos'
      )
      if (r == true) {
        ////////////////////////**///////////
        var jsonData = {
          start: start,
          duration: dur,
          experiment: json.experimentID
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
            alert(
              '<p>Reserva realizada para:</p>'
              + '<p>Hora Inicial: ' + new Date(json.date) + '</p>'
              + '<p>Hora Final: ' + new Date(Date.parse(json.date) + json.duration) + '</p>'
            )
            var eventData = {
              title: 'Reservado',
              start: start,
              end: end,
              backgroundColor: '#ffff00',
              borderColor: '#00ff00',
              textColor: '#6666ff'
            }
            $('#calendarDiv').fullCalendar('renderEvent', eventData, true) // stick? = true
            $('#calendarDiv').fullCalendar('option', 'selectable', false)
            reservaHistory()
          },
          error: function (json) {
                        var eventData = {
              title: 'Reservado',
              start: start,
              end: end,
              backgroundColor: '#ffff00',
              borderColor: '#00ff00',
              textColor: '#6666ff'
            }
            $('#calendarDiv').fullCalendar('renderEvent', eventData, true) 
            $('#calendarDiv').fullCalendar('unselect')
            if (json.responseJSON.statusCode === 401) {
              alert(
                '<p>Login expiro</p>'
              )
            } else {
              alert(
                '<p>Error ' + json.responseJSON.message + '</p>'
              )
            }
          }
        })
        ///////////////////////**////////////

      } else {
        $('#calendarDiv').fullCalendar('unselect')
      }
    },
    events: json.events,
    selectConstraint: json.selectConstraint,
    businessHours: json.businessHours
  })
}
