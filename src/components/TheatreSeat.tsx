import { Editor } from './Editor';
import { Loading } from './Loading';
import { Lobby } from './Lobby';
import { NotFound } from './NotFound';
import { Screen } from './Screen';
import { useAudience } from 'hooks/useAudience';
import { useTheatre } from 'hooks/useTheatre';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';


export const TheatreSeat: React.FC = () => {
  const { uuid } = useParams();
  const [isWaiting, setIsWaiting] = useState(true);

  if (!uuid) {
    return <NotFound />;
  }

  const { theatre, isInitialized: isInitializedTheatre } = useTheatre(uuid);
  const {
    audience,
    isInitialized: isInitializedAudience,
    enterTheatre,
    updateCode,
    updateName,
  } = useAudience(uuid);

  const onSubmit = async (displayName: string) => {
    await enterTheatre(displayName);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsWaiting(false);
    }, 1_500);
  }, []);

  if (!isInitializedTheatre || !isInitializedAudience || isWaiting) {
    return <Loading />;
  }

  if (!theatre) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{theatre.name} - Live Coding Theatre</title>
      </Helmet>
      {audience ? (
        <div className="w-screen h-screen overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 border-b border-zinc-900">
              <Screen text={theatre.message} />
            </div>
            <div className="grow">
              <Editor
                name={audience.displayName}
                code={audience.code || ''}
                value={theatre.value || ''}
                onChangeName={updateName}
                onChangeCode={updateCode}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-screen min-h-screen grid place-items-center p-5 h-full">
          <Lobby theatre={theatre} onSubmit={onSubmit} />
        </div>
      )}
    </>
  );
};