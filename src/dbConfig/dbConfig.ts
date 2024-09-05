import mongoose from 'mongoose';

export default async function connect(){
    try{
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('Mongodb successfuly connected')
        });

        connection.on('error', (err) => {
            console.log('Mongodb connection error. Please make sure mongoDb is running' + err)
            process.exit()
        });
        
    } catch(error){
        console.log('something went wrong!')
        console.log(error)
    }
}