require("dotenv").config();
const connectDB = require("../../db/connectDB");

const initializePaystack = async (req, res) => {
  try {
    await connectDB();
    const { email, amount } = req.body;

    console.log({ email, amount });

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Convert to Kobo
      }),
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to initialize transaction" });
  }
};

async function verifyPaystack(req, res) {
  try {
    const { reference } = req.body;

    console.log({ reference });

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to verify transaction" });
  }
}

module.exports = {
  initializePaystack,
  verifyPaystack,
};
