const Moment = require('moment');
const cheerio = require('cheerio-httpcli');

const LIKE_COUNT = 3;
const TAG = 'unity';
const BASE_URL = 'http://b.hatena.ne.jp/search/tag';

async function fetchUrls (like_count: number, tag: string, period: Period) {
  const query_param = {
    q: tag,
    sort: 'recent',
    users: like_count,
    safe: 'on',
    date_begin: period.from,
    date_end: period.to,
  }
  
  return await _fetch(BASE_URL, query_param);
}

async function _fetch (url: string, query_param: object) {
  let urls: Array<string> = []; 
  const result = await cheerio.fetch(url, query_param);
  const $ = result.$;
  //const article_count = result.$('h2.entrysearch-title > span.entrysearch-result').text.replace(/件数 ([0-9]+)/,'$1');

  result.$('div.centerarticle-entry')
    .each((idx: number, elem: any) => {
        const article = $(elem);
        const url   = article.find('h3.centerarticle-entry-title > a').attr('href');
        //const likes = article.find('span.centerarticle-users > a').text().replace(/^([0-9]*) users$/, '$1');
        urls.push(url);
    });

  return urls;
}

export async function fetchUrlsInOneMonth () {
  const FORMAT = 'YYYY-MM-DD';
  const now = new Moment();
  const one_month_ago = now.subtract(1, 'months');

  return await fetchUrls(LIKE_COUNT, TAG, { from: one_month_ago.format(FORMAT), to: now.format(FORMAT) })
}