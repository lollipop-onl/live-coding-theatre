import { onValue, ref } from 'firebase/database';
import { db } from 'modules/firebase';
import { useEffect, useState } from 'react';
import { TheatreMeta } from 'types';

export const useTheatre = (uuid: string) => {
  const [theatre, setTheatre] = useState<TheatreMeta | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    return onValue(ref(db, `v2/theatres/${uuid}/meta`), (snapshot) => {
      setTheatre(snapshot.val() as any);
      setIsInitialized(true);
    });
  }, []);

  return { theatre, isInitialized };
};
