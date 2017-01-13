'use strict'
var $ = require('jquery')
require('fullCalendar')
var moment = require('moment')

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
  $('#experimentsAll').html('')
  $.ajax({
    type: 'POST',
    url: '/users/experimentsAdmin',
    dataType: 'json',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    success: function (json) {
      var values = 'Experimentos: <br>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        var table =
          '<table>'
          + '<tr>'
          + '<td>Nombre: </td>'
          + '<td><input type="text" name="nameExp;' + element._id + '" Value="' + element.name + '" id="' + element._id + ';' + element.name + '"/></td>'
          + '</tr>'
          + '<tr>'
          + '<td><img></td>'//TODO: add image
          + '<td>' + element.description + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Universidad: </td>'
          + '<td><input type="text" name="universityExp;' + element._id + '" Value="' + element.university + '" id="' + element._id + ';' + element.university + '"/></td>'
          + '</tr>'
          + '<tr>'
          + '<td>Url: </td>'
          + '<td><input type="text" name="urlExp;' + element._id + '" Value="' + element.url + '" id="' + element._id + ';' + element.url + '"/></td>'
          + '</tr>'
          + '<tr>'
          + '<td>Horas validas: </td>'
          + '<td><input type="text" name="scheduleExp;' + element._id + '" Value="[' + element.schedule + ']" id="' + element._id + ';' + element.schedule + '"/></td>'
          + '</tr>'
          + '<tr>'
          + '<td>Duraciones permitidas: </td>'
          + '<td><input type="text" name="durationExp;' + element._id + '" Value="[' + element.duration + ']" id="' + element._id + ';' + element.duration + '"/></td>'
          + '</tr>'
          + '<tr>'
          + '<td>Dias permitidos: </td>'
          + '<td><input type="text" name="daysExp;' + element._id + '" Value="[' + element.days + ']" id="' + element._id + ';' + element.days + '"/></td>'
          + '</tr>'
          + '<tr>'
          + '<td><button class="reservarExp" name="' + element._id + '">Reservar</button></td>'
          + '</tr>'
          + '</table >'
        values += table
      }
      $('#experimentsAll').html(values)
      $('.reservarExp').on('click', function (e) {
        //patch Experiment
        e.preventDefault()
        var jsonData = {}
        var name_id = $(this).attr('name')
        jsonData = {
          expID: name_id
        }
        var jsonData2 = JSON.stringify(jsonData)
        $.ajax({
          type: 'POST',
          url: '/users/experimentReserves/',
          headers: {
            'Authorization': window.location.pathname.split('/')[3]
          },
          data: jsonData2,
          dataType: 'json',
          contentType: 'application/json',
          success: function (json) {
            console.log(json)
            alert(json)
            alert(json.message)
            ///////////////////////////////////////////////////
            $('#id01').show()
            var calendarDiv = document.getElementById('calendarDiv')
            if (calendarDiv) {
              var eventsA = []
              for (var index = 0; index < json.length; index++) {
                var element = json[index]
                var now = new Date(element.initialDate)
                now.setMinutes(now.getMinutes() + element.duration)
                var temp = {
                  title: 'Reserved',
                  start: element.initialDate,
                  end: now
                }
                eventsA.push(temp)
              }
              var businessH = $('[name="scheduleExp;' + name_id + '"]').val()
              console.log(businessH)
              var jsonCal = {
                selectable: true,
                maxResTime: 7200000,
                experimentID: name_id,
                events: eventsA,
                selectConstraint: {
                  start: businessH[0],
                  end: businessH[1],
                  dow: $('[name="daysExp;' + name_id + '"]').val()
                },
                businessHours: [
                  {
                    start: businessH[0],
                    end: businessH[1],
                    dow: $('[name="daysExp;' + name_id + '"]').val()
                  },
                ]
              }
              //TODO: timeout and callback function are temporal fixes,
              //when the server query (json) is added they should no longer be necessary
              //setTimeout(callback(jsonCal), 500)
              calendarDivF(jsonCal)
            }


          },
          error: function (json) {
            alert(json.responseJSON.message)
          }
        })
      })
    },
    error: function (json) {
      alert(json.responseJSON.message)
      //alert(json)
    }
  })
}

var experimentsSelector = document.getElementById('experimentsSelector')
if (experimentsSelector) {
  getExperimentos()
}







/////////////////////////testing area/////////////////////
/*function callback(json) {
  return function () {
    calendarDivF(json)
  }
}*/
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
    events: json.events,
    selectConstraint: json.selectConstraint,
    businessHours: json.businessHours,

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
              'Reserva realizada para:'
              + 'Hora Inicial: ' + new Date(json.date)
              + 'Hora Final: ' + new Date(Date.parse(json.date) + json.duration)
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

            $('#calendarDiv').fullCalendar('unselect')
            if (json.responseJSON.statusCode === 401) {
              alert(
                'Login expiro'
              )
            } else {
              alert(
                'Error: ' + json.responseJSON.message
              )
            }
          }
        })
        ///////////////////////**////////////

      } else {
        $('#calendarDiv').fullCalendar('unselect')
      }
    }
  })
}
