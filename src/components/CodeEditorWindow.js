import { Editor } from "@monaco-editor/react";
import { useState } from "react";

const CodeEditorWindow = ({ onChange, code, language, theme }) => {
    const [value, setValue] = useState(code || "");

    const handleEditorChange = (value) => {
        setValue(value);
        onChange("code", value);
    };

    return (
        <div className="rounded-md w-full h-full overflow-hidden">
            <Editor
                height="85vh"
                width="130vh"
                value={value}
                language={language || "javascript"}
                theme={theme}
                dafaultValue="// some code"
                onChange={handleEditorChange}
            />
        </div>
    );
};

export default CodeEditorWindow;
