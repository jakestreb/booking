"use strict";

const _ = require("underscore");
const http = require("http");
const crypto = require("crypto");
const ReactDOM = require("react-dom");
const React = require("react");
const cards = require("./cardData.js").cards;
const util = require("../../common/util.js");


function CardForm() {

  this.state = {
    cardNum: "",
    cardType: null,
    cvnNum: "",
    name: "",
    expiry: "",
    cardValidity: {
      message: null,
      valid: null
    },
    cvnValidity: {
      message: null,
      valid: null
    },
    nameValidity: {
      message: null,
      valid: null
    },
    expiryValidity: {
      message: null,
      valid: null
    }
  };

  const FormInput = props => {
    var format = props.format || _.identity;
    var parse = props.parse || _.identity;
    var validClass = props.validity.valid === null ? "" : (props.validity.valid ? "valid" : "invalid");
    return <div className="form_row">
      <div className="label">{props.label}</div>
      <input
        value={format(props.value)}
        className={"form_input " + validClass + " " + props.className}
        placeholder={props.placeholder}
        onChange={e => {
          this.setCardStateProp(props.fieldName, parse(e.target.value));
          if (props.onChange) { props.onChange(e); }
        }}
        onBlur={props.setValidity}
      />
      <div className="error">{props.validity.message}</div>
    </div>;
  };
  FormInput.propTypes = {
    value: React.PropTypes.string,
    validity: React.PropTypes.object.isRequired,
    setValidity: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
    format: React.PropTypes.func,
    parse: React.PropTypes.func,
    fieldName: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    onChange: React.PropTypes.func
  };

  // Credit Card Number Entry DOM
  const CardEntry = props => {
    var valid = this.state.cardValidity.valid;
    var validClass = valid === null ? "" : (valid ? "valid" : "invalid");
    return <div className="card_row">
      <FormInput
        value={props.value}
        validity={this.state.cardValidity}
        setValidity={this.setCardValidity.bind(this)}
        placeholder={Array(4).fill("\u2022".repeat(4)).join(" ")} // Creates dot placeholder pattern
        className="card_input"
        format={this.formatCardNumber}
        parse={input => input.replace(/[^0-9]/g, "").slice(0, 16)}
        fieldName="cardNum"
        label="Card Number"
        onChange={() => {
          this.setCardStateProp("cardType", _.findKey(cards, item => this.state.cardNum.match(item.expr)));
        }}
      />
      <span className={`card_icon pw ${this.state.cardType ? cards[this.state.cardType].class : ""}
        ${validClass}`}></span>
    </div>;
  };
  CardEntry.propTypes = {
    value: React.PropTypes.string.isRequired,
    cardType: React.PropTypes.string
  };

  // Credit Card Form
  const BillingForm = props => {
    var cardType = this.state.cardType;
    var cvnLength = cardType ? cards[cardType].cvnLength : null;
    return <form className="payment_form" onSubmit={props.onSubmit.bind(this)} >
      <CardEntry
        value={this.state.cardNum}
        cardType={this.state.cardType}
      />
      <FormInput
        value={this.state.cvnNum}
        validity={this.state.cvnValidity}
        setValidity={this.setCvnValidity.bind(this)}
        placeholder={"\u2022".repeat(cvnLength || 3)}
        className="card_cvn"
        format={input => input.replace(/[^0-9]/g, "").slice(0, cvnLength || 4)}
        fieldName="cvnNum"
        label="Security Code"
      />
      <FormInput
        value={this.state.name}
        validity={this.state.nameValidity}
        setValidity={this.setNameValidity.bind(this)}
        className="name"
        fieldName="name"
        label="Name on Card"
      />
      <FormInput
        value={this.state.expiry}
        validity={this.state.expiryValidity}
        setValidity={this.setExpiryValidity.bind(this)}
        placeholder="MM / YY"
        className="expiry"
        fieldName="expiry"
        format={input => {
          if (input.length > 2) {
            input = input.slice(0, 2) + " / " + input.slice(2);
          }
          return input;
        }}
        parse={input => input.replace(/[^0-9]/g, "").slice(0, 4)}
        label="Expiry"
      />
      <button type="submit" className="form_submit" >Submit</button>
    </form>;
  };
  BillingForm.propTypes = {
    onSubmit: React.PropTypes.func.isRequired
  };

  this.render = () => {
    ReactDOM.render(
      <BillingForm onSubmit={this.onFormSubmit} />,
      document.getElementById("checkout")
    );
  };

  this.render();
}

CardForm.prototype.onFormSubmit = function(e) {
  e.preventDefault();
  console.warn(this.state);
};

CardForm.prototype.authorize = function() {
  var paymentData = {
    cardNumber: "4111111111111111"
  };

  var xhr = new XMLHttpRequest();
  xhr.open("post", "/authorize", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.addEventListener("error", function(evt) {
    reject(new Error("Upload failed!"));
  });
  xhr.addEventListener("load", function() {
    console.log("load event: " + xhr.responseText);
    if (xhr.status !== 200) {
      reject(new Error("Upload failed: " + (xhr.responseText || xhr.status)));
    } else {
      resolve(JSON.parse(xhr.responseText));
    }
  });
  xhr.send(JSON.stringify(paymentData));
};

CardForm.prototype.setCardStateProp = function(prop, val) {
  this.state[prop] = val;
  this.render();
};

CardForm.prototype.setCardState = function(object) {
  _.extend(this.state, object);
  this.render();
};
      //  TODO!  var cardType = _.findKey(cards, item => input.match(item.expr));


// Formats the credit card number for display in the input text field
CardForm.prototype.formatCardNumber = function(number) {
  var i = 4;
  while (i < number.length) {
    number = number.slice(0, i) + " " + number.slice(i);
    i += 5;
  }
  return number;
};

CardForm.prototype.setCardValidity = function() {
  console.warn('setting card validity');
  var cardNum = this.state.cardNum;
  var cardType = this.state.cardType;
  var message = null;
  var validity = cardNum.length >= 13 && !!cardType && this._luhn(cardNum);
  if (cardNum && !validity) {
    var names = _.map(cards, (item, type) => type);
    var extraNames = names.length > 1 ? names.slice(0, -1).join(", ") + " or " : "";
    message = "Enter a valid " + extraNames + names.slice(-1) + " number";
  }
  this.setCardState({
    cardValidity: {
      message: message,
      valid: cardNum ? validity : null
    }
  });
};

CardForm.prototype.setCvnValidity = function() {
  var cvnNum = this.state.cvnNum;
  var cardType = this.state.cardType;
  var message = null;
  var validity = cardType && cvnNum.length === cards[cardType].cvnLength;
  if (cvnNum && validity) {
    message = "Enter a " + cards[cardType].cvnLength + "-digit number";
  }
  this.setCardState({
    cvnValidity: {
      message: message,
      valid: cvnNum && cardType ? validity : null
    }
  });
};

CardForm.prototype.setNameValidity = function() {
  this.setCardState({
    nameValidity: {
      message: null,
      valid: this.state.name.length ? true : null
    }
  });
};

CardForm.prototype.setExpiryValidity = function() {
  var expMonth = this.state.expiry.slice(0, 2);
  var expYear = this.state.expiry.slice(2);
  var currentYear = new Date().getFullYear();
  var acceptableYears = new Set(util.range(currentYear, 11).map(year => year.toString().slice(2)));
  var message = null;
  var validity = null;
  if (expMonth && expYear) {
    var month = parseInt(expMonth, 10);
    validity = true;
    if (!(month >= 1 && month <= 12)) {
      message = "Invalid month";
      validity = false;
    }
    else if (!acceptableYears.has(expYear)) {
      message = "Invalid year";
      validity = false;
    }
  }
  this.setCardState({
    expiryValidity: {
      message: message,
      valid: validity
    }
  });
};

// The Luhn algorithm for determining card number validity
CardForm.prototype._luhn = function(cardNum) {
  var even = false;
  var check = _.foldr(cardNum, (memo, num) => {
    num = parseInt(num, 10);
    if (even) {
      num = num > 4 ? num * 2 - 9 : num * 2;
    }
    even = !even;
    return memo + num;
  }, 0);
  return (check % 10) === 0;
};


module.exports = CardForm;
