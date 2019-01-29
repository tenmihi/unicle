import { Moment } from "moment";

const ogp_parser = require('ogp-parser')

export async function buildArticle (url: string, date: Moment) : Promise<Article | null> {
  let article = null;
  try {
    const { ogp } = await ogp_parser(url, true)
    article = {
      url,
      title: ogp["og:title"] ? ogp["og:title"][0] : '',
      description: ogp["og:description"] ? ogp["og:description"][0] : '',
      image: ogp["og:image"] ? ogp["og:image"][0] : '',
      host: extractHost(url),
      timestamp: Math.floor(Date.now() / 1000),
    }
  } catch (err) {
    throw err;
  }
  return article
}

function extractHost(url) {
  return url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1];
}