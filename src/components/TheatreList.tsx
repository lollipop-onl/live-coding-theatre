import { onValue, ref, set, remove } from 'firebase/database';
import { db } from 'modules/firebase';
import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

type Theatre = {
  name: string;
  uuid: string;
};

export const TheatreList: React.FC = () => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);

  const createTheatre = useCallback(async () => {
    const name = window.prompt('Theatre name?');

    if (!name) return;

    await set(ref(db, `v2/theatres/${crypto.randomUUID()}`), {
      meta: {
        name,
      },
    });
  }, []);

  const closeTheatre = useCallback(async (uuid: string) => {
    await remove(ref(db, `v2/theatres/${uuid}`));
  }, []);

  useEffect(() => {
    return onValue(ref(db, 'v2/theatres'), (snapshot) => {
      setTheatres(
        Object.entries(snapshot.val() || {}).map(([uuid, item]) => {
          return {
            uuid,
            // @ts-expect-error
            name: item?.meta?.name,
          };
        }),
      );
    });
  }, []);

  return (
    <div>
      <button
        className="border rounded px-4 py-2"
        onClick={() => createTheatre()}
      >
        Create a theatre
      </button>
      <ul className="mt-8">
        {theatres.map(({ name, uuid }) => (
          <li
            key={uuid}
            className="flex items-center justify-between py-4 hover:bg-yellow-50 px-4"
          >
            <NavLink
              className="text-lg underline hover:no-underline"
              to={`/admin/${uuid}`}
            >
              {name}
            </NavLink>
            <button
              className="border px-2 py-1 rounded text-sm bg-white"
              onClick={() => closeTheatre(uuid)}
            >
              Close
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
