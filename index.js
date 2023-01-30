import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./Router/Router.js";
import cors from "cors";
import Pusher from "pusher";
dotenv.config();

const url = process.env.URL;
const port = process.env.PORT || 5000;
const app = express();

const pusher = new Pusher({
  appId: "1544581",
  key: "2532b9c7ccd17b2e056f",
  secret: "8d8698b26c54a21ed08b",
  cluster: "mt1",
  useTLS: true,
});
app.use(cors());
app.use(express.json());
app.use(router);


mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(() => console.log("Database connected"))
  .catch(() => console.log("unable to connected"));

const db = mongoose.connection;
db.once("open", function () {
  console.log("Db is connected");
  const msgCollection = db.collection("messages");
  const changeStream = msgCollection.watch();

  changeStream.on("change", async function (change) {
    if (change.operationType === "insert") {
      const msg = change.fullDocument;
      await pusher.trigger("messages", "inserted", {
        name: msg.name,
        message: msg.message,
        timestamp: msg.timestamp,
        receiver: msg.receiver
      });
    } else {
      console.log("Error triggring pusher");
    }
  });
});
app.listen(port, () => console.log(`listening to port ${port}`));
