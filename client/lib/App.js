"use strict";

// const http = require("http");
// const crypto = require("crypto");
const CardForm = require("./CardForm.js");

function App() {
  // $(".submit").on("click", function() {
  //   console.warn("Server request to authorize card");
  //   this.type = "Visa";

  //   var paymentData = {
  //     cardNumber: "4111111111111111"
  //   };

  //   var xhr = new XMLHttpRequest();
  //   xhr.open("post", "/authorize", true);
  //   xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  //   xhr.addEventListener("error", function(evt) {
  //     reject(new Error("Upload failed!"));
  //   });
  //   xhr.addEventListener("load", function() {
  //     console.log("load event: " + xhr.responseText);
  //     if (xhr.status !== 200) {
  //       reject(new Error("Upload failed: " + (xhr.responseText || xhr.status)));
  //     } else {
  //       resolve(JSON.parse(xhr.responseText));
  //     }
  //   });
  //   xhr.send(JSON.stringify(paymentData));
  // });
  var form = new CardForm();

}


// Email
// <input class="email"/>
// <input class="email_repeat"/>
// <input class="phone number" />

// <button class="submit">Submit</button>

// Use HTML5 auto-complete attributes

module.exports = App;
