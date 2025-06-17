import mongoose from "mongoose";


function connect() {
    const mongoURI = process.env.MONGODB_URI ;
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log(`Connected to MongoDB at ${mongoURI}`);
        })
        .catch(err => {
            console.error("Failed to connect to MongoDB:", err);
        });
}

export default connect;