const { dataValidation } = require("./helper/dataValidation");
const { bitpayInvoice } = require("../bitpay/invoice/bitpay-invoice");
const uuidv1 = require("uuid/v1");
const table = process.env.AWS_DYNAMODB_TABLE;

module.exports = async function(app, db) {
  app.get("/api/:id", async (req, res) => {
    const id = req.params.id;
    const params = {
      TableName: table,
      Key: {
        id: id
      }
    };
    try {
      const result = await db.get(params);
      const message = {
        amount: result.Item.amount,
        slpTransactionId: result.Item.slpTransactionId,
        totalPriceUSD: result.Item.totalPriceUSD,
        status: result.Item.status
      }
      res.send(message);
    } catch (err) {
      console.log("error at get: ", err);
      res.send({ error: "An error has occured" });
    }
  });

  app.post("/api", async (req, res) => {
    console.log("*************");
    console.log("routes:: customer POST body: ", req.body);

    // 1 - check info (isSLPaddress , amount , email etc.)
    const isDataValid = await dataValidation(req.body, res);

    if (isDataValid) {
      const totalPrice = req.body.amount * 0.001;
      const uuid = uuidv1(); // random id

      // 2 - make request to BitPay (create BitPay invoice)
      let post_data = {
        currency: "USD",
        price: totalPrice,
        orderId: uuid,
        fullNotifications: false,
        transactionSpeed: "medium",
        notificationURL: process.env.notificationURL,
        notificationEmail: process.env.notificationEmail,
        redirectURL: process.env.redirectURL,
        buyer: {
          email: req.body.email,
          name: req.body.name,
          notify: true
        },
        itemDesc: `${req.body.amount} honk` // add honk amount
      };
      const invoice = await bitpayInvoice(post_data);

      // 3 - save transaction info with invoice to DynamoDB
      const Item = {
        id: uuid,
        status: "pending",
        bitpayInvoice: invoice,
        date: Date.now(),
        amount: req.body.amount,
        email: req.body.email,
        name: req.body.name,
        totalPriceUSD: totalPrice,
        SLPaddress: req.body.SLPaddress,
        slpTransactionId: "none"
      };
      const params = {
        TableName: table,
        Item: Item
      };
      try {
        await db.put(params);
      } catch (err) {
        console.log("routes:: error in DynamoDB: ", err);
        res.send({ error: "An error has occured" });
      }
      const paymentURL = invoice.paymentCodes.BCH.BIP73;
      const message = {
        paymentURL: paymentURL,
        id: uuid
      };
      res.send(JSON.stringify(message, null, 4)); // send back to user
    }
  });
};
