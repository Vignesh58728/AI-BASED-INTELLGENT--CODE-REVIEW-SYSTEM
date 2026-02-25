import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "@/context/ThemeContext";

interface CodeEditorProps {
   value: string;
   language?: string;
   onChange: (value: string | undefined) => void;
}

export function CodeEditor({ value, onChange, language = "python" }: CodeEditorProps) {
   const { theme } = useTheme();

   const handleEditorMount: OnMount = (_editor, monaco) => {
      // You can configure the editor here
      monaco.editor.defineTheme('my-dark', {
         base: 'vs-dark',
         inherit: true,
         rules: [],
         colors: {
            'editor.background': '#1e1e1e',
         }
      });
   }

   return (
      <div className="h-full w-full rounded-md overflow-hidden border">
         <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            value={value}
            theme={theme === 'dark' ? "vs-dark" : "light"}
            onChange={onChange}
            onMount={handleEditorMount}
            options={{
               minimap: { enabled: false },
               fontSize: 14,
               padding: { top: 16 },
               scrollBeyondLastLine: false,
            }}
         />
      </div>
   );
}
