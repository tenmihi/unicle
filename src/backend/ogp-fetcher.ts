const ogp_parser = require('ogp-parser')

export async function fetchOgp (url) : Promise<Bookmark | null> {
  let article = null;
  try {
    const { ogp } = await ogp_parser(url, true)

    article = {
      url,
      title: ogp["og:title"][0],
      description: ogp["og:description"][0],
      image: ogp["og:image"][0],
      site_name: ogp["og:site_name"][0],
    }
  } catch (err) {
    throw err;
  }
  return article
}