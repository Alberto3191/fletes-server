const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");

const app = express();

app.use(cors());
app.use(express.json());

mercadopago.configure({
access_token: process.env.MP_ACCESS_TOKEN
});

app.get("/", (req, res) => {
res.send("Servidor Fletes & Mudanzas funcionando");
});

app.post("/crear-pago", async (req, res) => {
try {

const { titulo, precio } = req.body;

const preference = {
  items: [
    {
      title: titulo,
      quantity: 1,
      currency_id: "MXN",
      unit_price: Number(precio)
    }
  ],
  back_urls: {
    success: "https://tuapp.com/success",
    failure: "https://tuapp.com/failure",
    pending: "https://tuapp.com/pending"
  },
  auto_return: "approved"
};

const response = await mercadopago.preferences.create(preference);

res.json({
  init_point: response.body.init_point
});

} catch (error) {

console.error(error);

res.status(500).json({
  error: "Error creando el pago"
});

}
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Servidor corriendo en puerto", PORT);
});