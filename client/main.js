var microphone = new Wit.Microphone(document.getElementById('microphone'));
var info = function (message) {
  document.getElementById('info').innerHTML = message;
};
var error = function (message) {
  document.getElementById('error').innerHTML = message;
};

// Microphone part
microphone.onready = function () {
  info('Mikrofon gotowy do nagrywania');
}
microphone.onaudiostart = function () {
  info('Nagrywanie rozpoczęte');
  error('');
};
microphone.onaudioend = function () {
  info('Nagrywanie zakończone, trwa konwertowanie')
};
microphone.onresult = function (intent, entities) {
  var r = kv('intent', intent);

  for (var k in entities) {
    var e = entities[k];

    if (!(e instanceof Array)) {
      r += kv(k, e.value);
    } else {
      for (var i = 0; i < e.length; i++) {
        r += kv(k, e[i].value);
      }
    }
  }

  document.getElementById('result').innerHTML = r;
};
microphone.onerror = function (errorMessage) {
  error('Błąd:' + errorMessage);
};
microphone.onconnecting = function () {
  info('Trwa weryfikowanie mikrofonu');
};
microphone.ondisconnected = function () {
  info('Mikrofon nie jest podłączony');
};

// Client TOKEN from Wit.ai
microphone.connect('R7RADAE267B7ZVLUJFAV477J2A73E3OL');

// Additional
function kv (k, v) {
  if (toString.call(v) !== "[object String]") {
    v = JSON.stringify(v);
  }
  return k + "=" + v + "\n";
}
