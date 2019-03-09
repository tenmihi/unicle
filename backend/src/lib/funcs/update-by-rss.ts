
import * as moment from 'moment';
const functions = require('firebase-functions');
const secureCompare = require('secure-compare');

import { config } from '../yaml-constant';
import { ArticleRepository } from "../article-repository";
import { buildArticle } from "../article-fetcher";
import { RssReader } from "../rss-reader";

const { initializeFirebase, finishFirebase } = require("../firebase");

exports.update_by_rss = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  const key = req.query && req.query.key ? req.query.key : ''
  if (!secureCompare(key, functions.config().auth.key)) {
    res.status(403).send('Invalid auth key.');
    return;
  }

  const firebaseAdmin = initializeFirebase();
  
  const repository = new ArticleRepository(firebaseAdmin);
  const rss_reader = new RssReader();

  const today = moment().subtract(1, 'hours'); // 日またぎのタイミングで前日の分をとってきたいので

  let urls = [];
  try {
    const rss_urls = config.rss;
    for(let i=0; i < rss_urls.length; i++) {
      const article_urls = await rss_reader.fetchUrls(rss_urls[i], today);
      const filtered_urls = await repository.filteringUrlByNotInserted(article_urls);
      urls = urls.concat(filtered_urls);
    }

    const articles = await Promise.all(urls.map(async url => await buildArticle(url, today)));
    if (articles.length > 0) await repository.bulkPut(articles);

  } catch(err) {
    finishFirebase(firebaseAdmin);
    res.send({ message: err.message });
    return;
  }
  
  finishFirebase(firebaseAdmin);
  res.send({ message: `update done. updated articles: ${urls.length}` });
});