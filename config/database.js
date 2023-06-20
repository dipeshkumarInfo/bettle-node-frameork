require('dotenv').config();
// const mongoose = require('mongoose');

// const connectMongoDB = () =>  {
//     // Database connection
//     mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true});

//     mongoose.connection.on('connected', () => {
//         console.log('Database connected');
//     });

//     mongoose.connection.on('error',function (err) {  
//         console.log('Mongoose default connection error: ' + err);
//         return false;
//     });

//     mongoose.connection.on('disconnected', function () {  
//        console.log('Mongoose default connection disconnected'); 
//        return false;
//     });
// }

// module.exports = {
//     connectMongoDB
// };

const mongoose = require('mongoose');

class MongooseConnection {
  constructor() {
    if (!MongooseConnection.instance) {
      mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
          console.log('MongoDB connected');
          this.db = mongoose.connection;
          MongooseConnection.instance = this;
        })
        .catch(error => console.error('Error connecting to MongoDB', error.message));
    }

    return MongooseConnection.instance;
  }
}

module.exports = new MongooseConnection();
