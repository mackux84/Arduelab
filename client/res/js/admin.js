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
        '<table class="myTable pure-table" id="usersTable">'
        + '<thead>'
        + '<tr class="Theader" >'
        + '<th>Identificacion</th>'
        //+ '<th  >Fecha de creacion</th>'
        //+ '<th  >Fecha de modificacion</th>'
        + '<th>Nombre</th>'
        + '<th>Email</th>'
        + '<th>Universidad / organizacion</th>'
        + '<th>Telefono</th>'
        + '<th>Celular</th>'
        + '<th>Scope</th>'
        + '<th>Verificado</th>'

        // + '<th data-sort-method="none" class="no-sort">Reservas</th>'
        + '<th data-sort-method="none" class="no-sort">Password</th>'
        + '<th data-sort-method="none" class="no-sort">Guardar Cambios</th>'
        + '<th data-sort-method="none" class="no-sort">Reiniciar Cambios</th>'
        + '</tr>'
        + '</thead>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        if (!element.identification) {
          element.identification = ''
        }
        if (!element.telephone) {
          element.telephone = ''
        }
        if (!element.cellphone) {
          element.cellphone = ''
        }
        table +=
          '<tr class="searchItem">'
          //+ '<td>' + element._id + '</td>'
          //+ '<td >' + new Date(element.created_At) + '</td>'
          //+ '<td >' + new Date(element.updated_At) + '</td>'
          + '<td data-sort=' + element.identification + '><input type="text" name="idCreator;' + element._id + '" Value="' + element.identification + '" id="' + element._id + ';' + element.identification + '"/></td>'
          + '<td data-sort=' + element.username + '><input type="text" name="usernameUser;' + element._id + '" Value="' + element.username + '" id="' + element._id + ';' + element.username + '"/></td>'
          + '<td data-sort=' + element.email + '><input type="email" name="emailUser;' + element._id + '" Value="' + element.email + '" id="' + element._id + ';' + element.email + '"/></td>'
          + '<td data-sort=' + element.university + '><input type="text" name="universityUser;' + element._id + '" Value="' + element.university + '" id="' + element._id + ';' + element.university + '"/></td>'
          + '<td data-sort=' + element.telephone + '><input type="text" name="telephoneCreator;' + element._id + '" Value="' + element.telephone + '" id="' + element._id + ';' + element.telephone + '"/></td>'
          + '<td data-sort=' + element.cellphone + '><input type="text" name="cellphoneCreator;' + element._id + '" Value="' + element.cellphone + '" id="' + element._id + ';' + element.cellphone + '"/></td>'
          + '<td data-sort=' + element.scope + '><select name="selectUser;' + element._id + '" id="' + element._id + ';' + element.scope + '">'
        if (element.scope === 'Admin') {
          table += '<option value="User">User</option>'
            + '<option value="Creator">Creator</option>'
            + '<option value="Admin" selected="selected">Admin</option>'
        } else {
          if (element.scope === 'User') {
            table += '<option value="User" selected="selected">User</option>'
              + '<option value="Creator">Creator</option>'
              + '<option value="Admin">Admin</option>'
          } else {
            table += '<option value="User">User</option>'
              + '<option value="Creator" selected="selected">Creator</option>'
              + '<option value="Admin">Admin</option>'
          }
        }
        table += '</select></td>'
        if (element.isVerified) {
          table += '<td data-sort="true"><input type="checkbox" name="isVerified;' + element._id + '" Value="' + element.isVerified + '" id="' + element._id + ';' + element.isVerified + '" checked/></td>'
        } else {
          table += '<td data-sort="false"><input type="checkbox" name="isVerified;' + element._id + '" Value="' + element.isVerified + '" id="' + element._id + ';' + element.isVerified + '" /></td>'
        }
        table +=
          // '<td><button class="reservasUser" name="' + element._id + '">Ver</button></td>'
          '<td><button class="resetPWD pure-button" name="' + element._id + '">Reset</button></td>'
          + '<td><button class="editarUser pure-button" name="' + element._id + '">Editar</button></td>'
          + '<td><button class="reiniciarUser pure-button" name="' + element._id + '">Cancelar</button></td>'
          + '</tr>'
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
            identification: $('[name="idCreator;' + name_id + '"]').val(),
            username: $('[name="usernameUser;' + name_id + '"]').val(),
            university: $('[name="universityUser;' + name_id + '"]').val(),
            telephone: $('[name="telephoneCreator;' + name_id + '"]').val(),
            cellphone: $('[name="cellphoneCreator;' + name_id + '"]').val(),
            scope: $('[name="selectUser;' + name_id + '"]').val(),
            isVerified: $('[name="isVerified;' + name_id + '"]').is(':checked')
          }
        } else {
          jsonData = {
            identification: $('[name="idCreator;' + name_id + '"]').val(),
            username: $('[name="usernameUser;' + name_id + '"]').val(),
            email: $('[name="emailUser;' + name_id + '"]').val(),
            university: $('[name="universityUser;' + name_id + '"]').val(),
            telephone: $('[name="telephoneCreator;' + name_id + '"]').val(),
            cellphone: $('[name="cellphoneCreator;' + name_id + '"]').val(),
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
            userListShow()
          },
          error: function (json) {
            if (json.status == 400) {
              var mess = json.responseJSON.message.toString()
              if (mess.indexOf('child "') !== -1) {
                var arr = mess.split('"')
                switch (arr[1]) {
                  case 'identification':
                    alert('Error en el campo ID')
                    break
                  case 'name':
                    alert('Error en el campo Nombre')
                    break
                  case 'email':
                    alert('Error en el campo Email')
                    break
                  case 'university':
                    alert('Error en el campo Universidad')
                    break
                  case 'telephone':
                    alert('Error en el campo Telefono')
                    break
                  case 'cellphone':
                    alert('Error en el campo Celular')
                    break
                  default:
                    alert('Something went wrong!')
                    break
                }
              } else {
                alert(json.responseJSON.message)
              }
            }
          }
        })
      })
      $('.reiniciarUser').on('click', function (e) {
        //Reset user values
        e.preventDefault()
        var name_id = $(this).attr('name')
        $('[name="idCreator;' + name_id + '"]').attr('value', $('[name="idCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="idCreator;' + name_id + '"]').val($('[name="idCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="usernameUser;' + name_id + '"]').attr('value', $('[name="usernameUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="usernameUser;' + name_id + '"]').val($('[name="usernameUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="emailUser;' + name_id + '"]').attr('value', $('[name="emailUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="emailUser;' + name_id + '"]').val($('[name="emailUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="universityUser;' + name_id + '"]').attr('value', $('[name="universityUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="universityUser;' + name_id + '"]').val($('[name="universityUser;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="telephoneCreator;' + name_id + '"]').attr('value', $('[name="telephoneCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="telephoneCreator;' + name_id + '"]').val($('[name="telephoneCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="cellphoneCreator;' + name_id + '"]').attr('value', $('[name="cellphoneCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="cellphoneCreator;' + name_id + '"]').val($('[name="cellphoneCreator;' + name_id + '"]').attr('id').split(';')[1])
        if ($('[name="selectUser;' + name_id + '"]').prop('id').split(';')[1] === 'Admin') {
          $('[name="selectUser;' + name_id + '"] option[value="Admin"]').prop('selected', 'selected')
        } else {
          if ($('[name="selectUser;' + name_id + '"]').prop('id').split(';')[1] === 'Creator') {
            $('[name="selectUser;' + name_id + '"] option[value="Creator"]').prop('selected', 'selected')
          } else {
            $('[name="selectUser;' + name_id + '"] option[value="User"]').prop('selected', 'selected')
          }
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
        '<table class="myTable pure-table" id="reservesTable">'
        + '<thead>'
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
        + '</thead>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        var ini = (new Date(element.created_At)).toLocaleString()
        var fin = (new Date(element.initialDate)).toUTCString()
        table +=
          '<tr class="searchItem">'
          // + '<td>' + element._id + '</td>'
          + '<td>' + (index + 1) + '</td>'
          + '<td><textarea readonly>' + element.token + '</textarea></td>'
          + '<td>' + element.expName + '</td>'
          + '<td>' + ini + '</td>'
          + '<td>' + fin.substring(0, fin.length - 3) + '</td>'
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
          '<td><button class="guardarReserva pure-button" name="' + element._id + '">Guardar</button></td>'
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
            reservaHistoryAll()
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
$('input[name=crearExpDays]').change(function () {
  var crearExpDays = $('input[name=crearExpDays]:checked').map(
    function () {
      return this.value
    }).get().join(',')
  $('#daysFormat').val('[' + crearExpDays + ']')
  $('#daysFormat').attr('value', '[' + crearExpDays + ']')
})
$('input[name=crearExpDuration]').change(function () {
  var crearExpDuration = $('input[name=crearExpDuration]:checked').map(
    function () {
      return this.value
    }).get().join(',')
  $('#durationFormat').val('[' + crearExpDuration + ']')
  $('#durationFormat').attr('value', '[' + crearExpDuration + ']')
})
function LookupCreador() {
  var selectedCreator = $('#crearExpEmailCreador').val()
  var jsonData = {
    email: selectedCreator,
  }
  var jsonData2 = JSON.stringify(jsonData)
  $.ajax({
    type: 'POST',
    url: '/users/getAllCreators',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    data: jsonData2,
    dataType: 'json',
    contentType: 'application/json',
    success: function (json) {
      $('#crearExpNombreCreador').val(json[0].username)
      $('#crearExpNombreCreador').attr('value', json[0].username)
      $('#crearExpNombreCreador').attr('name', json[0]._id)
      $('#crearExpIDCreador').val(json[0].identification)
      $('#crearExpIDCreador').attr('value', json[0].identification)

      $('#idCreator').val(json[0]._id)
      $('#idCreator').attr('value', json[0]._id)

      document.getElementById('crearExp').disabled = false
    },
    error: function (json) {
      alert('Email de Donador no encontrado')
      //console.log(json)
    }
  })
}
$('#LookupCreador').on('click', function (e) {
  LookupCreador()
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
        '<table class="myTable pure-table" id="experimentsTable">'
        + '<thead>'
        + '<tr class="Theader" >'
        + '<th>ID: </td>'
        + '<th>Fecha de creación: </th>'
        + '<th>Nombre: </th>'
        + '<th>Universidad: </th>'
        + '<th>País: </th>'
        + '<th>Ciudad: </th>'
        + '<th>ID Donador: </th>'
        + '<th>Arduino: </th>'
        + '<th>Descripción: </th>'
        + '<th>Url Experimento: </th>'
        + '<th>Dias validos: </th>'
        + '<th>Horas validas: </th>'
        + '<th>Duraciones permitidas: </th>'
        + '<th>Disponible: </th>'
        + '<th>Habilitado por administrador: </th>'
        + '<th>PDF: </th>'
        + '<th>Imagen: </th>'
        + '<th data-sort-method="none" class="no-sort">Guardar Cambios</th>'
        + '<th data-sort-method="none" class="no-sort">Reiniciar Cambios</th>'
        + '</tr>'
        + '</thead>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        table +=
          '<tr class="searchItem">'
          + '<td>' + element._id + '</td>'
          + '<td>' + new Date(element.created_At).toLocaleString() + '</td>'
          + '<td data-sort="' + element.name + '"><input type="text" name="nameExp;' + element._id + '" Value="' + element.name + '" id="' + element._id + ';' + element.name + '"/></td>'
          + '<td data-sort=' + element.university + '><input type="text" name="universityExp;' + element._id + '" Value="' + element.university + '" id="' + element._id + ';' + element.university + '"/></td>'

          + '<td data-sort=' + element.country + '><input type="text" name="countryExp;' + element._id + '" Value="' + element.country + '" id="' + element._id + ';' + element.country + '"/></td>'
          + '<td data-sort=' + element.city + '><input type="text" name="cityExp;' + element._id + '" Value="' + element.city + '" id="' + element._id + ';' + element.city + '"/></td>'
          + '<td data-sort=' + element.docCreator + '>'
          + '<input type="text" class="docCreatorExp" name="docCreatorExp;' + element._id + '" Value="' + element.docCreator + '" id="' + element._id + ';' + element.docCreator + '"/>'
          + '<input type="text" name="idCreatorExp;' + element._id + '" Value="' + element.idCreator + '" id="' + element._id + ';' + element.idCreator + '" style="display:none;"/>'
          + '<button class="verificarCreador" name="' + element._id + '">Confirmar</button>'
          + '</td>'
          + '<td data-sort=' + element.arduino + '><input type="text" name="arduinoExp;' + element._id + '" Value="' + element.arduino + '" id="' + element._id + ';' + element.arduino + '"/></td>'
          + '<td><textarea name="descriptionExp;' + element._id + '" Value="' + element.description + '" id="' + element._id + ';' + element.description + '">' + element.description + '</textarea></td>'
          + '<td data-sort=' + element.url + '><input type="url" name="urlExp;' + element._id + '" Value="' + element.url + '" id="' + element._id + ';' + element.url + '"/></td>'
          + '<td data-sort=' + element.days + '><input type="text" name="daysExp;' + element._id + '" Value="' + element.days + '" id="' + element._id + ';' + element.days + '"/></td>'
          + '<td data-sort=' + element.schedule + '><input type="text" name="scheduleExp;' + element._id + '" Value="' + element.schedule + '" id="' + element._id + ';' + element.schedule + '"/></td>'
          + '<td data-sort=' + element.duration + '><input type="text" name="durationExp;' + element._id + '" Value="' + element.duration + '" id="' + element._id + ';' + element.duration + '"/></td>'
        if (element.enabled) {
          table += '<td data-sort="true"><input type="checkbox" name="isEnabledExp;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '" checked/></td>'
        } else {
          table += '<td data-sort="false"><input type="checkbox" name="isEnabledExp;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '" /></td>'
        }
        if (element.adminEnabled) {
          table += '<td data-sort="true"><input type="checkbox" name="isAdminEnabledExp;' + element._id + '" Value="' + element.adminEnabled + '" id="' + element._id + ';' + element.adminEnabled + '" checked/></td>'
        } else {
          table += '<td data-sort="false"><input type="checkbox" name="isAdminEnabledExp;' + element._id + '" Value="' + element.adminEnabled + '" id="' + element._id + ';' + element.adminEnabled + '" /></td>'
        }
        table +=
          '<td><a href="/pdf/' + element._id + '.pdf" download="' + element.name + '.pdf"><img class="downImg" src="/images/DL.png" alt="Download"></a></td>'
          + '<td><a href="/img/' + element._id + '.jpg" download="' + element.name + '.jpg"/><img src="/img/' + element._id + '.jpg" style="height: 90px; width: 90px;" height="50" width="50"></a></td>'
          + '<td><button class="editarExp pure-button" name="' + element._id + '" id="editarExp;' + element._id + '">Guardar</button></td>'
          + '<td><button class="reiniciarExp pure-button" name="' + element._id + '">Reiniciar</button></td>'
          + '</tr>'
      }
      table += '</table>'
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
          city: $('[name="cityExp;' + name_id + '"]').val(),
          country: $('[name="countryExp;' + name_id + '"]').val(),
          idCreator: $('[name="idCreatorExp;' + name_id + '"]').val(),
          docCreator: $('[name="docCreatorExp;' + name_id + '"]').val(),
          arduino: $('[name="arduinoExp;' + name_id + '"]').val(),
          description: $('[name="descriptionExp;' + name_id + '"]').val(),
          url: $('[name="urlExp;' + name_id + '"]').val(),
          days: '[' + $('[name="daysExp;' + name_id + '"]').val() + ']',
          schedule: '[' + $('[name="scheduleExp;' + name_id + '"]').val() + ']',
          duration: '[' + $('[name="durationExp;' + name_id + '"]').val() + ']',
          enabled: $('[name="isEnabledExp;' + name_id + '"]').is(':checked'),
          adminEnabled: $('[name="isAdminEnabledExp;' + name_id + '"]').is(':checked')
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
        $('[name="countryExp;' + name_id + '"]').attr('value', $('[name="countryExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="countryExp;' + name_id + '"]').val($('[name="countryExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="cityExp;' + name_id + '"]').attr('value', $('[name="cityExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="cityExp;' + name_id + '"]').val($('[name="cityExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="docCreatorExp;' + name_id + '"]').attr('value', $('[name="docCreatorExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="docCreatorExp;' + name_id + '"]').val($('[name="docCreatorExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="idCreatorExp;' + name_id + '"]').attr('value', $('[name="idCreatorExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="idCreatorExp;' + name_id + '"]').val($('[name="idCreatorExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="arduinoExp;' + name_id + '"]').attr('value', $('[name="arduinoExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="arduinoExp;' + name_id + '"]').val($('[name="arduinoExp;' + name_id + '"]').attr('id').split(';')[1])
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
        $('[name="isEnabledExp;' + name_id + '"]').attr('value', $('[name="isEnabledExp;' + name_id + '"]').attr('id').split(';')[1])
        if ($('[name="isEnabledExp;' + name_id + '"]').attr('value') === 'true') {
          $('[name="isEnabledExp;' + name_id + '"]').prop('checked', true)
        } else {
          $('[name="isEnabledExp;' + name_id + '"]').prop('checked', false)
        }
        if ($('[name="isAdminEnabledExp;' + name_id + '"]').attr('value') === 'true') {
          $('[name="isAdminEnabledExp;' + name_id + '"]').prop('checked', true)
        } else {
          $('[name="isAdminEnabledExp;' + name_id + '"]').prop('checked', false)
        }
        document.getElementById('editarExp;' + name_id).disabled = true
        $('[name="idCreatorExp;' + name_id + '"]').val('')
      })
      $('.verificarCreador').on('click', function (e) {
        var name_id = $(this).attr('name')
        var selectedCreator = $('[name="docCreatorExp;' + name_id + '"]').val()
        var jsonData = {
          email: selectedCreator,
        }
        var jsonData2 = JSON.stringify(jsonData)
        $.ajax({
          type: 'POST',
          url: '/users/getAllCreators',
          headers: {
            'Authorization': window.location.pathname.split('/')[3]
          },
          data: jsonData2,
          dataType: 'json',
          contentType: 'application/json',
          success: function (json) {
            $('[name="idCreatorExp;' + name_id + '"]').val(json[0]._id)
            $('[name="idCreatorExp;' + name_id + '"]').attr('value', json[0]._id)
            document.getElementById('editarExp;' + name_id).disabled = false
            alert('Id de Donador correcto')
          },
          error: function (json) {
            alert('Id de Donador no encontrado')
            //console.log(json)
          }
        })
      })
      $('.docCreatorExp').keyup(function (e) {
        var name_id = $(this).attr('name').split(';')[1]
        document.getElementById('editarExp;' + name_id).disabled = true
        $('[name="idCreatorExp;' + name_id + '"]').val('')
      })
      console.log('table w3:' + $('#experimentsTable').width())
    },
    error: function (json) {
      alert(json.responseJSON.message)
    }
  })
}
$('#experimentsTable').on('change', function (e) {
  console.log('table w4:' + $('#experimentsTable').width())
})
$('#file-form').on('submit', function (e) {
  e.preventDefault()
})
$('#file-select').change(function () {
  var file = this.files[0]
  /*var name = file.name
  var size = file.size
  var type = file.type*/
  document.getElementById('crearExp').disabled = true
  document.getElementById('crearExp').className = "pure-button-disabled crearExp"


  if (file.name.length < 1) {
    console.log('file.name.length < 1')
    document.getElementById('temporalUp').value = ""
  }
  else if (file.size > 30 * Math.pow(1024, 2)) {
    alert('The file is too big')
  }
  /*else if (file.type ! = 'image/png' && file.type ! = 'image/jpg' && file.type ! = 'image/gif' && file.type ! = 'image/jpeg') {
    alert('The file does not match png, jpg or gif')
  }*/
  else {
    if (document.getElementById('temporalUp').value == "") {
      document.getElementById('temporalUp').value = "2";
    } else if (document.getElementById('temporalUp').value == "1") {
      document.getElementById('temporalUp').value = "12";
    }

    if ((document.getElementById('temporalUp').value == "12")) {
      // console.log("asd2");
      document.getElementById('crearExp').disabled = false
      document.getElementById('crearExp').className = "pure-button-primary crearExp"
    }
  }
})
$('#file-select2').change(function () {
  var file = this.files[0]
  /*var name = file.name
  var size = file.size
  var type = file.type*/
  document.getElementById('crearExp').disabled = true
  document.getElementById('crearExp').className = "pure-button-disabled crearExp"

  if (file.name.length < 1) {
    console.log('file.name.length < 1')
    document.getElementById('file-select2').value = ""
  }
  else if (file.size > 3 * Math.pow(1024, 2)) {
    alert('The file is too big')
  }
  else {
    if (document.getElementById('temporalUp').value == "") {
      document.getElementById('temporalUp').value = "1";
    } else if (document.getElementById('temporalUp').value == "2") {
      document.getElementById('temporalUp').value = "21";
    }

    if ((document.getElementById('temporalUp').value == "21")) {
      // console.log("asd2");
      document.getElementById('crearExp').disabled = false
      document.getElementById('crearExp').className = "pure-button-primary crearExp"
    }
  }
})
$('#crearExp').click(function () {
  var crearExpScheduleMin = $('#crearExpScheduleMin').text()
  crearExpScheduleMin = parseInt(crearExpScheduleMin.toString())
  var crearExpScheduleMax = $('#crearExpScheduleMax').text()
  if (crearExpScheduleMax == '23.59') {
    crearExpScheduleMax = '24'
  }
  crearExpScheduleMax = parseInt(crearExpScheduleMax.toString())
  $('#scheduleFormat').val('[' + crearExpScheduleMin + ',' + crearExpScheduleMax + ']')
  $('#scheduleFormat').attr('value', '[' + crearExpScheduleMin + ',' + crearExpScheduleMax + ']')
  var crearExpScheduleMin2 = $('#crearExpScheduleMin2').text()
  crearExpScheduleMin2 = parseInt(crearExpScheduleMin2.toString())
  var crearExpScheduleMax2 = $('#crearExpScheduleMax2').text()
  if (crearExpScheduleMax2 == '23.59') {
    crearExpScheduleMax2 = '24'
  }
  crearExpScheduleMax2 = parseInt(crearExpScheduleMax2.toString())
  $('#scheduleFormat2').val('[' + crearExpScheduleMin2 + ',' + crearExpScheduleMax2 + ']')
  $('#scheduleFormat2').attr('value', '[' + crearExpScheduleMin2 + ',' + crearExpScheduleMax2 + ']')

  var form = $('#file-form').get(0)
  var formData = new FormData(form)
  $.ajax({
    url: '/users/CreateExpUpload',
    type: 'POST',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    data: formData,
    // Options to tell jQuery not to process data or worry about the content-type
    cache: false,
    contentType: false,
    processData: false,
    xhr: function () {  // custom xhr
      var myXhr = $.ajaxSettings.xhr()
      if (myXhr.upload) { // if upload property exists
        // myXhr.upload.addEventListener('progress', progressHandlingFunction, false) // progressbar
      }
      return myXhr
    },
    success: function (data) {
      if (typeof data.error === 'undefined') {
        // console.log('success')
        alert(data.message)
        // var jsondata = JSON.parse(data)
        // console.log(jsondata.filename)
        // alert('PDF Preparado')
        // $('#pdffile').val(jsondata.filename)
        // $('#pdffile').attr('value', jsondata.filename)
        experimentsGetAll()
      }
      else {
        // console.log('ERRORS:')
        // console.log(data.error)
        alert('Something went wrong!')
      }
    },
    error: function (error) {
      // console.log('ERRORS:')
      // console.log(error)
      alert('Something went wrong!')
    }
  })
})
$(document).ready(function () {

  var experimentsAll = document.getElementById('experimentsAll')
  if (experimentsAll) {
    experimentsGetAll()
  }
  var experimentsCreator = document.getElementById('experimentsCreator')
  if (experimentsCreator) {
    experimentsGetCreator()
  }
  var userList = document.getElementById('userList')
  if (userList) {
    userListShow()
  }
  var reservaHistAll = document.getElementById('reservaHistAll')
  if (reservaHistAll) {
    reservaHistoryAll()
  }
  /*var creatorList = document.getElementById('creadoresList')
  if (creatorList) {
    creatorListShow()
  }*/

  var text_max = 250
  $('#textarea_feedback').html(text_max + ' characters remaining')

  $('#crearExpDesc').keyup(function () {
    var text_length = $('#crearExpDesc').val().length
    var text_remaining = text_max - text_length
    $('#textarea_feedback').html(text_remaining + ' characters remaining')
  })

  document.getElementById('crearExp').disabled = true
  $('#crearExpEmailCreador').keyup(function () {
    document.getElementById('crearExp').disabled = true
    $('#crearExpNombreCreador').val('')
    $('#crearExpNombreCreador').attr('value', '')
    $('#crearExpNombreCreador').attr('name', '')
    $('#crearExpIDCreador').val('')
    $('#crearExpIDCreador').attr('value', '')
  })


  $('.wrapper1').on('scroll', function (e) {
    $('.wrapper2').scrollLeft($('.wrapper1').scrollLeft())
  })
  $('.wrapper2').on('scroll', function (e) {
    $('.wrapper1').scrollLeft($('.wrapper2').scrollLeft())
  })
  //el ancho no lo toma, toco con un hack, se crean 2 tablas, asi si toma el ancho
  // $('.div1').width($('#experimentsTable').width())
  // $('#experimentsAll').width($('#experimentsTable').width())
  // $('.div1').width($('#experimentsTable').scrollWidth)
  // $('.div1').width(150)
  // console.log('table w0:' + $('#experimentsTable').width())
})

function experimentsGetCreator() {
  $('#experimentsCreator').html('')
  var jsonData = {
    email: $('#crearExpEmailCreador').val(),
  }
  var jsonData2 = JSON.stringify(jsonData)
  $.ajax({
    type: 'POST',
    url: '/users/experimentsAdmin',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    data: jsonData2,
    dataType: 'json',
    contentType: 'application/json',
    success: function (json) {
      var table =
        '<table class="myTable pure-table" id="experimentsTableCreator">'
        + '<thead>'
        + '<tr class="Theader" >'
        + '<th>ID: </td>'
        + '<th>Fecha de creación: </th>'
        + '<th>Nombre: </th>'
        + '<th>Universidad: </th>'
        + '<th>País: </th>'
        + '<th>Ciudad: </th>'
        + '<th>Arduino: </th>'
        + '<th>Descripción: </th>'
        + '<th>Url Experimento: </th>'
        + '<th>Dias validos: </th>'
        + '<th>Horas validas: </th>'
        + '<th>Duraciones permitidas: </th>'
        + '<th>Disponible: </th>'
        + '<th>Habilitado por administrador: </th>'
        + '<th>PDF: </th>'
        + '<th>Imagen: </th>'
        + '<th data-sort-method="none" class="no-sort">Guardar Cambios</th>'
        + '<th data-sort-method="none" class="no-sort">Reiniciar Cambios</th>'
        + '</tr>'
        + '</thead>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        table +=
          '<tr class="searchItem">'
          + '<td>' + element._id + '</td>'
          + '<td>' + new Date(element.created_At).toLocaleString() + '</td>'
          + '<td data-sort="' + element.name + '"><input type="text" name="nameExp;' + element._id + '" Value="' + element.name + '" id="' + element._id + ';' + element.name + '"/></td>'
          + '<td data-sort=' + element.university + '><input type="text" name="universityExp;' + element._id + '" Value="' + element.university + '" id="' + element._id + ';' + element.university + '"/></td>'
          + '<td data-sort=' + element.country + '><input type="text" name="countryExp;' + element._id + '" Value="' + element.country + '" id="' + element._id + ';' + element.country + '"/></td>'
          + '<td data-sort=' + element.city + '><input type="text" name="cityExp;' + element._id + '" Value="' + element.city + '" id="' + element._id + ';' + element.city + '"/></td>'
          + '<td data-sort=' + element.arduino + '><input type="text" name="arduinoExp;' + element._id + '" Value="' + element.arduino + '" id="' + element._id + ';' + element.arduino + '"/></td>'
          + '<td><textarea name="descriptionExp;' + element._id + '" Value="' + element.description + '" id="' + element._id + ';' + element.description + '">' + element.description + '</textarea></td>'
          + '<td data-sort=' + element.url + '><input type="url" name="urlExp;' + element._id + '" Value="' + element.url + '" id="' + element._id + ';' + element.url + '"/></td>'
          + '<td data-sort=' + element.days + '><input type="text" name="daysExp;' + element._id + '" Value="' + element.days + '" id="' + element._id + ';' + element.days + '"/></td>'
          + '<td data-sort=' + element.schedule + '><input type="text" name="scheduleExp;' + element._id + '" Value="' + element.schedule + '" id="' + element._id + ';' + element.schedule + '"/></td>'
          + '<td data-sort=' + element.duration + '><input type="text" name="durationExp;' + element._id + '" Value="' + element.duration + '" id="' + element._id + ';' + element.duration + '"/></td>'
        if (element.enabled) {
          table += '<td data-sort="true"><input type="checkbox" name="isEnabledExp;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '" checked/></td>'
        } else {
          table += '<td data-sort="false"><input type="checkbox" name="isEnabledExp;' + element._id + '" Value="' + element.enabled + '" id="' + element._id + ';' + element.enabled + '"/></td>'
        }
        if (element.adminEnabled) {
          table += '<td data-sort="true"><input type="checkbox" name="isAdminEnabledExp;' + element._id + '" Value="' + element.adminEnabled + '" id="' + element._id + ';' + element.adminEnabled + '" checked disabled/></td>'
        } else {
          table += '<td data-sort="false"><input type="checkbox" name="isAdminEnabledExp;' + element._id + '" Value="' + element.adminEnabled + '" id="' + element._id + ';' + element.adminEnabled + '" disabled/></td>'
        }
        table +=
          '<td><a href="/pdf/' + element._id + '.pdf" download="' + element.name + '.pdf"><img class="downImg" src="/images/DL.png" alt="Download"></a></td>'
          + '<td><a href="/img/' + element._id + '.jpg" download="' + element.name + '.jpg"/><img src="/img/' + element._id + '.jpg" style="height: 90px; width: 90px;" height="50" width="50"></a></td>'
          + '<td><button class="editarExpCreator pure-button" name="' + element._id + '" id="editarExpCreator;' + element._id + '">Guardar</button></td>'
          + '<td><button class="reiniciarExpCreator pure-button" name="' + element._id + '">Reiniciar</button></td>'
          + '</tr>'
      }
      table += '</table >'
      $('#experimentsCreator').html('')
      $('#experimentsCreator').html(table)

      $('.editarExpCreator').on('click', function (e) {
        //patch Experiment
        e.preventDefault()
        var jsonData = {}
        var name_id = $(this).attr('name')
        jsonData = {
          name: $('[name="nameExp;' + name_id + '"]').val(),
          university: $('[name="universityExp;' + name_id + '"]').val(),
          idCreator: $('#idCreator').val(),
          docCreator: $('#crearExpEmailCreador').val(),
          city: $('[name="cityExp;' + name_id + '"]').val(),
          country: $('[name="countryExp;' + name_id + '"]').val(),
          arduino: $('[name="arduinoExp;' + name_id + '"]').val(),
          description: $('[name="descriptionExp;' + name_id + '"]').val(),
          url: $('[name="urlExp;' + name_id + '"]').val(),
          days: '[' + $('[name="daysExp;' + name_id + '"]').val() + ']',
          schedule: '[' + $('[name="scheduleExp;' + name_id + '"]').val() + ']',
          duration: '[' + $('[name="durationExp;' + name_id + '"]').val() + ']',
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
            experimentsGetCreator()
          },
          error: function (json) {
            alert(json.responseJSON.message)
          }
        })
      })
      $('.reiniciarExpCreator').on('click', function (e) {
        //Reset user values
        e.preventDefault()
        var name_id = $(this).attr('name')
        $('[name="nameExp;' + name_id + '"]').attr('value', $('[name="nameExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="nameExp;' + name_id + '"]').val($('[name="nameExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="universityExp;' + name_id + '"]').attr('value', $('[name="universityExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="universityExp;' + name_id + '"]').val($('[name="universityExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="countryExp;' + name_id + '"]').attr('value', $('[name="countryExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="countryExp;' + name_id + '"]').val($('[name="countryExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="cityExp;' + name_id + '"]').attr('value', $('[name="cityExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="cityExp;' + name_id + '"]').val($('[name="cityExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="arduinoExp;' + name_id + '"]').attr('value', $('[name="arduinoExp;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="arduinoExp;' + name_id + '"]').val($('[name="arduinoExp;' + name_id + '"]').attr('id').split(';')[1])
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
        $('[name="isEnabledExp;' + name_id + '"]').attr('value', $('[name="isEnabledExp;' + name_id + '"]').attr('id').split(';')[1])
        if ($('[name="isEnabledExp;' + name_id + '"]').attr('value') === 'true') {
          $('[name="isEnabledExp;' + name_id + '"]').prop('checked', true)
        } else {
          $('[name="isEnabledExp;' + name_id + '"]').prop('checked', false)
        }
        $('[name="idCreatorExp;' + name_id + '"]').val('')
      })
    },
    error: function (json) {
      alert(json.responseJSON.message)
    }
  })
}
/*
function crearExp() {
  var crearExpDays = $('input[name=crearExpDays]:checked').map(
    function () {
      return this.value
    }).get().join(',')
  var crearExpDuration = $('input[name=crearExpDuration]:checked').map(
    function () {
      return this.value
    }).get().join(',')
  var crearExpScheduleMin = $('#crearExpScheduleMin').text()
  crearExpScheduleMin = parseInt(crearExpScheduleMin.toString())
  var crearExpScheduleMax = $('#crearExpScheduleMax').text()
  if (crearExpScheduleMax == '23.59') {
    crearExpScheduleMax = '24'
  }
  crearExpScheduleMax = parseInt(crearExpScheduleMax.toString())
  var jsonData = {
    idCreator: $('#crearExpNombreCreador').attr('name'),
    docCreator: $('#crearExpEmailCreador').val(),
    name: $('#crearExpNombre').val(),
    university: $('#crearExpUniversidad').val(),
    country: $('#crearExpPais').val(),
    city: $('#crearExpCiudad').val(),
    arduino: $('#crearExpArduino').val(),
    description: $('#crearExpDesc').val(),
    image: $('#crearExpImgUrl').val(),
    url: $('#crearExpUrl').val(),
    days: '[' + crearExpDays + ']',
    schedule: '[' + crearExpScheduleMin + ',' + crearExpScheduleMax + ']',
    duration: '[' + crearExpDuration + ']',
    enabled: $('#crearExpEnabled').is(':checked'),
    pdffile: $('#pdffile').val()
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
      $('#crearExpScheduleMin').val('')
      $('#crearExpScheduleMax').val('')
      $('#crearExpNombreCreador').val('')
      $('#crearExpNombreCreador').attr('name', '')
      $('#crearExpIDCreador').val('')
      $('#crearExpNombre').val('')
      $('#crearExpUniversidad').val('')
      $('#crearExpPais').val('')
      $('#crearExpCiudad').val('')
      $('#crearExpArduino').val('')
      $('#crearExpDesc').val('')
      $('#crearExpImgUrl').val('')
      $('#crearExpUrl').val('')
      $('#pdffile').val('')
    },
    error: function (json) {
      alert(json.responseJSON.message)
    }
  })
}
$('#crearExp').on('click', function (e) {
  crearExp()
})
$('#createExpForm').on('submit', function (e) {
  e.preventDefault()
  crearExp()
  $('#id02').css('display', 'none')
})
function creatorListShow() {
  var selectedCreator = ''
  var jsonData = {
    email: selectedCreator,
  }
  var jsonData2 = JSON.stringify(jsonData)
  $.ajax({
    type: 'POST',
    url: '/users/getAllCreators',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    data: jsonData2,
    dataType: 'json',
    contentType: 'application/json',
    success: function (json) {
      var table =
        '<table class="myTable pure-table" id="creatorsTable">'
        + '<thead>'
        + '<tr class="Theader" >'
        + '<th>Identificacion</th>'
        + '<th>Nombre</th>'
        + '<th>Email</th>'
        + '<th>Telefono</th>'
        + '<th>Celular</th>'
        + '<th data-sort-method="none" class="no-sort">Guardar Cambios</th>'
        + '<th data-sort-method="none" class="no-sort">Reiniciar Cambios</th>'
        + '</tr>'
        + '</thead>'
      for (var index = 0; index < json.length; index++) {
        var element = json[index]
        table +=
          '<tr class="searchItem">'
          + '<td data-sort=' + element.identification + '><input type="text" name="idCreator;' + element._id + '" Value="' + element.identification + '" id="' + element._id + ';' + element.identification + '"/></td>'
          + '<td data-sort=' + element.name + '><input type="text" name="nameCreator;' + element._id + '" Value="' + element.name + '" id="' + element._id + ';' + element.name + '"/></td>'
          + '<td data-sort=' + element.email + '><input type="email" name="emailCreator;' + element._id + '" Value="' + element.email + '" id="' + element._id + ';' + element.email + '"/></td>'
          + '<td data-sort=' + element.telephone + '><input type="text" name="telephoneCreator;' + element._id + '" Value="' + element.telephone + '" id="' + element._id + ';' + element.telephone + '"/></td>'
          + '<td data-sort=' + element.cellphone + '><input type="text" name="cellphoneCreator;' + element._id + '" Value="' + element.cellphone + '" id="' + element._id + ';' + element.cellphone + '"/></td>'
          + '<td><button class="editarCreator pure-button" name="' + element._id + '">Editar</button></td>'
          + '<td><button class="reiniciarCreator pure-button" name="' + element._id + '">Cancelar</button></td>'
          + '</tr>'
      }
      table += '</table >'
      $('#creadoresList').html('')
      $('#creadoresList').html(table)
      $('.editarCreator').on('click', function (e) {
        //patch creator
        e.preventDefault()
        var jsonData = {}
        var name_id = $(this).attr('name')
        if ($('[name="idCreator;' + name_id + '"]').val() === $('[name="idCreator;' + name_id + '"]').attr('id').split(';')[1]) {
          jsonData = {
            name: $('[name="nameCreator;' + name_id + '"]').val(),
            email: $('[name="emailCreator;' + name_id + '"]').val(),
            telephone: $('[name="telephoneCreator;' + name_id + '"]').val(),
            cellphone: $('[name="cellphoneCreator;' + name_id + '"]').val(),
          }
        } else {
          jsonData = {
            identification: $('[name="idCreator;' + name_id + '"]').val(),
            name: $('[name="nameCreator;' + name_id + '"]').val(),
            email: $('[name="emailCreator;' + name_id + '"]').val(),
            telephone: $('[name="telephoneCreator;' + name_id + '"]').val(),
            cellphone: $('[name="cellphoneCreator;' + name_id + '"]').val(),
          }
        }
        console.log(jsonData)
        var jsonData2 = JSON.stringify(jsonData)
        console.log(jsonData2)
        $.ajax({
          type: 'PATCH',
          url: '/creator/' + name_id,
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
      $('.reiniciarCreator').on('click', function (e) {
        //Reset creator values
        e.preventDefault()
        var name_id = $(this).attr('name')
        $('[name="idCreator;' + name_id + '"]').attr('value', $('[name="idCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="idCreator;' + name_id + '"]').val($('[name="idCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="nameCreator;' + name_id + '"]').attr('value', $('[name="nameCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="nameCreator;' + name_id + '"]').val($('[name="nameCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="emailCreator;' + name_id + '"]').attr('value', $('[name="emailCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="emailCreator;' + name_id + '"]').val($('[name="emailCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="telephoneCreator;' + name_id + '"]').attr('value', $('[name="telephoneCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="telephoneCreator;' + name_id + '"]').val($('[name="telephoneCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="cellphoneCreator;' + name_id + '"]').attr('value', $('[name="cellphoneCreator;' + name_id + '"]').attr('id').split(';')[1])
        $('[name="cellphoneCreator;' + name_id + '"]').val($('[name="cellphoneCreator;' + name_id + '"]').attr('id').split(';')[1])
      })
    },
    error: function (json) {
      console.log('get all creators error')
      //console.log(json)
    }
  })
}
function CrearCreador() {
  var jsonData = {
    identification: $('#crearCreadorID').val(),
    name: $('#crearCreadorName').val(),
    email: $('#crearCreadorEmail').val(),
    telephone: $('#crearCreadorTel').val(),
    cellphone: $('#crearCreadorCel').val(),
  }
  var jsonData2 = JSON.stringify(jsonData)
  $.ajax({
    type: 'POST',
    url: '/users/createCreator',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    data: jsonData2,
    dataType: 'json',
    contentType: 'application/json',
    success: function (json) {
      alert(json.message)
      creatorListShow()
      $('#crearCreadorID').val('')
      $('#crearCreadorID').val('')
      $('#crearCreadorEmail').val('')
      $('#crearCreadorTel').val('')
      $('#crearCreadorCel').val('')
    },
    error: function (json) {
      // console.log(json)
      if (json.status == 400) {
        var mess = json.responseJSON.message.toString()
        if (mess.indexOf('child "') !== -1) {
          var arr = mess.split('"')
          switch (arr[1]) {
            case 'identification':
              alert('Error en el campo ID')
              break
            case 'name':
              alert('Error en el campo Nombre')
              break
            case 'email':
              alert('Error en el campo Email')
              break
            case 'telephone':
              alert('Error en el campo Telefono')
              break
            case 'cellphone':
              alert('Error en el campo Celular')
              break
            default:
              alert('Something went wrong!')
              break
          }
        }
      }
    }
  })
}
$('#CrearCreador').on('click', function (e) {
  CrearCreador()
})
*/