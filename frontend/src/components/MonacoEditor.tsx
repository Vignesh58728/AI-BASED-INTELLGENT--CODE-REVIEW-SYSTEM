// Re-export the native MonacoEditor components from the local source
export { default as MonacoEditor, MonacoDiffEditor, monaco } from './monaco-editor/index';
export type {
   MonacoEditorProps,
   MonacoDiffEditorProps,
   MonacoEditorHandle,
   MonacoDiffEditorHandle,
   Theme,
   ChangeHandler,
   EditorWillMount,
   EditorDidMount,
   EditorWillUnmount,
} from './monaco-editor/types';
