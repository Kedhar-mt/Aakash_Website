const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const { LoginCollection, FormDataCollection, Form2Collection } = require('./config');

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files and views configuration
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define routes
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render("login"));
app.get('/signup', (req, res) => res.render("signup"));
app.get('/index', (req, res) => res.render("index"));
app.get('/digital', (req, res) => res.render("digital"));
app.get('/prime', (req, res) => res.render("prime"));
app.get('/edutv', (req, res) => res.render("edutv"));

// Register User
app.post('/signup', async (req, res) => {
  const data = { name: req.body.username, password: req.body.password };
  const existingUser = await LoginCollection.findOne({ name: data.name });

  if (existingUser) {
    res.send("Username already exists. Please choose a different username.");
  } else {
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);
    await LoginCollection.create(data);
    res.render("home");
  }
});

// Login User
app.post('/login', async (req, res) => {
  try {
    const user = await LoginCollection.findOne({ name: req.body.username });
    if (!user) {
      res.send("Username not found!");
    } else {
      const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
      res.render(isPasswordMatch ? "home" : "Wrong Password!");
    }
  } catch {
    res.send("Wrong Details!");
  }
});

// Digital Page Form - Form Submission Route
app.post('/submitForm', async (req, res) => {
  const formData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobileNumber: req.body.mobileNumber,
    stream: req.body.stream,
    class: req.body.class,
    termsAgreement: req.body.termsAgreement === "on" // Convert "on" to true
  };

  try {
    if (!formData.termsAgreement) {
      res.send("You must agree to the terms and conditions to submit the form.");
    } else {
      await FormDataCollection.create(formData); // Save form data in database
      res.send("Form Submitted Successfully! Wait for our Response.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

// Route to handle new form submission
app.post('/submitForm2', async (req, res) => {
  const form2Data = {
    name: req.body.name,
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
    password: req.body.password,
    class: req.body.class,
    center: req.body.center,
    termsAgreement: req.body.termsAgreement === "on"
  };

  try {
    if (!form2Data.termsAgreement) {
      res.send("You must agree to the terms and conditions to submit the form.");
    } else {
      await Form2Collection.create(form2Data);
      //console.log("Submitted Form 2 Data:", form2Data);  // Log data to the console
      res.send("Form submitted successfully ! Our experts will get back to you");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

// Start server
const port = 5020;
app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
