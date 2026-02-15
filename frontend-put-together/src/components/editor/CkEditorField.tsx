import { useEffect, useRef } from "react";

// CKEditor 5 (self-hosted via npm)
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Font,
  Alignment,
  List,
  BlockQuote,
  Table,
  TableToolbar,
} from "ckeditor5";

// CKEditor default styles (important)
import "ckeditor5/ckeditor5.css";

type Props = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
};

export default function CkEditorField({ value, onChange, disabled }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<any>(null);
  const lastValueRef = useRef<string>(value);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!hostRef.current) return;

      const editor = await ClassicEditor.create(hostRef.current, {
        licenseKey: "GPL", 
        plugins: [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Font,
          Alignment,
          List,
          BlockQuote,
          Table,
          TableToolbar,
        ],
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "|",
          "fontSize",
          "fontFamily",
          "|",
          "alignment",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "blockQuote",
          "insertTable",
          "|",
          "undo",
          "redo",
        ],
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
      });

      if (cancelled) {
        await editor.destroy();
        return;
      }

      editorRef.current = editor;

      editor.setData(value ?? "");
      lastValueRef.current = value ?? "";

      editor.model.document.on("change:data", () => {
        const data = editor.getData();
        lastValueRef.current = data;
        onChange(data);
      });

      if (disabled) editor.enableReadOnlyMode("lock");
    }

    init();

    return () => {
      cancelled = true;
      const editor = editorRef.current;
      editorRef.current = null;

      if (editor) {
        editor.destroy().catch((err: any) => console.error("CKEditor destroy error", err));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (value !== lastValueRef.current) {
      editor.setData(value ?? "");
      lastValueRef.current = value ?? "";
    }
  }, [value]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (disabled) editor.enableReadOnlyMode("lock");
    else editor.disableReadOnlyMode("lock");
  }, [disabled]);

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
      <div ref={hostRef} />
    </div>
  );
}