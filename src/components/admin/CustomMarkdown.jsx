"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function CustomMarkdown({ content, isDark = true }) {
  return (
    <div className="space-y-4 text-xs text-zinc-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold text-zinc-100 mt-6 mb-3 tracking-tight font-outfit" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold text-zinc-100 mt-5 mb-2.5 tracking-tight font-outfit" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h4 className="text-sm font-semibold text-zinc-200 mt-4 mb-2 font-outfit" {...props} />
          ),
          p: ({ node, ...props }) => <p className="text-xs leading-relaxed mb-3 text-zinc-300 font-sans" {...props} />,
          a: ({ node, ...props }) => (
            <a className="font-medium text-red-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            if (inline || !String(children).includes("\n")) {
              return (
                <code className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-white/[0.08] text-red-400" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <div className="p-3.5 rounded-lg font-mono text-[11px] overflow-x-auto mb-3 border border-white/[0.08] bg-[#0E0E10] text-zinc-300">
                <pre className="leading-relaxed"><code {...props}>{children}</code></pre>
              </div>
            );
          },
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-red-500 pl-3 py-1 my-3 text-xs text-zinc-400 italic bg-white/[0.03] rounded-r" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-zinc-300" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-zinc-300" {...props} />,
          table: ({ node, ...props }) => (
            <div className="w-full overflow-x-auto mb-4 rounded-lg border border-white/[0.08]">
              <table className="w-full text-left border-collapse text-xs bg-[#111113] text-zinc-300" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => <th className="p-2 font-semibold border-b border-white/[0.08]" {...props} />,
          td: ({ node, ...props }) => <td className="p-2 border-b border-white/[0.06]" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
