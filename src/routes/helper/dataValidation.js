const { checkSLPAddress } = require("../../slp/checkSLPAddress");

/** dataValidation -
 * check: amount , email , isSLPaddress
 */
module.exports.dataValidation = async (body, res) => {
  const amount = +body.amount;
  const email = body.email;
  const SLPaddress = body.SLPaddress;
  let message = "";
  const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isSLPaddress = await checkSLPAddress(SLPaddress);
  const minAmount = 1000;
  const maxAmount = 100000000000;
  
  if (!Number.isInteger(amount) || amount < minAmount || amount > maxAmount) {
    message += "Wrong amount";
    console.log(message);
    res.send({ error: message });
    return false;
  } else if (!email.match(reEmail)) {
    message += "Wrong email";
    console.log(message);
    res.send({ error: message });
    return false;
  } else if (!isSLPaddress) {
    message += "Wrong SLP address";
    console.log(message);
    res.send({ error: message });
    return false;
  } else {
    console.log("dataValidation:: Transaction data valid");
    return true;
  }
};
