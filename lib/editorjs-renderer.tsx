import React from "react";

type Block = {
    type: string;
    data: any;
};

type EditorData = {
    blocks: Block[];
};

export function renderEditorJsContent(data: EditorData) {
    return data.blocks.map((block, index) => {
        switch (block.type) {
            case "paragraph":
                return (
                    <p
                        key={index}
                        dangerouslySetInnerHTML={{ __html: block.data.text }}
                        className="mb-4"
                    />
                );
            case "header":
                const Tag =
                    `h${block.data.level}` as keyof JSX.IntrinsicElements;
                return (
                    <Tag
                        key={index}
                        dangerouslySetInnerHTML={{ __html: block.data.text }}
                        className="mt-6 mb-2 font-semibold"
                    />
                );
            case "linkTool":
            case "link":
                return (
                    <p key={index}>
                        <a
                            href={block.data.link || block.data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            {block.data.meta?.title ||
                                block.data.link ||
                                block.data.url}
                        </a>
                    </p>
                );
                case "list":
                    const items = block.data.items.map((item: any) =>
                      typeof item === "string" ? item : item.content || ""
                    );
                  
                    return block.data.style === "ordered" ? (
                      <ol key={index} className="list-decimal list-inside mb-4">
                        {items.map((text: string, i: number) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: text }} />
                        ))}
                      </ol>
                    ) : (
                      <ul key={index} className="list-disc list-inside mb-4">
                        {items.map((text: string, i: number) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: text }} />
                        ))}
                      </ul>
                    );
                  
            case "code":
                // Se il codice contiene un iframe (come Google Maps), renderizzalo in modo sicuro
                if (block.data.code.includes("<iframe")) {
                    return (
                        <div
                            key={index}
                            className="my-6"
                            dangerouslySetInnerHTML={{
                                __html: block.data.code,
                            }}
                        />
                    );
                }

                // Altrimenti, mostra il codice in un <pre><code>
                return (
                    <pre
                        key={index}
                        className="bg-gray-100 p-4 rounded overflow-x-auto text-sm"
                    >
                        <code>{block.data.code}</code>
                    </pre>
                );

            default:
                return null;
        }
    });
}
