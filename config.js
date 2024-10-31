// config.js
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Aakash");

// Check if the database is connected
connect
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch(() => {
    console.log("Database cannot be connected");
  });

// Create schema for login data
const LoginSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }
});

// Collection for login data
const LoginCollection = mongoose.model("users", LoginSchema);

// Create schema for form data
const FormDataSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  stream: { type: String, required: true },
  class: { type: String, required: true },
  termsAgreement: { type: Boolean, required: true }
});

// Collection for form data
const FormDataCollection = mongoose.model("FormData", FormDataSchema);

// Schema for additional form data
const Form2Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  class: { type: String, required: true },
  center: { type: String, required: true },
  termsAgreement: { type: Boolean, required: true }
});

// Collection for additional form data
const Form2Collection = mongoose.model("Form2Data", Form2Schema);

// Export collections
module.exports = { LoginCollection, FormDataCollection, Form2Collection };
