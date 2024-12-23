import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

declare global {
  namespace NodeJS {
    interface Global {
      firebase: typeof firebase;
    }
  }
}
