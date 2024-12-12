import admin, { ServiceAccount } from "firebase-admin";

// const serviceAccount = require(path.resolve(__dirname, "./firebase-key.json"));
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT as string;

if (!serviceAccountString) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT variável de ambiente não está definida"
  );
}

const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
