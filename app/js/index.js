const $ = require("jquery");
window.$ = $;
require("bootstrap");
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBtmzDxBuent3tJKaAwcy48SE1FcI0DQfY",
  authDomain: "truvine-c3d44.firebaseapp.com",
  databaseURL: "https://truvine-c3d44.firebaseio.com",
  projectId: "truvine-c3d44",
  storageBucket: "truvine-c3d44.appspot.com",
  messagingSenderId: "420767839277"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();
const db_properties = db.collection("properties");
const $js_properties = $("#js-properties").first();

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

function clearDisplay() {
  $js_properties.html("");
}
/**
 * usage: fetchAndDisplay(db_properties),
 * query = db_properties.where("location")
 */
function fetchAndDisplay(query) {
  clearDisplay();
  query.get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      appendProperty(apiDataToHTML(doc.data()));
    });
  });
}

$("#js-location-btns").on("change", "[name=location-option]", function(ev) {
  updateLocation(ev.target.getAttribute("value"));
});

function updateLocation(_location) {
  switch (_location) {
    case "lagos":
      fetchAndDisplay(db_properties.where("location.city", "==", "lagos"));
      break;
    case "abuja":
      fetchAndDisplay(db_properties.where("location.city", "==", "abuja"));
      break;
    case "atlanta":
      fetchAndDisplay(db_properties.where("location.city", "==", "atlanta"));
      break;
    default:
      break;
  }
}

// Initial display
fetchAndDisplay(db_properties);
