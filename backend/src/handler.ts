import { BookmarkRepository } from "./bookmark-repository";
import { fetchUrlsInOneMonth } from "./clawler";
import { fetchOgp } from "./ogp-fetcher";

module.exports.handler = async (event, context) => {
  const urls = await fetchUrlsInOneMonth();

  const repository = new BookmarkRepository();
  const timestamp = Math.floor(Date.now() / 1000);

  let bookmarks = [];
  for(let url of urls) {
    try {
      const is_exists = await repository.isExistsByUrl(url);
      if (!is_exists) {
        const ogp = await fetchOgp(url);
        bookmarks.push(Object.assign(ogp, { timestamp }));
      }
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: err.message }),
      }
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

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `update done. url_count: ${urls.length}, insert_count: ${bookmarks.length}` }),
  };
};
