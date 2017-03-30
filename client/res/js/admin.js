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
      var table =
        '<table class="myTable" id="usersTable">'
        +'<thead>'
        + '<tr class="Theader" >'
          //+ '<th  >User Id </th>'
          //+ '<th  >Fecha de creacion</th>'
          //+ '<th  >Fecha de modificacion</th>'
          + '<th>Nombre</th>'
          + '<th>Email</th>'
          + '<th>Universidad</th>'
          + '<th>Scope</th>'
          + '<th>Verificado</th>'
        
          // + '<th data-sort-method="none" class="no-sort">Reservas</th>'
          + '<th data-sort-method="none" class="no-sort">Password</th>'
          + '<th data-sort-method="none" class="no-sort">Guardar Cambios</th>'
          + '<th data-sort-method="none" class="no-sort">Reiniciar Cambios</th>'
        + '</tr>'
        +'</thead>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        table +=
          '<tr class="searchItem">'
          //+ '<td>' + element._id + '</td>'
          //+ '<td >' + new Date(element.created_At) + '</td>'
          //+ '<td >' + new Date(element.updated_At) + '</td>'
          + '<td data-sort='+element.username+'><input type="text" name="usernameUser;' + element._id + '" Value="' + element.username + '" id="' + element._id + ';' + element.username + '"/></td>'
          + '<td data-sort='+element.email+'><input type="text" name="emailUser;' + element._id + '" Value="' + element.email + '" id="' + element._id + ';' + element.email + '"/></td>'
          + '<td data-sort='+element.university+'><input type="text" name="universityUser;' + element._id + '" Value="' + element.university + '" id="' + element._id + ';' + element.university + '"/></td>'
          // + '<td data-sort=' + element.scope + '><input type="text" name="scopeUser;' + element._id + '" Value="' + element.scope + '" id="' + element._id + ';' + element.scope + '"/></td>'
          + '<td data-sort=' + element.scope + '><select name="selectUser;' + element._id + '" id="' + element._id + ';' + element.scope + '">'
        if (element.scope === 'Admin') {
          table+= '<option value="User">User</option>'
            + '<option value="Admin" selected="selected">Admin</option>'
        } else {
          table+= '<option value="User" selected="selected">User</option>'
            + '<option value="Admin">Admin</option>'
        }
        table+= '</select></td>'
        if (element.isVerified) {
          table += '<td data-sort="true"><input type="checkbox" name="isVerified;' + element._id + '" Value="' + element.isVerified + '" id="' + element._id + ';' + element.isVerified + '" checked/></td>'
        } else {
          table += '<td data-sort="false"><input type="checkbox" name="isVerified;' + element._id + '" Value="' + element.isVerified + '" id="' + element._id + ';' + element.isVerified + '" /></td>'
        }
        table +=
          // '<td><button class="reservasUser" name="' + element._id + '">Ver</button></td>'
           '<td><button class="resetPWD" name="' + element._id + '">Reset</button></td>'
          + '<td><button class="editarUser" name="' + element._id + '">Editar</button></td>'
          + '<td><button class="reiniciarUser" name="' + element._id + '">Cancelar</button></td>'
          +'</tr>'
      }
      table += '</table >'
      $('#userList').html('')
      $('#userList').html(table)
      $('.editarUser').on('click', function (e) {
        //patch user
        e.preventDefault()
        var jsonData = {}
        var name_id = $(this).attr('name')
        //checks if email is updated so that server sends verification email
        if ($('[name="emailUser;' + name_id + '"]').val() === $('[name="emailUser;' + name_id + '"]').attr('id').split(';')[1]) {
          jsonData = {
            username: $('[name="usernameUser;' + name_id + '"]').val(),
            university: $('[name="universityUser;' + name_id + '"]').val(),
            // scope: $('[name="scopeUser;' + name_id + '"]').val(),
            scope: $('[name="selectUser;' + name_id + '"]').val(),
            isVerified: $('[name="isVerified;' + name_id + '"]').is(':checked')
          }
        } else {
          jsonData = {
            username: $('[name="usernameUser;' + name_id + '"]').val(),
            email: $('[name="emailUser;' + name_id + '"]').val(),
            university: $('[name="universityUser;' + name_id + '"]').val(),
            // scope: $('[name="scopeUser;' + name_id + '"]').val(),
            scope: $('[name="selectUser;' + name_id + '"]').val(),
            isVerified: 'false' //if email is updated
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
      $('.reiniciarUser').on('click', function (e) {
        //Reset user values
        e.preventDefault()
        var name_id = $(this).attr('name')
        $('[name="usernameUser;' + name_id + '"]').attr('value', $('[name="usernameUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="usernameUser;' + name_id + '"]').val($('[name="usernameUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="emailUser;' + name_id + '"]').attr('value', $('[name="emailUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="emailUser;' + name_id + '"]').val($('[name="emailUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="universityUser;' + name_id + '"]').attr('value', $('[name="universityUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="universityUser;' + name_id + '"]').val($('[name="universityUser;' + name_id + '"]').attr('id').split(';')[1])
        // $('[name="scopeUser;' + name_id + '"]').attr('value', $('[name="scopeUser;' + name_id + '"]').attr('id').split(';')[1])
        // $('[name="scopeUser;' + name_id + '"]').val($('[name="scopeUser;' + name_id + '"]').attr('id').split(';')[1])
        if ($('[name="selectUser;' + name_id + '"]').prop('id').split(';')[1] === 'Admin') {
          $('[name="selectUser;' + name_id + '"] option[value="Admin"]').prop('selected','selected')
        } else {
          $('[name="selectUser;' + name_id + '"] option[value="User"]').prop('selected','selected')
        }

        $('[name="isVerified;' + name_id + '"]').attr('value', $('[name="isVerified;' + name_id + '"]').attr('id').split(';')[1])
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
      $('.reservasUser').on('click', function (e) {
        e.preventDefault()
        //TODO: !!!!!!!!!!!!
      })
    },
    error: function (json) {
      //console.log('get all users error')
      //console.log(json)
    }
  })
}

function reservaHistoryAll() {
  $('#reservaHistAll').html('')
  var selecteduser = []
  /*$.each($('input[name="selectUser"]:checked'), function () {
    selecteduser.push($(this).val())
  })*/
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
      var table =
        '<table class="myTable" id="reservesTable">'
        +'<thead>'
        + '<tr class="Theader" >'
          + '<th># </th>'
          + '<th>Token: </th>'
          + '<th>Experiment Name: </th>'
          + '<th>Fecha de creación: </th>'
          + '<th>Fecha Reservada: </th>'
          + '<th>Duración: </th>'
          + '<th>Reservado por: </th>'
          + '<th>Usado: </th>'
          + '<th>Disponible: </th>'
          + '<th data-sort-method="none" class="no-sort">Guardar: </th>'
          + '</tr>'
        +'</thead>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        var ini = (new Date(element.created_At)).toLocaleString()
        var fin = (new Date(element.initialDate)).toUTCString()
        table+=  
           '<tr class="searchItem">'
          // + '<td>' + element._id + '</td>'
          + '<td>'+(index+1)+'</td>'
          + '<td><textarea readonly>' + element.token + '</textarea></td>'
          + '<td>' + element.expName + '</td>'
          + '<td>' + ini + '</td>'
          + '<td>' + fin.substring(0,fin.length-3) + '</td>'
          + '<td>' + element.duration + ' Minutos</td>'
          + '<td>' + element.email + '</td>'
        if (element.used) {
          table += '<td> Sí </td>'
        } else {
          table += '<td> No </td>'
        }
        if (element.enabled) {
          table += '<td data-sort="true"><input type="checkbox" name="isEnabledReserva;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '" checked/></td>'
        } else {
          table += '<td data-sort="false"><input type="checkbox" name="isEnabledReserva;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '" /></td>'
        }
        table +=
           '<td><button class="guardarReserva" name="' + element._id + '">Guardar</button></td>'
          + '</tr>'
      }
      table += '</table >'
      $('#reservaHistAll').html('')
      $('#reservaHistAll').html(table)
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

function crearExp() {
  var jsonData = {
    name: $('#crearExpNombre').val(),
    university: $('#crearExpUniversidad').val(),
    description: $('#crearExpDesc').val(),
    url: $('#crearExpUrl').val(),
    days: '['+$('#crearExpDays').val()+']',
    schedule: '['+$('#crearExpSchedule').val()+']',
    duration: '['+$('#crearExpDuration').val()+']',
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
/*
$('#crearExp').on('click', function (e) {
  crearExp()
})*/

$('#createExpForm').on('submit', function (e) {
  e.preventDefault()
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
      var table =
        '<table class="myTable" id="experimentsTable">'
        +'<thead>'
        + '<tr class="Theader" >'
          + '<th>ID: </td>'
          + '<th>Nombre: </th>'
          + '<th>Universidad: </th>'
          + '<th>Descripción: </th>'
          + '<th>Fecha de creación: </th>'
          + '<th>Url: </th>'
          + '<th>Dias validos: </th>'
          + '<th>Horas validas: </th>'
          + '<th>Duraciones permitidas: </th>'
          + '<th>Disponible: </th>'
          + '<th data-sort-method="none" class="no-sort">Guardar Cambios</th>'
          + '<th data-sort-method="none" class="no-sort">Reiniciar Cambios</th>'
        + '</tr>'
        +'</thead>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        table +=
          '<tr class="searchItem">'
          + '<td>'+element._id+'</td>'
          + '<td data-sort="'+element.name+'"><input type="text" name="nameExp;' + element._id + '" Value="' + element.name + '" id="' + element._id + ';' + element.name + '"/></td>'
          + '<td data-sort='+element.university+'><input type="text" name="universityExp;' + element._id + '" Value="' + element.university + '" id="' + element._id + ';' + element.university + '"/></td>'
          + '<td><textarea name="descriptionExp;' + element._id + '" Value="' + element.description + '" id="' + element._id + ';' + element.description + '">' + element.description + '</textarea></td>'
          + '<td>' + new Date(element.created_At).toLocaleString() + '</td>'
          + '<td data-sort='+element.url+'><input type="text" name="urlExp;' + element._id + '" Value="' + element.url + '" id="' + element._id + ';' + element.url + '"/></td>'
          + '<td data-sort='+element.days+'><input type="text" name="daysExp;' + element._id + '" Value="' + element.days + '" id="' + element._id + ';' + element.days + '"/></td>'
          + '<td data-sort='+element.schedule+'><input type="text" name="scheduleExp;' + element._id + '" Value="' + element.schedule + '" id="' + element._id + ';' + element.schedule + '"/></td>'
          + '<td data-sort='+element.duration+'><input type="text" name="durationExp;' + element._id + '" Value="' + element.duration + '" id="' + element._id + ';' + element.duration + '"/></td>'
        if (element.enabled) {
          table += '<td data-sort="true"><input type="checkbox" name="isEnabledExp;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '" checked/></td>'
        } else {
          table += '<td data-sort="false"><input type="checkbox" name="isEnabledExp;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '" /></td>'
        }
        table +=
           '<td><button class="editarExp" name="' + element._id + '">Guardar</button></td>'
          + '<td><button class="reiniciarExp" name="' + element._id + '">Reiniciar</button></td>'
          + '</tr>'
      }
      table+= '</table >'
      $('#experimentsAll').html('')
      $('#experimentsAll').html(table)
      $('.editarExp').on('click', function (e) {
        //patch Experiment
        e.preventDefault()
        var jsonData = {}
        var name_id = $(this).attr('name')
        jsonData = {
          name: $('[name="nameExp;' + name_id + '"]').val(),
          university: $('[name="universityExp;' + name_id + '"]').val(),
          description: $('[name="descriptionExp;' + name_id + '"]').val(),
          url: $('[name="urlExp;' + name_id + '"]').val(),
          days: '['+$('[name="daysExp;' + name_id + '"]').val()+']',
          schedule: '['+$('[name="scheduleExp;' + name_id + '"]').val()+']',
          duration: '['+$('[name="durationExp;' + name_id + '"]').val()+']',
          enabled: $('[name="isEnabledExp;' + name_id + '"]').is(':checked')
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
        $('[name="descriptionExp;' + name_id + '"]').attr('value', $('[name="descriptionExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="descriptionExp;' + name_id + '"]').val($('[name="descriptionExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="urlExp;' + name_id + '"]').attr('value', $('[name="urlExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="urlExp;' + name_id + '"]').val($('[name="urlExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="daysExp;' + name_id + '"]').attr('value', $('[name="daysExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="daysExp;' + name_id + '"]').val($('[name="daysExp;' + name_id + '"]').attr('id').split(';')[1])
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

$(document).ready(function () { 

  var experimentsAll = document.getElementById('experimentsAll')
  if (experimentsAll) {
    experimentsGetAll()
  }
  var userList = document.getElementById('userList')
  if (userList) {
    userListShow()
  }
  var reservaHistAll = document.getElementById('reservaHistAll')
  if (reservaHistAll) {
    reservaHistoryAll()
  }
})