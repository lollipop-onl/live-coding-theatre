import { type User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { onDisconnect, onValue, ref, set } from 'firebase/database';
import { auth, db } from 'modules/firebase';
import { useEffect, useState } from 'react';


type Audience = {
  displayName: string;
  code: string;
  connected: boolean;
};

export const useAudience = (uuid: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const enterTheatre = async (displayName: string) => {
    const { user } = await signInAnonymously(auth);

    await set(ref(db, `v2/theatres/${uuid}/audiences/${user.uid}`), {
      displayName,
      code: '',
      connected: true,
    });
  };

  const updateCode = async (code: string) => {
    if (!audience || !user) return;

    await set(ref(db, `v2/theatres/${uuid}/audiences/${user.uid}/code`), code);
  };

  const updateName = async (name: string) => {
    if (!audience || !user) return;

    await set(
      ref(db, `v2/theatres/${uuid}/audiences/${user.uid}/displayName`),
      name,
    );
  };

  useEffect(() => {
    if (!user || !uuid || !audience) return;

    return onValue(ref(db, '.info/connected'), async () => {
      const connectedRef = ref(
        db,
        `v2/theatres/${uuid}/audiences/${user.uid}/connected`,
      );

      await onDisconnect(connectedRef).set(false);

      await set(connectedRef, true);
    });
  }, [uuid, user, audience]);

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