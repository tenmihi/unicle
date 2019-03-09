const functions = require('firebase-functions');
const secureCompare = require('secure-compare');
import * as moment from 'moment';

import { ArticleRepository } from "../article-repository";
import { HatenaBookmarkClawler } from "../hatenabookmark-clawler";
import { buildArticle } from "../article-fetcher";
const { initializeFirebase, finishFirebase } = require("../firebase");

const LIKE_COUNT = 2;

exports.update_by_hatena_bookmark = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  const key = req.query && req.query.key ? req.query.key : ''
  if (!secureCompare(key, functions.config().auth.key)) {
    res.status(403).send('Invalid auth key.');
    return;
  }

  const today = moment().subtract(1, 'hours'); // 日またぎのタイミングで前日の分をとってきたいので

  const clawler = new HatenaBookmarkClawler(LIKE_COUNT);
  const urls = await clawler.fetchUrls(today, today);

  const firebaseAdmin = initializeFirebase();

  const repository = new ArticleRepository(firebaseAdmin);

  let filtered_urls, articles;
  try {
    filtered_urls = await repository.filteringUrlByNotInserted(urls);
    articles = await Promise.all(filtered_urls.map(async url => await buildArticle(url, today)));
    
    if (articles.length > 0) await repository.bulkPut(articles);
  } catch (err) {
    res.send({ message: err.message });
    return;
  }

  finishFirebase(firebaseAdmin);

  res.send({ message: `update done. url_count: ${urls.length}, insert_count: ${articles.length}` });
});