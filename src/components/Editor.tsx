import MonacoEditor from '@monaco-editor/react';
import { type editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';

type Props = {
  name: string;
  code: string;
  onChangeName(name: string): void;
  onChangeCode(code: string): void;
  onChangeResult(result: string): void;
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
    <div key={renderKey} className="flex flex-col h-full">
      <MonacoEditor
        className="flex-grow"
        theme="vs-dark"
        defaultLanguage="javascript"
        defaultValue={code}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        onChange={(value) => onChangeCode(value || '')}
      />
      <div className="flex-shrink-0 bg-zinc-800 border-t border-zinc-900 px-4 flex">
        <button
          className="hover:bg-zinc-600 text-zinc-400 py-1 px-2 text-sm flex items-center gap-x-1"
          onClick={changeName}
        >
          <span className="icon-[carbon--face-pending]" />
          {name}
        </button>
        <button
          className="hover:bg-zinc-600 text-zinc-400 py-1 px-2 text-sm flex items-center gap-x-1"
          onClick={formatCode}
        >
          <span className="icon-[carbon--clean]" />
          Format
        </button>
      </div>
    </div>
  );
};
