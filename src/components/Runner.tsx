import { clsx } from 'clsx';
import RunnerWorker from 'modules/runner.worker?worker';
import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type Props = {
  code: string;
};

type RunnerAnswer = {
  success: boolean;
  body: string;
};

export const Runner: React.FC<Props> = ({ code }) => {
  const [answer, setAnswer] = useState<RunnerAnswer>();
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setIsRunning(true);

    const worker = new RunnerWorker();
    let isSucceed = false;

    worker.addEventListener('message', ({ data }) => {
      isSucceed = true;

      if (!data || typeof data !== 'object') return;

      const { success, body } = data;

      if (typeof body === 'string') {
        setAnswer({
          success: typeof success === 'boolean' ? true : success,
          body,
        });
      } else {
        setAnswer(undefined);
      }

      setIsRunning(false);
    });

    worker.postMessage(code);

    setTimeout(() => {
      if (!isSucceed) {
        worker.terminate();
        setAnswer(undefined);
        setIsRunning(false);
      }
    }, 3_000);

    return () => {
      worker.terminate();
    };
  }, [code]);

  return (
    <div className="bg-[#2b2b2b] h-12">
      <div className="relative h-full max-w-3xl mx-auto">
        <div className="w-full h-full p-2 break-all text-sm">
          {!answer ? (
            <div className="h-full flex items-center">
              <p className="text-zinc-500">No Answer</p>
            </div>
          ) : (
            <SyntaxHighlighter style={darcula}>{answer.body}</SyntaxHighlighter>
          )}
        </div>
        <div
          className={clsx(
            'absolute top-1 right-2 rounded-full w-2 border border-zinc-600 h-2',
            isRunning ? 'bg-red-600' : !answer ? 'bg-zinc-600' : 'bg-green-600',
          )}
        />
      </div>
    </div>
  );
};