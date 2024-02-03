import Env from "../env/env";

const env = new Env();

export const firebaseConfig = {
  apiKey: env.getStringEnv("FIREBASE_API_KEY"),
  authDomain: env.getStringEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: env.getStringEnv("FIREBASE_PROJECT_ID"),
  storageBucket: env.getStringEnv("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: env.getStringEnv("FIREBASE_MESSAGE_SENDER_ID"),
  appId: env.getStringEnv("FIREBASE_APP_ID")
};