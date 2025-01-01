const mongodb = require('mongoose');

//CONECTING DB// APP CONFI
const dbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then((res) => console.log('MongoDB connection successful'))
    .catch((err) => console.log('Connection failed'));
};
