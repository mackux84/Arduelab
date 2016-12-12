'use strict'
var $ = require('jquery')

var Timer = document.getElementById('Timer')
if (Timer) {
  $.ajax({
    type: 'POST',
    url: '/users/checkTime',
    dataType: 'json',
    headers: {
      'Authorization': window.location.pathname.split('/')[3]
    },
    success: function (json) {
      var deadline = new Date(Date.parse(new Date()) + parseInt(json))
      initializeClock('Timer', deadline)
    },
    error: function (json) {
      if (json.responseJSON.statusCode === 401) {
        alert(json.responseJSON.message)
      } else {
        alert(json)
      }
    }
  })
}
function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date())
  var seconds = Math.floor((t / 1000) % 60)
  var minutes = Math.floor((t / 1000 / 60) % 60)
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24)
  return {
    'total': t,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  }
}
function initializeClock(id, endtime) {
  var clock = document.getElementById(id)
  var hoursSpan = clock.querySelector('.hours')
  var minutesSpan = clock.querySelector('.minutes')
  var secondsSpan = clock.querySelector('.seconds')

  function updateClock() {
    var t = getTimeRemaining(endtime)
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2)
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2)
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2)
    if (t.total <= 0) {
      clearInterval(timeinterval)
      alert('Login Time Expired')
      window.location = '/'
    }
  }

  updateClock()
  var timeinterval = setInterval(updateClock, 1000)
}
