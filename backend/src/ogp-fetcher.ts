const ogp_parser = require('ogp-parser')

export async function fetchOgp (url) : Promise<Article | null> {
  let article = null;
  try {
    const { ogp } = await ogp_parser(url, true)

    console.log('ogp',ogp);

    article = {
      url,
      title: ogp["og:title"] ? ogp["og:title"][0] : '',
      description: ogp["og:description"] ? ogp["og:description"][0] : '',
      image: ogp["og:image"] ? ogp["og:image"][0] : '',
      host: extractHost(url),
    }
  } catch (err) {
    throw err;
  }
  return article
}

function extractHost(url) {
  return url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1];
}