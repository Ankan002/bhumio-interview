"use server";

import { DATABASE_URL } from "@/constants/env";
import mongoose from "mongoose";

interface DatabaseProps {
    isConnected?: mongoose.ConnectionStates;
}

const database: DatabaseProps = {};

export const connectToDB = async () => {
    if (database.isConnected) return;

    console.log("Connecting to database...");

    try {
        const db = await mongoose.connect(DATABASE_URL);

        console.log("Connected to database");

        database.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log(error);
    }
};
