import * as moment from "moment";
import { Moment } from "moment";
const Parser = require('rss-parser');

export class RssReader {

  private parser;

  private DATE_FORMAT = "YYYY-MM-DD"

  constructor () {
    this.parser = new Parser();
  }

  async fetchUrls (url: string, date: Moment) {
    console.log('url', url);
    let feed = await this.parser.parseURL(url);

    const formated_date = date.format(this.DATE_FORMAT);
    return feed.items
      .filter(item => moment(item.isoDate).format(this.DATE_FORMAT) == formated_date)
      .map(item => item.link);
  }
}