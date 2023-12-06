import { Loading } from './Loading';
import { NotFound } from './NotFound';
import { Screen } from './Screen';
import { Seat } from './Seat';
import { onValue, ref } from 'firebase/database';
import { useTheatre } from 'hooks/useTheatre';
import { db } from 'modules/firebase';
import { useEffect, useRef, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useParams } from 'react-router-dom';
import { useFullscreen } from 'react-use';

type TheatreAudience = {
  uuid: string;
  displayName: string;
  code: string;
};

export const TheatreScreen: React.FC = () => {
  const { uuid } = useParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audiences, setAudiences] = useState<TheatreAudience[]>([]);

  useFullscreen(containerRef, isFullscreen, {
    onClose: () => setIsFullscreen(false),
  });

  useEffect(() => {
    if (!uuid) return;

    return onValue(ref(db, `v2/theatres/${uuid}/audiences`), (snapshot) => {
      const value = snapshot.val();

      if (!value) return;

      const audiences = Object.entries(snapshot.val())
        .filter(([, { connected }]: any) => connected)
        .map(([uuid, { code, displayName }]: any) => ({
          uuid,
          code,
          displayName,
        }));

      setAudiences(audiences);
    });
  }, [uuid]);

  if (!uuid) {
    return <NotFound />;
  }

  const { theatre, isInitialized: isInitializedTheatre } = useTheatre(uuid);

  if (!isInitializedTheatre) {
    return <Loading />;
  }

  if (!theatre) {
    return <NotFound />;
  }

  return (
    <div ref={containerRef} className="w-screen h-screen bg-zinc-900">
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 border-b border-zinc-900">
          <Screen text={theatre.message} />
        </div>
        <div className="grow overflow-y-auto">
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              350: 1,
              750: 2,
              900: 3,
              1250: 4,
              1500: 5,
              1750: 6,
            }}
          >
            <Masonry>
              {audiences.map((audience) => (
                <div key={audience.uuid} className="px-4 py-2">
                  <Seat
                    displayName={audience.displayName}
                    code={audience.code}
                  />
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </div>
      {!isFullscreen && (
        <button
          className="fixed bottom-2 left-1/2 -translate-x-1/2 rounded border border-zinc-900 bg-zinc-800 px-2 py-1 text-zinc-400 hover:bg-zinc-900"
          onClick={() => setIsFullscreen(true)}
        >
          Enable Fullscreen
        </button>
      )}
    </div>
  );
};
