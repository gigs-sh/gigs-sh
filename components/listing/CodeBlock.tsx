"use client";

import { useState } from "react";
import { IconCheck, IconCopy } from "../icons";

export function CodeBlock({
  code,
  language,
  copyable = true,
}: {
  code: string;
  language: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="codeblock">
      <div className="cb-chrome mono">
        <span className="cb-lang">{language}</span>
        {copyable && (
          <button
            type="button"
            className={`copy-btn mono ${copied ? "is-copied" : ""}`}
            onClick={onCopy}
            aria-label="Copy code"
          >
            {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        )}
      </div>
      <pre className="cb-code mono">{code}</pre>
    </div>
  );
}
