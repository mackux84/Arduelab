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
      var table =
        '<table class="myTable">'
        +'<thead>'
        + '<tr class="Theader" >'
          + '<th>Token No: </th>'
          + '<th>Fecha de creación: </th>'
          + '<th>Fecha Reservada: </th>'
          + '<th>Duración: </th>'
          + '<th>Usado: </th>'
          + '<th>Ir al Experimento:</th>'
        + '</tr>'
        +'</thead>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        var ini = (new Date(element.created_At)).toLocaleString()
        var fin = (new Date(element.initialDate)).toUTCString()
        table +=
          '<tr>'
          + '<td>' + Number(index + 1) + '</td>'
          + '<td>' +  ini + '</td>'
          + '<td>' +  fin.substring(0,fin.length-3) + '</td>'
          + '<td>' + element.duration + ' Minutos</td>'
        if (element.used) {
          table += '<td> Sí </td>'
        } else {
          table += '<td> No </td>'
        }
        table +=
          '<td><a href="http://' + element.url + '/' + element.token + '">Ir al Experimento</a></td>'
          + '</tr>'
      }
      table+='</table >'
      
      $('#reservaHist').html(table)
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
      var table =
        '<table class="myTable">'
        +'<thead>'
        + '<tr class="Theader" >'
          + '<th>Nombre: </th>'
          // + '<th>Pic: </th>'
          + '<th>Descripción: </th>'
          + '<th>Universidad: </th>'
          + '<th>Horas validas: </th>'
          + '<th>Duraciones permitidas: </th>'
          + '<th>Dias permitidos: </th>'
          + '<th>Reservar: </th>'
        +'<tr>'
        +'</thead>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        table +=
        '<tr>'
        + '<td id="nameExp;' + element._id + '">' + element.name + '</td>'
        // + '<td><img></td>'//TODO: add image
        + '<td>' + element.description + '</td>'
        + '<td id="universityExp;' + element._id + '" >' + element.university + '</td>'
        + '<td id="scheduleExp;' + element._id + '">[' + element.schedule + ']</td>'
        + '<td id="durationExp;' + element._id + '">[' + element.duration + ']</td>'
        + '<td id="daysExp;' + element._id + '" >[' + element.days + ']</td>'
        + '<td><button class="reservarExp" name="' + element._id + '">Reservar</button></td>'
        + '</tr>'
      }
      table+= '</table >'
      $('#experimentsAllUser').html(table)
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
            var ini = new Date(json.date).toUTCString()
            var fin = new Date(Date.parse(json.date) + json.duration*60000).toUTCString()
            alert(
              'Reserva realizada para:'
              + '\nHora Inicial: ' + ini.substring(0,ini.length-3)
              + '\nHora Final: ' + fin.substring(0,fin.length-3)
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
