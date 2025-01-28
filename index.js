const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://sanjeevani:sanjeeVaniMeds@sanjeevani.exguf.mongodb.net/sanjeevani?retryWrites=true&w=majority&appName=sanjeevani', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define the medicine schema and model
const medicineSchema = new mongoose.Schema({
    genericName: String,
    composition: String,
    cure: String,
    dosage: {
        under6: String,
        sixTo12: String,
        twelveTo18: String,
        adult: String,
        sixtyPlus: String,
    },
    whenToConsume: String,
    exception: String,
    price: Number,
    medType: String,  // New field for medicine type
    medform: [String],  // New array field for forms (tablet, syrup, capsule)
});

const Medicine = mongoose.model('meds', medicineSchema);

// Serve the index.html file at the root route
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle form submissions
app.post('/add-medicine', async (req, res) => {
    try {
        const { genericName, composition, cure, whenToConsume, exception, price, dosage, medType, medform } = req.body;

        const newMedicine = new Medicine({
            genericName,
            composition,
            cure,
            dosage,
            whenToConsume,
            exception,
            price,
            medType,   // Save the medType value
            medform,   // Save the selected forms (tablet, syrup, capsule)
        });

        await newMedicine.save();
        res.status(201).send('Medicine added successfully!');
    } catch (error) {
        res.status(500).send('Error saving medicine: ' + error.message);
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
