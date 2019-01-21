const admin = require("firebase-admin");
const serviceAccount = require("../../firebase-adminsdk-key.json");
import { md5 } from './md5';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://unito-15c02.firebaseio.com"
});

export class BookmarkRepository {

  COLLECTION_NAME = 'bookmarks';
  
  client: any;

  constructor () {
    this.client = admin.firestore();
    this.client.settings({ timestampsInSnapshots: true }); 
  }

  async isExistsByUrl (url: string): Promise<any> {
    try {
      const doc_id = md5(url);
      console.log('doc_id', doc_id);
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
  
}