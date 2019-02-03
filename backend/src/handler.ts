import * as moment from 'moment';
const functions = require('firebase-functions');
import * as Cors from 'cors';
const cors = Cors();

import config from './config';
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

exports.update_by_hatena_bookmark = functions.https.onRequest(async (req, res) => {
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

exports.update_by_rss = functions.https.onRequest(async (req, res) => {
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

exports.fetch = functions.https.onRequest(async (req, res) => {
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

exports.update_articles_in_one_week = functions.https.onRequest(async (req, res) => {
  initializeFirebase(firebaseAdmin);

  const clawler = new HatenaBookmarkClawler(LIKE_COUNT);
  const repository = new ArticleRepository(firebaseAdmin);

  const date = moment()
  let bookmarks = [];

  try {
    for(let i=0; i < 7; i++) {
      const urls = await clawler.fetchUrls(date, date);

      for(let url of urls) {
        const is_exists = await repository.isExistsByUrl(url);
        if (!is_exists) {
          const article = await buildArticle(url, date);
          bookmarks.push(article);
        }
      }
      date.subtract(1, 'days');
    }

    if (bookmarks.length > 0) await repository.bulkPut(bookmarks);
  } catch (err) {
    res.send({ message: err.message });
    return;
  }

  finishFirebase(firebaseAdmin);
  res.send({ message: `update done. updated articles: ${bookmarks.length}` });
});
