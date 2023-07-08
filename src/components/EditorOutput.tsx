"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);

type Props = { content: any };

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

export default function EditorOutput({ content }: Props) {
  return (
    <Output
      data-testid="editor-output"
      data={content}
      style={style}
      className="text-sm"
      renderer={renderers}
    />
  );
}

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]" data-testid="editor-image">
      <Image src={src} alt="post image" className="object-contain" fill />
    </div>
  );
}

function CustomCodeRenderer({ data }: any) {
  console.log(data);

  return (
    <pre className="bg-gray-800 rounded-md p-4" data-testid="editor-code">
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  );
}
