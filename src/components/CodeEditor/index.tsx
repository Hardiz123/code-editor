import { useState, ChangeEvent, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import "./styles.css";

const CodeEditor = () => {
  const [code, setCode] = useState(
    'function sayHello() {\n\tconsole.log("Hello, World!");\n}'
  );
  const codeAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleCodeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleSpecialKeys = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const { selectionStart, selectionEnd } = event.currentTarget;
      const newCode =
        code.substring(0, selectionStart) + "\t" + code.substring(selectionEnd);
      setCode(newCode);
      event.currentTarget.setSelectionRange(
        selectionStart + 4,
        selectionStart + 4
      );
      codeAreaRef!.current!.focus();
      codeAreaRef!.current!.value = newCode;
      codeAreaRef!.current!.setSelectionRange(
        selectionStart + 2,
        selectionStart + 1
      );
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const { selectionStart, selectionEnd } = event.currentTarget;
      const currentLine =
        code.substring(0, selectionStart).split("\n").pop() || "";
      const indentation = /^[ \t]*/.exec(currentLine);
      const newLine = "\n" + indentation;
      const newCode =
        code.substring(0, selectionStart) +
        newLine +
        code.substring(selectionStart);
      setCode(newCode);
      event.currentTarget.setSelectionRange(
        selectionStart + indentation!.length + 1,
        selectionStart + indentation!.length + 1
      );

      console.log(selectionStart, selectionEnd, "selectionStart");

      codeAreaRef!.current!.focus();
      codeAreaRef!.current!.value = newCode;
      // get number of \t in indentation
      const tabCount = indentation![0].split("\t").length - 1;

      codeAreaRef!.current!.setSelectionRange(
        selectionStart + indentation!.length + tabCount + 2,
        selectionStart + indentation!.length + tabCount
      );
    }
  };

  const highlightedCode = Prism.highlight(
    code,
    Prism.languages.javascript,
    "javascript"
  );

  return (
    <div>
      <div className="editor-container">
        <div className="editor">
          <textarea
            value={code}
            ref={codeAreaRef}
            onChange={handleCodeChange}
            className="code-editor"
            spellCheck="false"
            autoCorrect="false"
            autoCapitalize="false"
            onKeyDown={handleSpecialKeys}
          ></textarea>
        </div>
        <div className="output">
          <pre>
            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
