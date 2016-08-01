"use strict";

// const http = require("http");
// const crypto = require("crypto");
const _ = require("underscore");
const ReactDOM = require("react-dom");
const React = require("react");
const cards = require("./cardData.js").cards;

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

  var ErrorMessage = React.createClass({
    propTypes: {
      value: React.PropTypes.string
    },
    render: function() {
      var text = this.props.value;
      if (text) {
        return <div className="error">
          <span className="error_text">{text}</span>
        </div>;
      } else {
        return null;
      }
    }
  });

  var CardEntry = React.createClass({
    propTypes: {
      cardNum: React.PropTypes.string.isRequired,
      cardStatus: React.PropTypes.object.isRequired,
      onUserInput: React.PropTypes.func.isRequired,
      onBlur: React.PropTypes.func.isRequired
    },
    onCardInput: function() {
      var input = this.refs.cardNum.value;
      input = input.replace(/[^0-9]/g, "").slice(0, 16);

      var cardType = null;
      _.forEach(cards, (item, type) => {
        if (this.props.cardNum.match(item.expr)) { cardType = type; }
      });

      this.props.onUserInput(input, cardType);
    },
    formatCardNumber: function(number) {
      var i = 4;
      while (i < number.length) {
        number = number.slice(0, i) + " " + number.slice(i);
        i += 5;
      }
      return number;
    },
    render: function() {
      return <div className="form_row">
        <div className="label">Card Number</div>
        <div className="card_number">
          <input
            value={this.formatCardNumber(this.props.cardNum)}
            className={"form_input card_input " + this.props.cardStatus.class}
            ref="cardNum"
            placeholder={Array(4).fill("\u2022".repeat(4)).join(" ")} // Creates dot placeholder pattern
            onChange={this.onCardInput}
            onBlur={this.props.onBlur}
          />
          <span className={"card_icon pw " + (this.props.cardType ? cards[this.props.cardType].class : "")
            + " " + this.props.cardStatus.class}>
          </span>
        </div>
        <ErrorMessage value={this.props.cardStatus.error} />
      </div>;
    }
  });

  var CvnEntry = React.createClass({
    propTypes: {
      cvnNum: React.PropTypes.string.isRequired,
      cvnStatus: React.PropTypes.object.isRequired,
      cardType: React.PropTypes.string,
      onUserInput: React.PropTypes.func.isRequired,
      onBlur: React.PropTypes.func.isRequired
    },
    onCvnInput: function() {
      var input = this.refs.cvnNum.value;
      input = input.replace(/[^0-9]/g, "").slice(0, this.props.cardType ?
        cards[this.props.cardType].cvnLength : 4);
      this.props.onUserInput(input);
    },
    render: function() {
      var placeholderLength = this.props.cardType ? cards[this.props.cardType].cvnLength : 3;
      return <div className="form_row">
        <div className="label">Security Code</div>
        <input
          value={this.props.cvnNum}
          ref="cvnNum"
          className={"form_input card_cvn " + this.props.cvnStatus.class}
          placeholder={"\u2022".repeat(placeholderLength)}
          onChange={this.onCvnInput}
          onBlur={this.props.onBlur}
        />
        <ErrorMessage value={this.props.cvnStatus.error} />
      </div>;
    }
  });

  var NameEntry = React.createClass({
    propTypes: {
      name: React.PropTypes.string.isRequired,
      nameClass: React.PropTypes.string,
      onUserInput: React.PropTypes.func.isRequired,
      onBlur: React.PropTypes.func.isRequired
    },
    render: function() {
      return <div className="form_row">
        <div className="label">Name on Card</div>
        <input
          value={this.props.name}
          ref="name"
          className={"form_input name " + this.props.nameClass}
          onChange={() => this.props.onUserInput(this.refs.name.value)}
          onBlur={this.props.onBlur}
        />
      </div>;
    }
  });

  // var ExpEntry = React.createClass({
  //   propTypes: {
  //     expMonth: React.PropTypes.string.isRequired,
  //     expYear: React.PropTypes.string.isRequired,
  //     onUserInput: React.PropTypes.func.isRequired,
  //   },
  //   onMonthInput: function(e) {
  //     var input = e.target.value;
  //     input = input.replace(/[^0-9]/g, "").slice(0, 2);
  //     this.props.onChange(Object.assign({}, this.props.value, { month: input }));
  //   },
  //   onYearInput: function(e) {
  //     var input = e.target.value;
  //     input = input.replace(/[^0-9]/g, "").slice(0, 2);
  //     this.props.onChange(Object.assign({}, this.props.value, { year: input }));
  //   },
  //   render: function() {
  //     return (<div>
  //       <input
  //         value={this.props.value.month}
  //         className="form_input card_exp_month"
  //         placeholder="MM"
  //         onChange={this.onMonthInput}
  //       />
  //       <span className="date_slash">/</span>
  //       <input
  //         value={this.props.value.year}
  //         className="form_input card_exp_year"
  //         placeholder="YY"
  //         onChange={this.onYearInput}
  //       />
  //       <ErrorMessage value={this.props.value.error} />
  //     </div>);
  //   }
  // });

  var ExpEntry = React.createClass({
    propTypes: {
      expMonth: React.PropTypes.string.isRequired,
      expYear: React.PropTypes.string.isRequired,
      expStatus: React.PropTypes.object.isRequired,
      onUserInput: React.PropTypes.func.isRequired,
      onBlur: React.PropTypes.func.isRequired
    },
    onExpInput: function() {
      var month = this.refs.expMonth.value;
      var year = this.refs.expYear.value;
      month = month.replace(/[^0-9]/g, "").slice(0, 2);
      year = year.replace(/[^0-9]/g, "").slice(0, 2);
      return this.props.onUserInput(month, year);
    },
    render: function() {
      var placeholderLength = this.props.cardType ? cards[this.props.cardType].cvnLength : 3;
      return <div className="form_row">
        <div className="label">Expiration</div>
        <input
          value={this.props.expMonth}
          ref="expMonth"
          className={"form_input exp_month " + this.props.expStatus.class}
          placeholder="MM"
          onChange={this.onExpInput}
          onBlur={this.props.onBlur}
        />
        <span className="date_slash">/</span>
        <input
          value={this.props.expYear}
          ref="expYear"
          className={"form_input exp_year " + this.props.expStatus.class}
          placeholder="YY"
          onChange={this.onExpInput}
          onBlur={this.props.onBlur}
        />
        <ErrorMessage value={this.props.cvnStatus.error} />
      </div>;
    }
  });


  var BillingForm = React.createClass({
    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      onSubmit: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
      return {
        cardNum: "",
        cardType: null,
        cvnNum: "",
        name: "",
        expMonth: "",
        expYear: "",
        cardStatus: {
          class: "",
          error: null
        },
        cvnStatus: {
          class: "",
          error: null
        },
        nameClass: "",
        expStatus: {
          class: "",
          error: null
        }
      };
    },
    onBlur: function() {
      var cardNum = this.state.cardNum;
      var cardType = this.state.cardType;
      var cardStatus = {};
      cardStatus.class = cardNum ? "valid" : "";
      if (cardNum && (cardNum.length < 13 || !cardType)) {
        var names = _.map(cards, (item, type) => type);
        var extraNames = names.length > 1 ? names.slice(0, -1).join(", ") + " or " : "";
        cardStatus.error = "Enter a valid " + extraNames + names.slice(-1) + " number";
        cardStatus.class = "invalid";
      }

      var cvnNum = this.state.cvnNum;
      var cvnStatus = {};
      cvnStatus.class = cvnNum ? "valid" : "";
      if (cvnNum && cardType && cvnNum.length !== cards[cardType].cvnLength) {
        cvnStatus.error = "Enter a " + cards[cardType].cvnLength + "-digit number";
        cvnStatus.class = "invalid";
      }

      var expMonth = this.state.expMonth;
      var expYear = this.state.expYear;
      var month = parseInt(expMonth, 10);
      var year = parseInt(expYear, 10);
      expStatus = {};
      expStatus.class = expMonth && expYear ? "valid" : "";
      if (expMonth && expYear) {
        if (!(month >= 1 && month <= 12)) {

        }
        // TODO: Handle year error
      }

      this.setState({
        nameClass: this.state.name ? "valid" : "",
        cardStatus: cardStatus,
        cvnStatus: cvnStatus,
        expStatus: expStatus
      });
    },
    handleCardInput: function(cardNum, cardType) {
      this.setState({
        cardNum: cardNum,
        cardType: cardType
      });
    },
    handleCvnInput: function(cvnNum) {
      this.setState({
        cvnNum: cvnNum
      });
    },
    handleNameInput: function(name) {
      this.setState({ name: name });
    },
    handleExpInput: function(expMonth, expYear) {
      this.setState({
        expMonth: expMonth,
        expYear: expYear
      });
    },
    onSubmit: function(e) {
      e.preventDefault();
      this.props.onSubmit("Submitting");
    },
    render: function() {
      return <form className="payment_form" onSubmit={this.onSubmit} >
        <CardEntry
          cardNum={this.state.cardNum}
          cardType={this.state.cardType}
          cardStatus={this.state.cardStatus}
          onUserInput={this.handleCardInput}
          onBlur={this.onBlur}
        />
        <CvnEntry
          cardNum={this.state.cardNum}
          cvnNum={this.state.cvnNum}
          cvnStatus={this.state.cvnStatus}
          cardType={this.state.cardType}
          onUserInput={this.handleCvnInput}
          onBlur={this.onBlur}
        />
        <NameEntry
          name={this.state.name}
          nameClass={this.state.nameClass}
          onUserInput={this.handleNameInput}
          onBlur={this.onBlur}
        />
        <button type="submit" className="form_submit" >Submit</button>
      </form>;
    }
  });

  // <ExpEntry expMonth={this.state.expMonth} expYear={this.state.expYear} onUserInput={this.handleExpInput} />

  // this.formData = {
  //   card: {
  //     number: "",
  //     error: null,
  //     status: "empty", // "valid", "invalid", or "empty"
  //     type: null,
  //     class: "",
  //     cvnLength: 3
  //   },
  //   cvn: {
  //     number: "",
  //     error: null,
  //     status: "empty",
  //     updateError: () => {}
  //   },
  //   name: "",
  //   exp: {
  //     month: "",
  //     year: "",
  //     error: null,
  //     status: "empty"
  //   }
  // };

  ReactDOM.render(
    <BillingForm
      onChange={this.onFormChange}
      onSubmit={this.onFormSubmit}
    />,
    document.getElementById("checkout")
  );
}

App.prototype.onFormChange = function(value) {

};

App.prototype.onFormSubmit = function(value) {
  console.warn(value);
};

App.prototype.formatCardNumber = function(number) {
  var i = 4;
  number = number.toString();
  while (i < number.length) {
    number = number.slice(0, i) + " " + number.slice(i);
    i += 5;
  }
  return number;
};

// Card
// <input class="name"/>
// <input class="num"/>
// <input class="exp_month"/>
// <input class="exp_year"/>
// <input class="cvn"/>

// Billing Address
// <input class="street_1"/>
// <input class="street_2"/>
// <input class="city"/>
// <input class="country"/>
// <input class="state"/>
// <input class="zip_code"/>

// Email
// <input class="email"/>
// <input class="email_repeat"/>

// <button class="submit">Submit</button>

// Use HTML5 auto-complete attributes

module.exports = App;
