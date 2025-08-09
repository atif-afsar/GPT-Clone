const mongoose = require('mongoose');

function connectDB() {
    if (!process.env.MONGO_URL) {
        console.error('❌ MONGO_URL not found in environment variables');
        process.exit(1);
    }

    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('✅ Connected to MongoDB'))
        .catch(err => {
            console.error('❌ MongoDB connection error:', err);
            process.exit(1);
        });
}

module.exports = connectDB;
