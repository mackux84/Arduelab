'use strict'
var $ = require('jquery')

$('#createForm').on('submit', function (e) {
  e.preventDefault()
  var formData = $('#createForm').serializeArray()
  var jsonData = {}
  $.each(formData, function () {
    if (jsonData[this.name]) {
      if (!jsonData[this.name].push) {
        jsonData[this.name] = [jsonData[this.name]]
      }
      jsonData[this.name].push(this.value || '')
    } else {
      jsonData[this.name] = this.value || ''
    }
  })
  var jsonData2 = JSON.stringify(jsonData)
  $.ajax({
    url: '/users',
    cache: false,
    type: 'POST',
    data: jsonData2,
    dataType: 'json',
    contentType: 'application/json',
    success: function (json) {
      alert(json.message)
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
        }else{
          alert(json.responseJSON.message)
        }
      }
    }
  })
})

$('#creatorForm').on('submit', function (e) {
  e.preventDefault()
  var formData = $('#creatorForm').serializeArray()
  var jsonData = {}
  $.each(formData, function () {
    if (jsonData[this.name]) {
      if (!jsonData[this.name].push) {
        jsonData[this.name] = [jsonData[this.name]]
      }
      jsonData[this.name].push(this.value || '')
    } else {
      jsonData[this.name] = this.value || ''
    }
  })
  var jsonData2 = JSON.stringify(jsonData)
  $.ajax({
    url: '/users',
    cache: false,
    type: 'POST',
    data: jsonData2,
    dataType: 'json',
    contentType: 'application/json',
    success: function (json) {
      alert(json.message)
      $("[name='username']").val('')
      $("[name='identification']").val('')
      $("[name='telephone']").val('')
      $("[name='cellphone']").val('')
      $("[name='email']").val('')
      $("[name='password']").val('')
      $("[name='university']").val('')
      $('#id01').css('display', 'none')
      $('#id02').css('display', 'none')
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
        }else{
          alert(json.responseJSON.message)
        }
      }
    }
  })
})