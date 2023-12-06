import { clsx } from 'clsx';
import RunnerWorker from 'modules/runner.worker?worker';
import { useEffect, useState } from 'react';

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

    worker.addEventListener('message', ({ data }) => {
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

    return () => {
      worker.terminate();
    };
  }, [code]);

  return (
    <div className="relative w-full h-full p-2">
      <div className="overflow-y-auto w-full h-full p-2 break-all">
        <span className="text-zinc-400 font-mono">
          {answer ? answer.body : 'No Answer'}
        </span>
      </div>
      <div
        className={clsx(
          'absolute top-1 right-1 rounded-full w-2 border border-zinc-600 h-2',
          isRunning ? 'bg-red-600' : !answer ? 'bg-zinc-600' : 'bg-green-600',
        )}
      />
    </div>
  );
};
