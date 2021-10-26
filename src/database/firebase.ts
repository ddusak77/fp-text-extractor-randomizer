import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
    getFirestore, getDoc, doc, updateDoc, setDoc, DocumentReference, DocumentData, DocumentSnapshot, Firestore
} from 'firebase/firestore/lite';

import { firebaseConfig } from '../config';

const app:FirebaseApp = initializeApp(firebaseConfig);
const db:Firestore = getFirestore(app);

export class firebaseMethods {

    async exists(collection :string, name: string):  Promise<boolean> {
        const docRef:DocumentReference<DocumentData> = doc(db, collection + '/' + name);
        const docSnap:DocumentSnapshot<DocumentData> = await getDoc(docRef);
        return docSnap.exists()
    }

    async get(collection :string, name: string):  Promise<false | DocumentData> {
        
        const docRef:DocumentReference<DocumentData> = doc(db, collection + '/' + name);
        const docSnap:DocumentSnapshot<DocumentData> = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            return false;
        } else {
            return docSnap.data();
        }
    }

    async insert(collection: string, name:string, data: Partial<unknown>): Promise<void> {
        const docRef:DocumentReference<DocumentData> = doc(db, collection + '/' + name);
        await setDoc(docRef, data);
    }

    async update(collection: string, name:string, field: string, value: unknown): Promise<void> {
        const docRef:DocumentReference<DocumentData> = doc(db, collection + '/' + name);
        await updateDoc(docRef, field, value);
    }
}

export default firebaseMethods;