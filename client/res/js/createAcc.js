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
      alert(json.responseJSON.message)
    }
  })
})