import { Runner } from './Runner';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type Props = {
  displayName: string;
  code: string;
};

export const Seat: React.FC<Props> = ({ displayName, code }) => {
  return (
    <div className="bg-[#282c34] border-2 border-zinc-900 rounded-tl-2xl">
      <div className="pt-2 px-3">
        <div className="flex items-center justify-between gap-x-4">
          <p className="flex items-center gap-x-2  text-zinc-300 overflow-hidden">
            <span className="icon-[carbon--code] flex-shrink-0 w-5 h-5" />
            <span className="text-xs font-bold whitespace-nowrap">
              by {displayName}
            </span>
          </p>
          <p className="flex-shrink-0 text-xs text-zinc-400">123 chars</p>
        </div>
      </div>
      <div className="min-h-[80px] max-h-[200px] overflow-y-auto px-2">
        <SyntaxHighlighter language="javascript" style={atomOneDark}>
          {code}
        </SyntaxHighlighter>
      </div>
      <div className="border-t-2 border-zinc-900">
        <Runner code={code} />
      </div>
    </div>
  );
};
