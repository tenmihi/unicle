import { md5 } from './md5';

export class ArticleRepository {

  COLLECTION_NAME = 'bookmarks';
  
  client: any;

  constructor (admin) {
    this.client = admin.firestore();
    this.client.settings({ timestampsInSnapshots: true }); 
  }

  async filteringUrlByNotInserted (urls: Array<string>): Promise<Array<string>>{
    return await Promise.all(urls.filter(async (url) => !(await this.isExistsByUrl(url)) ));
  }

  async isExistsByUrl (url: string): Promise<any> {
    try {
      const doc_id = md5(url);
      const doc = await this.client.collection(this.COLLECTION_NAME).doc(doc_id).get()
      return doc.exists;
    } catch (err) {
      throw err;
    }
  }

  async bulkPut (items: Array<any>): Promise<void> {
    const batch = this.client.batch();

    items.forEach(item => {
      const doc_id = md5(item.url);
      const doc_ref = this.client.collection(this.COLLECTION_NAME).doc(doc_id);
      batch.set(doc_ref, item);
    });

    try {
      await batch.commit()
    } catch (err) {
      throw err;
    }
  }

  async fetch(lastFetchedUrl: string = null): Promise<any> {
    let collection = this.client.collection(this.COLLECTION_NAME)
      .orderBy('timestamp','desc')
      .limit(10);

    if (lastFetchedUrl) {
      const doc_id = md5(lastFetchedUrl);
      collection.startAfter(doc_id);
    }

    let items = [];
    try {
      const snapshot = await collection.get();
      snapshot.forEach(doc => { items.push(doc.data()) });
    } catch(err) {
      throw err;
    }
    
    return items;
  }
}