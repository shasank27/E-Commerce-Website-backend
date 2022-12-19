const stripe = require("stripe")(process.env.STRIPE_KEY);
const { v4: uuidv4 } = require("uuid");

exports.makePayment = (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);

  let amount = 0;
  products.map(product => {
    amount = amount + product.price;
  });

  const idempontencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then(customer => {
      stripe.charges.create(
        {
          amount: amount,
          currency: "usd",
          reciept_email: token.email,
          customer: customer.id,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip,
            },
          },
        },
        { idempontencyKey },
      );
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err));
};
