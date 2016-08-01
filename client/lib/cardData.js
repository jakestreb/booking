
exports.cards = {
  "Visa": {
    expr: new RegExp("^4[0-9]{6,}$"),
    cvnLength: 3,
    class: "pw-visa"
  },
  "American Express": {
    expr: new RegExp("^3[47][0-9]{5,}$"),
    cvnLength: 4,
    class: "pw-american-express"
  },
  "MasterCard": {
    expr: new RegExp("^(5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,})$"),
    cvnLength: 3,
    class: "pw-mastercard"
  }
};
// {
//   type: "Diner's Club",
//   expr: new RegExp("^3(?:0[0-5]|[68][0-9])[0-9]{4,}$"),
//   class: "pw-american-express",
//   accepted: false
// }, {
//   type: "Discover",
//   expr: new RegExp("^6(?:011|5[0-9]{2})[0-9]{3,}$"),
//   class: "pw-discover",
//   accepted: false
// }, {
//   type: "JCB",
//   expr: new RegExp("^(?:2131|1800|35[0-9]{3})[0-9]{3,}$"),
//   class: "pw-diners",
//   accepted: false
