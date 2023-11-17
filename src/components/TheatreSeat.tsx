import { Editor } from './Editor';
import { Loading } from './Loading';
import { NotFound } from './NotFound';
import lobby_illust from 'assets/images/lobby_illust.svg';
import lobby_logo from 'assets/images/lobby_logo.svg';
import { useAudience } from 'hooks/useAudience';
import { useTheatre } from 'hooks/useTheatre';
import { useEffect, useId, useState } from 'react';
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
  const [displayName, setDisplayName] = useState('');
  const fieldId = useId();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

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

  if (audience) {
    return (
      <>
        <Helmet>
          <title>{theatre.name} - Live Coding Theatre</title>
        </Helmet>
        <div className="w-screen h-screen">
          <Editor
            name={audience.displayName}
            code={audience.code || ''}
            onChangeName={updateName}
            onChangeCode={updateCode}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{theatre.name} - Live Coding Theatre</title>
      </Helmet>
      <div className="w-screen min-h-screen grid place-items-center p-5">
        <div className="rounded-3xl overflow-hidden bg-white flex items-stretch">
          <div className="bg-yellow-500 grid place-items-center p-12">
            <div>
              <img
                className="w-40 -mb-8 mx-auto"
                src={lobby_logo}
                alt="Live Coding Theatre"
              />
              <img className="w-56" src={lobby_illust} alt="" />
            </div>
          </div>
          <div className="px-10 py-20 max-w-lg">
            <p className="text-center text-sm text-zinc-400 mb-2">
              Now Playing
            </p>
            <h1 className="text-3xl leading-relaxed">{theatre.name}</h1>
            <p className="mt-6 text-center text-sm text-red-700 leading-relaxed">
              入力内容はパブリックにアクセス可能な情報として保存されます。
              <br />
              個人情報や機密情報が含まれないようご注意ください。
            </p>
            <form className="mt-10" onSubmit={onSubmit}>
              <label className="text-zinc-400 text-sm" htmlFor={fieldId}>
                Display Name
              </label>
              <input
                className="block w-full rounded-xl mt-4 border-2 border-zinc-100 px-5 py-3 bg-zinc-100 focus:border-yellow-500 outline-none"
                type="text"
                id={fieldId}
                onInput={(e) => setDisplayName(e.currentTarget.value)}
              />
              <div className="grid place-items-center mt-8">
                <button
                  className="py-3 px-10 rounded-full bg-yellow-500 disabled:bg-zinc-400 text-white tracking-widest"
                  disabled={!displayName}
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
