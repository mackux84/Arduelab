'use strict'
var $ = require('jquery')
function userListShow() {
  $.ajax({
    type: 'POST',
    url: '/users/getAllUsers',
    dataType: 'json',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    success: function (json) {
      var values = 'Usuarios: <br>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        var table =
          '<table>'
          + '<tr>'
          + '<td>User Id:</td>'
          + '<td>' + element._id + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Fecha de creación: </td>'
          + '<td>' + new Date(element.created_At) + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Fecha de modificación: </td>'
          + '<td>' + new Date(element.updated_At) + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Nombre: </td>'
          + '<td><input type="text" name="usernameUser;' + element._id + '" Value="' + element.username + '" id="' + element._id + ';' + element.username + '"/></td>'
          + '</tr>'
          + '<tr>'
          + '<td>PassWord: </td>'
          + '<td><button class="resetPWD" name="' + element._id + '">Reset</button></td>'
          + '</tr>'
          + '<tr>'
          + '<td>Email (Unique): </td>'
          + '<td><input type="text" name="emailUser;' + element._id + '" Value="' + element.email + '" id="' + element._id + ';' + element.email + '"/></td>'
          + '</tr>'
          + '<tr>'
          + '<td>University</td>'
          + '<td><input type="text" name="universityUser;' + element._id + '" Value="' + element.university + '" id="' + element._id + ';' + element.university + '"/></td>'
          + '</tr>'
          + '<tr>'
          + '<td>Scope: </td>'
          + '<td><input type="text" name="scopeUser;' + element._id + '" Value="' + element.scope + '" id="' + element._id + ';' + element.scope + '"/></td>'
          + '</tr>'
          + '<tr>'
          + '<td>Verificado: </td>'
        if (element.isVerified) {
          table += '<td><input type="checkbox" name="isVerified;' + element._id + '" Value="' + element.isVerified + '" id="' + element._id + ';' + element.isVerified + '" checked/></td>'
        } else {
          table += '<td><input type="checkbox" name="isVerified;' + element._id + '" Value="' + element.isVerified + '" id="' + element._id + ';' + element.isVerified + '" /></td>'
        }
        table += '</tr>'
          + '<tr>'
          + '<td>Ver Reservas (Seleccionar): </td>'
          + '<td><input type="checkbox" name="selectUser" value="' + element.email + '" ></td>'
          + '</tr>'
          + '<tr>'
          + '<td><button class="editarUser" name="' + element._id + '">Editar</button></td>'
          + '<td><button class="reiniciarUser" name="' + element._id + '">Cancelar</button></td>'
          + '</tr>'
          + '</table >'
        values += table
      }
      $('#userList').html(values)
      $('.editarUser').on('click', function (e) {
        //patch user
        e.preventDefault()
        var jsonData = {}
        var name_id = $(this).attr('name')
        if ($('[name="emailUser;' + name_id + '"]').val() === $('[name="emailUser;' + name_id + '"]').attr('id').split(';')[1]) {
          jsonData = {
            username: $('[name="usernameUser;' + name_id + '"]').val(),
            university: $('[name="universityUser;' + name_id + '"]').val(),
            scope: $('[name="scopeUser;' + name_id + '"]').val(),
            isVerified: $('[name="isVerified;' + name_id + '"]').is(':checked')
          }
        } else {
          jsonData = {
            username: $('[name="usernameUser;' + name_id + '"]').val(),
            email: $('[name="emailUser;' + name_id + '"]').val(),
            university: $('[name="universityUser;' + name_id + '"]').val(),
            scope: $('[name="scopeUser;' + name_id + '"]').val(),
            isVerified: $('[name="isVerifiedUser;' + name_id + '"]').is(':checked')
          }
        }
        var jsonData2 = JSON.stringify(jsonData)
        $.ajax({
          type: 'PATCH',
          url: '/users/' + name_id,
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
            alert(json.responseJSON.message)
          }
        })
      })
      $('.cancelarUser').on('click', function (e) {
        //Reset user values
        e.preventDefault()
        var name_id = $(this).attr('name')
        $('[name="usernameUser;' + name_id + '"]').attr('value', $('[name="usernameUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="usernameUser;' + name_id + '"]').val($('[name="usernameUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="emailUser;' + name_id + '"]').attr('value', $('[name="emailUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="emailUser;' + name_id + '"]').val($('[name="emailUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="universityUser;' + name_id + '"]').attr('value', $('[name="universityUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="universityUser;' + name_id + '"]').val($('[name="universityUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="scopeUser;' + name_id + '"]').attr('value', $('[name="scopeUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="scopeUser;' + name_id + '"]').val($('[name="scopeUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="isVerified;' + name_id + '"]').attr('value', $('[name="isVerifiedUser;' + name_id + '"]').attr('id').split(';')[1])
        if ($('[name="isVerified;' + name_id + '"]').attr('value') === 'true') {
          $('[name="isVerified;' + name_id + '"]').prop('checked', true)
        } else {
          $('[name="isVerified;' + name_id + '"]').prop('checked', false)
        }
      })
      $('.resetPWD').on('click', function (e) {
        //Reset user values
        e.preventDefault()
        var name_id = $(this).attr('name')
        var jsonData = {
          email: $('[name="emailUser;' + name_id + '"]').val(),
        }
        var jsonData2 = JSON.stringify(jsonData)
        $.ajax({
          type: 'POST',
          url: '/users/forgotPassword',
          data: jsonData2,
          dataType: 'json',
          contentType: 'application/json',
          success: function (json) {
            alert(json.message)
          },
          error: function (json) {
            alert(json.responseJSON.message)
          }
        })
      })


      if (reservaHistAll) {
        $('#selectAll').prop('checked', true);
        checkAllUsers()
        reservaHistoryAll()
      }
    },
    error: function (json) {
      //console.log('get all users error')
      //console.log(json)
    }
  })
}
var userList = document.getElementById('userList')
if (userList) {
  userListShow()
}

function checkAllUsers() {
  $('input[name="selectUser"]').each(function () {
    this.checked = true
  })
}
$('#selectAll').on('click', function (e) {
  $('input[name="selectUser"]').each(function () {
    this.checked = $('#selectAll').is(':checked')
  })
})

function reservaHistoryAll() {
  $('#reservaHistAll').html('')
  var selecteduser = []
  $.each($('input[name="selectUser"]:checked'), function () {
    selecteduser.push($(this).val())
  })
  var jsonData = {
    array: selecteduser,
  }
  var jsonData2 = JSON.stringify(jsonData)
  $.ajax({
    type: 'POST',
    url: '/users/reservasAdmin',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    data: jsonData2,
    dataType: 'json',
    contentType: 'application/json',
    success: function (json) {
      var values = 'Reservas: <br>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        var table =
          '<table>'
          + '<tr>'
          + '<td>Token No: </td>'
          + '<td>' + element._id + '</td>'
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
          + '<td>Reservado por: </td>'
          + '<td>' + element.email + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Usado: </td>'
          + '<td>' + element.used + '</td>'
          + '</tr>'
          + '<tr>'
          + '<td>Disponible: </td>'
        if (element.enabled) {
          table += '<td><input type="checkbox" name="isEnabledReserva;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '" checked/></td>'
        } else {
          table += '<td><input type="checkbox" name="isEnabledReserva;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '" /></td>'
        }
        table +=
          '</tr>'
          + '<tr>'
          + '<td>Guardar: </td>'
          + '<td><button class="guardarReserva" name="' + element._id + '">Guardar</button></td>' + '</tr>'
          + '</table >'
        values += table
      }
      $('#reservaHistAll').html(values)
      $('.guardarReserva').on('click', function (e) {
        e.preventDefault()
        var jsonData = {}
        var name_id = $(this).attr('name')
        jsonData = {
          enabled: $('[name="isEnabledReserva;' + name_id + '"]').is(':checked')
        }
        var jsonData2 = JSON.stringify(jsonData)
        $.ajax({
          type: 'PATCH',
          url: '/users/reservas/' + name_id,
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
            alert(json.responseJSON.message)
          }
        })
      })

    },
    error: function (json) {
      alert(json.responseJSON.message)
    }
  })
}
var reservaHistAll = document.getElementById('reservaHistAll')

$('#filtrar').on('click', function (e) {
  reservaHistoryAll()
})





function crearExp() {
  var jsonData = {
    name: $('#crearExpNombre').val(),
    university: $('#crearExpUniversidad').val(),
    url: $('#crearExpUrl').val(),
    schedule: $('#crearExpSchedule').val(),
    duration: $('#crearExpDuration').val(),
    enabled: $('#crearExpEnabled').is(':checked')
  }
  var jsonData2 = JSON.stringify(jsonData)
  $.ajax({
    type: 'POST',
    url: '/users/createexp',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    data: jsonData2,
    dataType: 'json',
    contentType: 'application/json',
    success: function (json) {
      alert(json.message)
      experimentsGetAll()
    },
    error: function (json) {
      alert(json.responseJSON.message)
    }
  })
}


$('#crearExp').on('click', function (e) {
  crearExp()
})


function experimentsGetAll() {
  $('#experimentsAll').html('')
  $.ajax({
    type: 'POST',
    url: '/users/experimentsAdmin',
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
          + '<td>Universidad: </td>'
          + '<td><input type="text" name="universityExp;' + element._id + '" Value="' + element.university + '" id="' + element._id + ';' + element.university + '"/></td>'
          + '</tr>'
          + '<tr>'
          + '<td>Fecha de creación: </td>'
          + '<td>' + new Date(element.created_At) + '</td>'
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
          + '<td>Disponible: </td>'
        if (element.enabled) {
          table += '<td><input type="checkbox" name="isEnabledExp;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '" checked/></td>'
        } else {
          table += '<td><input type="checkbox" name="isEnabledExp;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '" /></td>'
        }
        table +=
          '</tr>'
          + '<tr>'
          + '<td><button class="editarExp" name="' + element._id + '">Guardar</button></td>'
          + '<td><button class="reiniciarExp" name="' + element._id + '">Reiniciar</button></td>'
          + '</tr>'
          + '</table >'
        values += table
      }
      $('#experimentsAll').html(values)
      $('.editarExp').on('click', function (e) {
        //patch Experiment
        e.preventDefault()
        var jsonData = {}
        var name_id = $(this).attr('name')
        jsonData = {
          name: $('[name="nameExp;' + name_id + '"]').val(),
          university: $('[name="universityExp;' + name_id + '"]').val(),
          url: $('[name="urlExp;' + name_id + '"]').val(),
          schedule: $('[name="scheduleExp;' + name_id + '"]').val(),
          duration: $('[name="durationExp;' + name_id + '"]').val(),
          enabled: $('[name="enabledExp;' + name_id + '"]').is(':checked')
        }
        var jsonData2 = JSON.stringify(jsonData)
        $.ajax({
          type: 'PATCH',
          url: '/users/experiment/' + name_id,
          headers: {
            'Authorization': window.location.pathname.split('/')[3]
          },
          data: jsonData2,
          dataType: 'json',
          contentType: 'application/json',
          success: function (json) {
            alert(json.message)
            experimentsGetAll()
          },
          error: function (json) {
            alert(json.responseJSON.message)
          }
        })
      })
      $('.reiniciarExp').on('click', function (e) {
        //Reset user values
        e.preventDefault()
        var name_id = $(this).attr('name')
        $('[name="nameExp;' + name_id + '"]').attr('value', $('[name="nameExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="nameExp;' + name_id + '"]').val($('[name="nameExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="universityExp;' + name_id + '"]').attr('value', $('[name="universityExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="universityExp;' + name_id + '"]').val($('[name="universityExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="urlExp;' + name_id + '"]').attr('value', $('[name="urlExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="urlExp;' + name_id + '"]').val($('[name="urlExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="scheduleExp;' + name_id + '"]').attr('value', $('[name="scheduleExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="scheduleExp;' + name_id + '"]').val($('[name="scheduleExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="durationExp;' + name_id + '"]').attr('value', $('[name="durationExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="durationExp;' + name_id + '"]').val($('[name="durationExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="enabledExp;' + name_id + '"]').attr('value', $('[name="enabledExp;' + name_id + '"]').attr('id').split(';')[1])
        if ($('[name="enabledExp;' + name_id + '"]').attr('value') === 'true') {
          $('[name="enabledExp;' + name_id + '"]').prop('checked', true)
        } else {
          $('[name="enabledExp;' + name_id + '"]').prop('checked', false)
        }
      })
    },
    error: function (json) {
      alert(json.responseJSON.message)
    }
  })
}

var experimentsAll = document.getElementById('experimentsAll')
if (experimentsAll) {
  experimentsGetAll()
}