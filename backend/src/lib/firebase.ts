const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../firebase-adminsdk-key.json");

exports.initializeFirebase = function () {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://unicle-8e106.firebaseio.com"
  });

  return firebaseAdmin;
}

exports.finishFirebase = function (admin) {
  admin.app("[DEFAULT]").delete();
}
