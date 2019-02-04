import * as moment from 'moment';
const functions = require('firebase-functions');
import * as Cors from 'cors';
const cors = Cors();
const secureCompare = require('secure-compare');

import { config } from './yaml-constant';
import { ArticleRepository } from "./article-repository";
import { HatenaBookmarkClawler } from "./hatenabookmark-clawler";
import { buildArticle } from "./article-fetcher";
import { RssReader } from "./rss-reader";

const LIKE_COUNT = 2;

const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../firebase-adminsdk-key.json");

function initializeFirebase(admin) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://unicle-8e106.firebaseio.com"
  });
}

function finishFirebase(admin) {
  admin.app("[DEFAULT]").delete();
}

exports.update_by_hatena_bookmark = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  const key = req.query && req.query.key ? req.query.key : ''
  if (!secureCompare(key, functions.config().auth.key)) {
    res.status(403).send('Invalid auth key.');
    return;
  }

  const today = moment().subtract(1, 'hours'); // 日またぎのタイミングで前日の分をとってきたいので

  const clawler = new HatenaBookmarkClawler(LIKE_COUNT);
  const urls = await clawler.fetchUrls(today, today);

  initializeFirebase(firebaseAdmin);

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

exports.update_by_rss = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  const key = req.query && req.query.key ? req.query.key : ''
  if (!secureCompare(key, functions.config().auth.key)) {
    console.log('A')
    res.status(403).send('Invalid auth key.');
    return;
  }
  console.log('B')

  initializeFirebase(firebaseAdmin);
  
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

exports.fetch = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  initializeFirebase(firebaseAdmin);

  const repository = new ArticleRepository(firebaseAdmin);

  try {
    const items = await repository.fetch();
    finishFirebase(firebaseAdmin);
    return cors(req, res, () => res.send({ items }) );
  } catch (err) {
    finishFirebase(firebaseAdmin);
    return cors(req, res, () => res.send({ message: err.message }) );
  } 
});
