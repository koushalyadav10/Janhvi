const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const filePath = 'bookings.txt';

app.post('/book-table', (req, res) => {
    const { full_name, email_address, total_person, booking_date, message } = req.body;

    if (!full_name || !email_address || !total_person || !booking_date || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const entry = `Name: ${full_name}\nEmail: ${email_address}\nTotal Persons: ${total_person}\nDate: ${booking_date}\nMessage: ${message}\n\n`;

    // Append to file
    fs.appendFile(filePath, entry, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to save booking data' });
        }

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shubhamkmyadav9090@gmail.com',
                pass: 'ggcw zofg ehgb jwxe', // Use an app password for Gmail
            },
        });

        const mailOptions = {
            from: 'shubhamkmyadav9090@gmail.com',
            to: 'shubhamkmyadav9090@gmail.com',
            subject: 'New Table Booking',
            text: entry,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to send email' });
            }

            res.status(200).json({ message: 'Booking successful' });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
