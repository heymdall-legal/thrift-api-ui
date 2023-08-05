import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor';

type Props = {
    value: string;
    jsonSchema?: any;
    onChange: (value: string) => void;
    className?: string;
};

export const HeaderEditor = (props: Props) => {
    const editorHeader = React.useRef<typeof monacoEditor| null>(null);

    const editorHeaderWillMount = React.useCallback(
        (monaco: typeof monacoEditor) => {
            editorHeader.current = monaco;
        },
        []
    );

    React.useEffect(() => {
        if (editorHeader.current) {
            if (!props.jsonSchema) {
                editorHeader.current.languages.json.jsonDefaults.setDiagnosticsOptions({
                    validate: false
                });
            } else {
                editorHeader.current.languages.json.jsonDefaults.setDiagnosticsOptions({
                    validate: true,
                    schemas: [{
                        uri: 'http://thrift-api-ui.ru/schema.json',
                        fileMatch: ['*'],
                        schema: props.jsonSchema
                    }]
                });
            }
        }
    }, [props.jsonSchema, editorHeader.current]);

    return (
        <div className={ props.className }>
            <MonacoEditor
                language="json"
                theme="vs-light"
                value={ props.value }
                options={ { scrollBeyondLastLine: false, minimap: { enabled: false }, automaticLayout: true } }
                onChange={ props.onChange }
                editorWillMount={ editorHeaderWillMount }
            />
        </div>
    );
};
