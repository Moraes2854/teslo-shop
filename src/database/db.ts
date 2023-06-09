import mongoose from 'mongoose';
mongoose.set('strictQuery', true);

// 0 = disconected
// 1 = connected
// 2 = connecting
// 3 = disconneting

const mongoConnection = {
    isConnected: 0,
}

export const connect = async() => {

    if ( mongoose.connections.length > 0 ){
        mongoConnection.isConnected = mongoose.connections[0].readyState;

        if ( mongoConnection.isConnected === 1 ) return;
        
        await mongoose.disconnect();

    }

    await mongoose.connect( process.env.MONGO_URL || '' );
    
    mongoConnection.isConnected = 1;

    console.log('Conectado a MongoDB', process.env.MONGO_URL);

}

export const disconnect = async() => {

    if ( process.env.NODE_ENV === 'development' ) return;

    if ( mongoConnection.isConnected === 0 ) return;

    await mongoose.disconnect();

    mongoConnection.isConnected = 0;

    console.log('Desconectado de MongoDB');

}