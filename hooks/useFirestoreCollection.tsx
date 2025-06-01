import { useEffect, useState } from 'react';
import {
    Firestore,
    DocumentData,
    doc,
    onSnapshot,
} from 'firebase/firestore';

interface FirestoreDocumentHookResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

/**
 * Hook to listen to a Firestore document in real time.
 *
 * @param db - Firestore instance
 * @param collectionPath - Collection path (e.g., "schedules")
 * @param docId - ID of the document to listen to
 */
export function useFirestoreDocument<T = DocumentData>(
    db: Firestore,
    collectionPath: string,
    docId: string
): FirestoreDocumentHookResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!docId) return;

        const docRef = doc(db, collectionPath, docId);
        const unsubscribe = onSnapshot(
            docRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setData(snapshot.data() as T);
                } else {
                    setData(null);
                }
                setLoading(false);
            },
            (err) => {
                console.error('Firestore document error:', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [db, collectionPath, docId]);

    return { data, loading, error };
}
