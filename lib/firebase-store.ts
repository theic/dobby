import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface Assistant {
  assistantId: string;
  name: string;
  graphId: string;
  userId: string;
  createdAt: string;
}

export interface Thread {
  threadId: string;
  assistantId: string;
  userId: string;
  createdAt: string;
}

const COLLECTIONS = {
  ASSISTANTS: 'assistants',
  THREADS: 'threads'
} as const;

export function getUserId(): string {
  if (!auth.currentUser) {
    throw new Error('No authenticated user found');
  }
  return auth.currentUser.uid;
}

export async function saveAssistant(assistant: Assistant): Promise<void> {
  try {
    await addDoc(collection(db, COLLECTIONS.ASSISTANTS), assistant);
  } catch (error) {
    console.error('Error saving assistant:', error);
    throw error;
  }
}

export async function getAssistants(): Promise<Assistant[]> {
  try {
    const userId = getUserId();
    const assistantsQuery = query(
      collection(db, COLLECTIONS.ASSISTANTS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(assistantsQuery);
    return querySnapshot.docs.map((doc) => doc.data() as Assistant);
  } catch (error) {
    console.error('Error getting assistants:', error);
    throw error;
  }
}

export async function saveThread(thread: Thread): Promise<void> {
  try {
    await addDoc(collection(db, COLLECTIONS.THREADS), thread);
  } catch (error) {
    console.error('Error saving thread:', error);
    throw error;
  }
}

export async function getThreads(): Promise<Thread[]> {
  try {
    const userId = getUserId();
    const threadsQuery = query(
      collection(db, COLLECTIONS.THREADS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(threadsQuery);
    return querySnapshot.docs.map((doc) => doc.data() as Thread);
  } catch (error) {
    console.error('Error getting threads:', error);
    throw error;
  }
}
