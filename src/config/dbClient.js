import mongoose from "mongoose";

import * as dotnev from 'dotenv';
import { envs } from "./environments/environments.js";

dotnev.config();


const CONNECTION_STRING = envs.CONNECTION_STRING;

class DatabaseClient {
    constructor(){
        this.connect();
    }

    async connect(){
        try{
            await mongoose.connect(CONNECTION_STRING);
            console.log("Connected to DB client");
            
        }catch(error){
            console.error("Error connecting to MongoClient: ", error);
            process.exit(1);
        }
    }

    async closeConnection() {
        try {
            await mongoose.connection.close();
            console.log('MongoClient connection closed');
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
        }
    }
}

export default new DatabaseClient();

