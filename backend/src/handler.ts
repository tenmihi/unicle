import { BookmarkRepository } from "./repository";
import { HatenaBookmarkClawler } from "./clawler";
import { fetchOgp } from "./ogp-fetcher";

import * as moment from 'moment';

const LIKE_COUNT = 2;

const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../firebase-adminsdk-key.json");

function initializeFirebase(admin) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://unito-15c02.firebaseio.com"
  });
}

function finishFirebase(admin) {
  admin.app("[DEFAULT]").delete()
}

module.exports.update_articles_today = async (event, context) => {
  const today = moment()

  const clawler = new HatenaBookmarkClawler(LIKE_COUNT);
  const urls = await clawler.fetchUrls(today, today);

  initializeFirebase(firebaseAdmin);

  const repository = new BookmarkRepository(firebaseAdmin);
  const timestamp = Math.floor(Date.now() / 1000);

  let bookmarks = [];
  try {
    for(let url of urls) {
      const is_exists = await repository.isExistsByUrl(url);
      if (!is_exists) {
        const ogp = await fetchOgp(url);
        bookmarks.push(Object.assign(ogp, { timestamp }));
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    }
  }

  try {
    if (bookmarks.length > 0) await repository.bulkPut(bookmarks);
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    }
  } 

  finishFirebase(firebaseAdmin);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `update done. url_count: ${urls.length}, insert_count: ${bookmarks.length}` }),
  };
};

module.exports.fetch = async (event, context) => {
  initializeFirebase(firebaseAdmin);

  const repository = new BookmarkRepository(firebaseAdmin);

  try {
    const items = await repository.fetch();
    finishFirebase(firebaseAdmin);
    return {
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (err) {
    finishFirebase(firebaseAdmin);
    return {
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  } 
};

module.exports.update_articles_in_one_week = async (event, context) => {
  initializeFirebase(firebaseAdmin);

  const clawler = new HatenaBookmarkClawler(LIKE_COUNT);
  const repository = new BookmarkRepository(firebaseAdmin);

  const date = moment()
  let bookmarks = [];

  try {
    for(let i=0; i < 7; i++) {
      const urls = await clawler.fetchUrls(date, date);
      const timestamp = Math.floor(date.valueOf() / 1000);

      for(let url of urls) {
        const is_exists = await repository.isExistsByUrl(url);
        if (!is_exists) {
          const ogp = await fetchOgp(url);
          bookmarks.push(Object.assign(ogp, { timestamp }));
        }
      }

      date.subtract(1, 'days');
    }

    if (bookmarks.length > 0) await repository.bulkPut(bookmarks);

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    }
  }

  finishFirebase(firebaseAdmin);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `update done. updated articles: ${bookmarks.length}` }),
  };
  
};
