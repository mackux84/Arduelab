'use strict'
var $ = require('jquery')

$('#loginForm').on('submit', function (e) {
  e.preventDefault()
  var formData = $('#loginForm').serializeArray()
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
    url: '/users/authenticate',
    cache: false,
    type: 'POST',
    data: jsonData2,
    dataType: 'json',
    contentType: 'application/json',
    success: function (json) {
      window.location.href = '/users/account/'+json.token
    },
    error: function (json) {
      alert(json.responseJSON.message)
    }
  })
})

$('#forgotForm').on('submit', function (e) {
  e.preventDefault()
  var jsonData = {}
  jsonData = {
    email: $('#forgotEmail').val(),
  }
  var jsonData2 = JSON.stringify(jsonData)
  $.ajax({
    type: 'POST',
    url: '/users/forgotPassword',
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