import { Mongoose } from "mongoose"

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined
}

// This export is necessary to make this a module
export {}

