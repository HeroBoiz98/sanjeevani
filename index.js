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
    medType: String,
    medform: [String],
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
            medType,
            medform,
        });

        await newMedicine.save();
        res.status(201).send('Medicine added successfully!');
    } catch (error) {
        res.status(500).send('Error saving medicine: ' + error.message);
    }
});

// Endpoint to fetch all medicines
app.get('/medicines', async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).send('Error fetching medicines: ' + error.message);
    }
});

// Endpoint to update a medicine
app.put('/medicines/:id', async (req, res) => {
    const { id } = req.params;
    const { genericName, composition, cure, dosage, whenToConsume, exception, price, medType, medform } = req.body;

    try {
        const updatedMedicine = await Medicine.findByIdAndUpdate(id, {
            genericName,
            composition,
            cure,
            dosage,
            whenToConsume,
            exception,
            price,
            medType,
            medform,
        }, { new: true });

        if (!updatedMedicine) {
            return res.status(404).send('Medicine not found.');
        }

        res.status(200).send('Medicine updated successfully.');
    } catch (error) {
        res.status(500).send('Error updating medicine: ' + error.message);
    }
});

// Endpoint to delete a medicine
app.delete('/medicines/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMedicine = await Medicine.findByIdAndDelete(id);

        if (!deletedMedicine) {
            return res.status(404).send('Medicine not found.');
        }

        res.status(200).send('Medicine deleted successfully.');
    } catch (error) {
        res.status(500).send('Error deleting medicine: ' + error.message);
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
