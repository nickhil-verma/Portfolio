import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  console.warn("WARNING: MONGODB_URI is not defined in environment variables. Falling back to local logging.");
} else {
  if (process.env.NODE_ENV === "development") {
    // Preserves database client promise across module hot-reloading
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
