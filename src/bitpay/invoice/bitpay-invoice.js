module.exports.bitpayInvoice = data => {
  var fs = require("fs");
  var HOME = process.env["HOME"];
  var bitauth = require("bitauth");
  var bitpay = require("bitpay");
  var encPrivkey = fs.readFileSync(HOME + "/.bitpay/api.key").toString();
  var privkey = bitauth.decrypt("", encPrivkey); // decrypt with your key pass
  var client = bitpay.createClient(privkey);

  console.log("bitpayInvoice started...");

  return new Promise((resolve, reject) => {
    client.on("ready", function() {
      console.log("ready");
      client.as("merchant").post("invoices", data, function(err, invoice) {
        console.log(err || invoice);
        if (err) reject(err);
        resolve(invoice);
      });
    });
    client.on("error", function(err) {
      console.log(err);
      reject({ error: err});
    });
  });
};