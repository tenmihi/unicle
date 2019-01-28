import { Moment } from "moment";

const cheerio = require('cheerio-httpcli');

export class HatenaBookmarkClawler {
  private TAG = 'Unity';
  private BASE_URL = 'http://b.hatena.ne.jp/search/tag';
  private DATE_FORMAT = "YYYY-MM-DD"

  private like_count: number;

  constructor (like_count = 3) {
    this.like_count = like_count;
  }

  async fetchUrls (from: Moment, to: Moment) {
    const query_param = {
      q: this.TAG,
      sort: 'recent',
      users: this.like_count,
      safe: 'on',
      date_begin: from.format(this.DATE_FORMAT),
      date_end: to.format(this.DATE_FORMAT),
    }

    return await this._fetch(this.BASE_URL, query_param);
  }

  private async _fetch (url: string, query_param: object) {
    let urls: Array<string> = []; 
    const result = await cheerio.fetch(url, query_param);
    const $ = result.$;

    result.$('div.centerarticle-entry')
      .each((idx: number, elem: any) => {
        const article = $(elem);
        const url = article.find('h3.centerarticle-entry-title > a').attr('href');
        urls.push(url);
      });

    return urls;
  }
}
