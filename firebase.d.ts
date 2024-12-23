declare module 'firebase/app' {
  export function initializeApp(config: any): any;
}

declare module 'firebase/auth' {
  export function getAuth(app: any): any;
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signOut(auth: any): Promise<void>;
  export function onAuthStateChanged(auth: any, callback: (user: any) => void): () => void;
}

declare module 'firebase/firestore' {
  export function getFirestore(app: any): any;
}
