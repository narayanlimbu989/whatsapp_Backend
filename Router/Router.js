import express from "express";
import { message } from "../schema/messageSchema.js";
const router = express.Router();

router.post("/message", async (req, res) => {
  const dbmessage = req.body;
  await message.create(dbmessage, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(201).send(data);
  });
});

router.get("/message", async (req, res) => {
  const messageCollection = await message.find({});
  if (!messageCollection) {
    return res.status(404).send({ message: "messages not found" });
  }
  return res.status(200).send(messageCollection);
});

export default router;
