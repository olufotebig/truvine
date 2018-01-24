const $ = require("jquery");
window.$ = $;
require("bootstrap");
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBtmzDxBuent3tJKaAwcy48SE1FcI0DQfY",
  authDomain: "truvine-c3d44.firebaseapp.com",
  databaseURL: "https://truvine-c3d44.firebaseio.com",
  projectId: "truvine-c3d44",
  storageBucket: "truvine-c3d44.appspot.com",
  messagingSenderId: "420767839277"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

var $js_properties = $("#js-properties").first();

function clearProperties() {
  $js_properties.html("");
}

function appendProperty(innerHTML) {
  $js_properties.append(innerHTML);
}

function apiDataToHTML(apiData) {
  return `<div class="row pt-4 pb-4 mb-4 bg-white">
    <div class="col-sm-3">
        <a href="#" class="text-dark" style="text-decoration: none;">
            <div class="card">
                <img class="card-img-top" src="${
                  apiData.image.cover
                }" alt="property image">
            </div>
        </a>
    </div>
    <div class="col-sm-9">
        <p>${apiData.description}</p>
        <p>Location: ${apiData.location.display}</p>
        <h3>&#x20A6; ${apiData.price.naira}</h3>
    </div>
    </div>`;
}
/**
db
  .collection("properties")
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      appendProperty(apiDataToHTML(doc.data()));
    });
  });
 */
