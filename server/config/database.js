const { default: mongoose } = require("mongoose");

// Database Connection
const connectDB = await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("MongoDB connected successfully");
})
.catch((error)=>{
    console.error("MongoDB connection error:", error);  
})

exports.connectDB = { connectDB };