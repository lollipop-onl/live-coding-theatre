import { type User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { onValue, ref, set } from 'firebase/database';
import { auth, db } from 'modules/firebase';
import { useEffect, useState } from 'react';


type Audience = {
  displayName: string;
  code: string | null;
  answer: string | null;
};

export const useAudience = (uuid: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const enterTheatre = async (displayName: string) => {
    const { user } = await signInAnonymously(auth);

    await set(ref(db, `v2/theatres/${uuid}/audiences/${user.uid}`), {
      displayName,
      code: null,
      answer: null,
    });
  };

  const updateCode = async (code: string, answer: string) => {
    if (!audience || !user) return;

    await set(ref(db, `v2/theatres/${uuid}/audiences/${user.uid}/code`), code);
  };

  const updateName = async (name: string) => {
    if (!audience || !user) return;

    console.log('update name', name);

    await set(ref(db, `v2/theatres/${uuid}/audiences/${user.uid}/displayName`), name);
  };

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (!user || !user.isAnonymous) {
      setAudience(null);

      return;
    }

    return onValue(
      ref(db, `v2/theatres/${uuid}/audiences/${user.uid}`),
      (snapshot) => {
        setAudience(snapshot.val() as any);
      },
    );
  }, [user]);

  return { audience, isInitialized, enterTheatre, updateCode, updateName };
};