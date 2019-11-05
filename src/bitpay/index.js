var fs = require("fs");
var HOME = process.env["HOME"];
var bitauth = require("bitauth");
var bitpay = require("bitpay");
var encPrivkey = fs.readFileSync(HOME + "/.bitpay/api.key").toString();
var privkey = bitauth.decrypt("", encPrivkey); // decrypt with your key pass
var client = bitpay.createClient(privkey);

module.exports = client;