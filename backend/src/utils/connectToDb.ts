import mongoose from "mongoose";
import config from "config";
import log from "@/utils/logger";

async function connectToDb() {
  const dbUri = config.get<string>("dbUri");
  try {
    await mongoose.connect(dbUri);
    log.info("Connect to DB");
  } catch (err) {
    process.exit(1);
  }
}

export default connectToDb;
