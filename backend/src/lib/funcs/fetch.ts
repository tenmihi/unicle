const functions = require('firebase-functions');
import * as Cors from 'cors';
const cors = Cors();

import { ArticleRepository } from "../article-repository";
const { initializeFirebase, finishFirebase } = require("../firebase");

exports.fetch = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  const firebaseAdmin = initializeFirebase();

  const repository = new ArticleRepository(firebaseAdmin);

  try {
    const items = await repository.fetch();
    finishFirebase(firebaseAdmin);
    res.set('cache-control', 'public, max-age=600');
    return cors(req, res, () => res.send({ items }) );
  } catch (err) {
    finishFirebase(firebaseAdmin);
    return cors(req, res, () => res.send({ message: err.message }) );
  } 
});