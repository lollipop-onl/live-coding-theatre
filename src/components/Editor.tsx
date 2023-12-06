import { Runner } from './Runner';
import { Disclosure } from '@headlessui/react';
import MonacoEditor from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';

type Props = {
  name: string;
  code: string;
  onChangeName(name: string): void;
  onChangeCode(code: string): void;
};

export const Editor: React.FC<Props> = ({
  name,
  code,
  onChangeName,
  onChangeCode,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [renderKey, setRenderKey] = useState(Date.now());

  const changeName = () => {
    const name = window.prompt('Enter your name');

    if (!name) return;

    onChangeName(name);
  };

  const formatCode = async () => {
    const [prettier, babel, { default: estree }] = await Promise.all([
      import('prettier/standalone'),
      import('prettier/parser-babel'),
      import('prettier/plugins/estree'),
    ]);

    const formattedCode = await prettier.format(code, {
      parser: 'babel',
      plugins: [babel, estree],
    });

    onChangeCode(formattedCode);
    editorRef.current?.setValue(formattedCode);
  };

  useEffect(() => {
    const onResize = () => {
      setRenderKey(Date.now());
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div key={renderKey} className="flex flex-col h-full bg-[#1e1e1e]">
        <MonacoEditor
          className="flex-grow"
          theme="vs-dark"
          language="javascript"
          defaultValue={code}
          options={{
            minimap: {
              enabled: false,
            },
          }}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          onChange={(value) => onChangeCode(value || '')}
        />
        <div className="flex-shrink-0 bg-zinc-800 border-t border-zinc-900 px-4 flex">
          <button
            className="hover:bg-zinc-600 text-zinc-400 py-1 px-2 text-sm flex items-center gap-x-1"
            title="Change your name"
            onClick={changeName}
          >
            <span className="icon-[carbon--face-pending]" />
            {name}
          </button>
          <button
            className="hover:bg-zinc-600 text-zinc-400 py-1 px-2 text-sm flex items-center gap-x-1"
            title="Format code with Prettier"
            onClick={formatCode}
          >
            <span className="icon-[carbon--clean]" />
            Format
          </button>
          <Disclosure>
            <Disclosure.Button
              className="ml-auto hover:bg-zinc-600 text-zinc-400 py-1 px-2 text-sm flex items-center gap-x-1"
              title="Show Execution Result"
            >
              <span className="icon-[carbon--chat-bot]" />
              Execute
            </Disclosure.Button>
            <Disclosure.Panel className="absolute bottom-9 right-5 left-5 drop-shadow">
              <div className="bg-[#444] w-full h-32 rounded">
                <Runner code={code} />
              </div>
              <div className="flex justify-end px-4">
                <div className="w-0 h-0 border-[12px] border-b-0 border-transparent border-t-[#444]" />
              </div>
            </Disclosure.Panel>
          </Disclosure>
        </div>
      </div>
    </>
  );
};
