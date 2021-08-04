import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();
const URI = process.env.MONGODB_URL
const ConnectDB = async () => {
    try {
        await mongoose.connect(`${URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('Ket noi thanh cong!!');
    } catch (error) {
        console.log('Ket noi that bai!!!');
        process.exit(1);
    }
}
// module.exports = ConnectDB;
export default ConnectDB;