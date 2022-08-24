import mongoose from 'mongoose';
import config from '../config/index';

mongoose.connect(config.databaseUrl);  

mongoose.connection.on('open', () => {
    console.log('MongoDB connected Successfully!');
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        // console.log(names);
    });
})


// const mongoose = require('mongoose')
// const config = require('../config/index').default

// mongoose.connect(config.databaseUrl)  

// mongoose.connection.on('open', () => {
//     console.log('MongoDB connected Successfully!');
//     mongoose.connection.db.listCollections().toArray(function (err, names) {
//         // console.log(names);
//     });
// })