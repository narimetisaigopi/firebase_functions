import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {setGlobalOptions} from "firebase-functions/v2/options";
import admin = require("firebase-admin");

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// Set the maximum instances to 10 for all functions
setGlobalOptions({maxInstances: 10});

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase from Telugu");
});

exports.sendMessage = onRequest(async (req, res) => {
  try {
    if (req.method === "POST") {
      const body = req.body;
      if (!body) {
        res.status(400).send("Body should not be empty.");
      }
      // Add timestamp
      body.timestamp = admin.firestore.FieldValue.serverTimestamp();
      await admin.firestore().collection("chats").add(body);
      res.status(201).send("sent message successfully.");
    } else {
      res.status(400).send("Method type should be post.");
    }
  } catch (e) {
    logger.error("sendMessage", e);
    res.status(500).send("Internal server error.");
  }
});

exports.getMessages = onRequest(async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("chats").get();
    const response = snapshot.docs.map((doc) => doc.data());
    res.status(200).json({response});
  } catch (e) {
    logger.error("getMessages", e);
    res.status(500).send("Internal server error.");
  }
});

