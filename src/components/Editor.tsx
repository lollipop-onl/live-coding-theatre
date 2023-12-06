import { Runner } from './Runner';
import MonacoEditor from '@monaco-editor/react';
import Monaco, { editor } from 'monaco-editor';
import { useEffect, useMemo, useRef, useState } from 'react';


type Props = {
  name: string;
  code: string;
  value: string;
  onChangeName(name: string): void;
  onChangeCode(code: string): void;
};

export const Editor: React.FC<Props> = ({
  name,
  code,
  value,
  onChangeName,
  onChangeCode,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const [renderKey, setRenderKey] = useState(Date.now());

  const providedValue = useMemo(() => {
    try {
      JSON.parse(value);

      return value;
    } catch {
      return 'null';
    }
  }, [value]);

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

  useEffect(() => {
    if (!monacoRef.current) return;

    const disposable =
      monacoRef.current.languages.typescript.javascriptDefaults.addExtraLib(
        `
        /** 
         * Post your answer to the question 
         * @param {unknown} answer Value of the answer
         */
        declare function postAnswer(answer: unknown): void;

        /**
         * Provided value of the question
         */
        declare const _value: ${providedValue}
      `,
      );

    return () => disposable.dispose();
  }, [monacoRef.current, value]);

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
          onMount={(editor, monaco) => {
            monacoRef.current = monaco;
            editorRef.current = editor;
          }}
          onChange={(value) => onChangeCode(value || '')}
        />
        <div className="flex-shrink-0 border-t border-zinc-900">
          <Runner code={code} value={value} />
        </div>
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
          <p className="ml-auto text-zinc-400 py-1 px-2 text-sm grid place-items-center">
            {code.length} chars
          </p>
        </div>
      </div>
    </>
  );
};