"use client";

import { createElement, useMemo } from "react";
import * as runtime from "react/jsx-runtime";

function getMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default as React.ComponentType<{
    components?: Record<string, React.ComponentType>;
  }>;
}

type MdxContentProps = {
  code: string;
};

export function MdxContent({ code }: MdxContentProps) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-pre:my-0 prose-code:before:content-none prose-code:after:content-none">
      {createElement(Component)}
    </article>
  );
}
