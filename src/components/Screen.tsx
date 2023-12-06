import screen_logo from 'assets/images/screen_logo.svg';
import { clsx } from 'clsx';

type Props = {
  text: string;
};

export const Screen: React.FC<Props> = ({ text }) => {
  return (
    <div className="relative bg-gradient-to-t from-[#131313] to-[#0B0B0B]">
      <div className="py-2 max-w-3xl mx-auto">
        <div className="border-black border-y-4 border-x-8 bg-white">
          <div className="overflow-y-auto py-4 px-8 h-24">
            <div className="relative w-full h-full grid place-items-center">
              <p className="whitespace-pre-line">{text}</p>
              <img
                src={screen_logo}
                alt="Live Coding Theatre"
                className={clsx(
                  'absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 h-8  delay-700 transition duration-300 pointer-events-none',
                  {
                    'opacity-0 transition-none': text,
                  },
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute pointer-events-none inset-0 w-full h-full bg-gradient-to-t from-[#00000000] to-[#00000040]"></div>
    </div>
  );
};
