
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var config = {
  "mapsApiKey": "AIzaSyDityEbqSTpZUeG8ZQwTLQWC8o9si8xBLtU",
  "firebaseApiKey": "AIzaSyDityEbqSTpZUeG8ZQwTLQWC8o9si8xBLtU",
  "firebaseDatabaseURL": "https://azul-editions.firebaseio.com",
};

var app = firebase.initializeApp({
  apiKey: config.firebaseApiKey,
  databaseURL: config.firebaseDatabaseURL,
});

var database = app.database();

database.ref('raw-locations').on('value', function(data) {

  $('#loading').hide();

  var transports = data.val();
  transports = Object.keys(transports).map(function(id) {
    var transport = transports[id][0];
    transport.id = id;
    transport.power = Math.round(transport.power);
    moment.locale('es');
    transport.time = moment(transport.time).fromNow();
    transport.map = 'https://maps.googleapis.com/maps/api/staticmap?size=200x200'
        + '&markers=color:blue%7Clabel:' + transport.id + '%7C' + transport.lat
        + ',' + transport.lng + '&key=' + config.mapsApiKey + '&zoom=15';
    return transport;
  });

  var html;
  if (!transports) {
    html = '<p class="empty">Sin vehiculos para localizar.</p>';
  } else {
    html = ejs.render($('#transports-template').html(), {transports: transports});
  }
  $('#transports').html(html);

});