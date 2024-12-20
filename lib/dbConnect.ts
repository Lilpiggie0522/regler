import mongoose from "mongoose"

const MONGODB_URI : string = process.env.MONGODB_URI || "some_strings"
//console.log("MONGODB_URI: ", process.env.MONGODB_URI);

if (!MONGODB_URI && process.env.NODE_ENV !== "test") {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}
interface Cached {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  }
let cached : Cached| undefined = global.mongoose

if (!cached) {
  cached =  { conn: null, promise: null }
}

async function dbConnect() {
  if (!cached) {
    cached =  { conn: null, promise: null }
  }
  if (cached.conn) {
    return cached.conn
  }
  if (process.env.NODE_ENV === "test") {
    return // Skip in-memory MongoDB connection handling here.
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
  

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect