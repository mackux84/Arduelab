'use strict'
var $ = require('jquery')
require('fullCalendar')
var moment = require('moment')

$('#passwordChange').on('click', function (e) {
  cambiarPass()
})

function cambiarPass() {
  var oldPass = $('#oldpassword').val()
  var newPass = $('#newpassword').val()
  var newPassCheck = $('#cnewpassword').val()
  
  if (!oldPass || !newPass || !newPassCheck) {
    alert('password fields can\'t be empty')
    return
  }

  if (newPass !== newPassCheck) {
    alert('Passwords check failed')
    return
  }
  if (oldPass === newPass) {
    alert('New and old passwords can\'t be the same')
    return
  }

  var jsonData = {}
  jsonData = {
    old_password: oldPass,
    new_password: newPass,
    new_password_check:newPassCheck,
  }
  var jsonData2 = JSON.stringify(jsonData)

  $.ajax({
    type: 'POST',
    url: '/users/passwordChange',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    data: jsonData2,
    dataType: 'json',
    contentType: 'application/json',
    success: function (json) {
      alert(json.message)
    },
    error: function (json) {
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
}

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
          '<table class="myTable">'
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
          + '<td>' + element.duration + ' Minutos</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Usado: </td>'
          + '<td>' + element.used + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td colspan="2" align="center"><a href="http://' + element.url + '/' + element.token + '">Ir al Experimento</a></td>'
          + '</tr>'
          + '</table >'
          + '<br>'
        values += table
      }
      $('#reservaHist').html(values)
    },
    error: function (json) {
      //alert(json)
      //console.log(json)
    }
  })
}

$(document).ready(function () {
  var experimentsAllUser = document.getElementById('experimentsAllUser')
  if (experimentsAllUser) {
    getExperimentos()
  }

  var reservaHist = document.getElementById('reservaHist')
  if (reservaHist) {
    reservaHistory()
  }

  var modal = document.getElementById('id01')
  var modal2 = document.getElementById('id02')
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if ((event.target == modal) || (event.target == modal2)) {
      modal.style.display = 'none'
      modal2.style.display = 'none'
      $('#calendarDiv').fullCalendar('destroy')
    }
  }
})

$('.closeX').on('click', function (e) {
  $('#id01').css('display', 'none')
  $('#id02').css('display', 'none')
  $('#calendarDiv').fullCalendar('destroy')
})
function getExperimentos() {
  $('#experimentsAllUser').html('')
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
          '<table class="myTable">'
          + '<tr>'
          + '<td>Nombre: </td>'
          + '<td id="nameExp;' + element._id + '">' + element.name + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td><img></td>'//TODO: add image
          + '<td>' + element.description + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Universidad: </td>'
          + '<td id="universityExp;' + element._id + '" >' + element.university + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Url: </td>'
          + '<td id="urlExp;' + element._id + '" >' + element.url + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Horas validas: </td>'
          + '<td id="scheduleExp;' + element._id + '">[' + element.schedule + ']</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Duraciones permitidas: </td>'
          + '<td id="durationExp;' + element._id + '">[' + element.duration + ']</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Dias permitidos: </td>'
          + '<td id="daysExp;' + element._id + '" >[' + element.days + ']</td>'
          + '</tr>'
          + '<tr>'
          + '<td colspan="2" align="center"><button class="reservarExp" name="' + element._id + '">Reservar</button></td>'
          + '</tr>'
          + '</table >'
          + '<br>'
        values += table
      }
      $('#experimentsAllUser').html(values)
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
            //console.log('json:')
            //console.log(json)
            ///////////////////////////////////////////////////
            $('#expNameCal').text($('[id="nameExp;' + name_id + '"]').text())
            $('#id01').show()
            var calendarDiv = document.getElementById('calendarDiv')
            if (calendarDiv) {
              var eventsA = []
              for (var index = 0; index < json.length; index++) {
                var element = json[index]
                var startdate = new Date(element.initialDate)

                //startdate.setSeconds(startdate.getSeconds()+10)
                var enddate = new Date(element.initialDate)
                enddate.setMinutes(startdate.getMinutes() + element.duration)
                var temp = {
                  title: 'Reserved',
                  start: startdate.toISOString(),
                  end: enddate.toISOString()
                }
                //console.log('now')
                //console.log(temp.start)
                //console.log('now+duration')
                //console.log(temp.end)
                eventsA.push(temp)
              }
              var businessH = JSON.parse($('[id="scheduleExp;' + name_id + '"]').text())
              //console.log('businessH: ')
              //console.log(businessH)
              var jsonCal = {
                selectable: true,
                maxResTime: 7200000,
                experimentID: name_id,
                events: eventsA,
                selectConstraint: {
                  start: businessH[0] + ':00',
                  end: businessH[1] + ':00',
                  dow: JSON.parse($('[id="daysExp;' + name_id + '"]').text())
                },
                businessHours:
                {
                  start: businessH[0] + ':00',
                  end: businessH[1] + ':00',
                  dow: JSON.parse($('[id="daysExp;' + name_id + '"]').text())
                }

              }
              //console.log('jsonCal:')
              //console.log(jsonCal)
              //TODO (not): timeout and callback function are temporal fixes,
              //when the server query (json) is added they should no longer be necessary
              //false, it is still necessary
              setTimeout(callbackCal(jsonCal), 1000)
              //calendarDivF(jsonCal)
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
function callbackCal(json) {
  return function () {
    calendarDivF(json)
  }
}
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
      var startF = start.format('dddd DD [de] MMMM YYYY, HH:mm')
      var endF = end.format('dddd DD [de] MMMM YYYY, HH:mm')
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
  $('#calendarDiv').fullCalendar('render')
}
