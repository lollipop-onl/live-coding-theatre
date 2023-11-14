import {
  signInWithEmailAndPassword,
  signOut as signOutFromFirebase,
  type User,
} from 'firebase/auth';
import { auth } from 'modules/firebase';
import { useCallback, useEffect, useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signOut = useCallback(async () => {
    await signOutFromFirebase(auth);
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsInitialized(true);
      setUser(user?.email ? user : null);
    });
  }, []);

  return { user, isInitialized, signIn, signOut };
};
