"use client";

import { useRef, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

async function uploadImage(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: data });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json.url;
}

const extensions = [
  StarterKit,
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors cursor-pointer text-gray-900 font-medium",
    },
  }),
  Image.configure({ inline: true }),
];

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [linkUrl, setLinkUrl] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content,
    onUpdate: ({ editor }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onChange(editor.getHTML());
      }, 500);
    },
  });

  useEffect(() => {
    if (!editor) return;

    // Update BubbleMenu state on selection
    const update = () => {
      if (editor.isActive("link")) {
        setLinkUrl(editor.getAttributes("link").href || "");
        setIsAddingLink(false);
      }
    };
    editor.on("selectionUpdate", update);

    return () => {
      editor.off("selectionUpdate", update);
    };
  }, [editor]);

  async function handleImageUpload(file: File) {
    if (!editor) return;
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      // Silently fail — user can retry
    }
  }

  if (!editor) return null;

  async function onPaste(e: React.ClipboardEvent) {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) await handleImageUpload(file);
        break;
      }
    }
  }

  async function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        await handleImageUpload(file);
      }
    }
  }

  async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await handleImageUpload(file);
    e.target.value = "";
  }

  if (!editor) return null;

  const btn = (label: React.ReactNode, action: () => void, isActive?: boolean) => (
    <button
      type="button"
      onClick={action}
      className={`rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors ${isActive
        ? "bg-gray-900 text-white border-gray-900"
        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}
    >
      {label}
    </button>
  );

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setIsAddingLink(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl relative bg-white">
      {/* Link Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          options={{
            placement: "bottom",
            onHide: () => setIsAddingLink(false),
          }}
          shouldShow={({ editor }) => editor.isActive("link") || isAddingLink}
        >
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-1.5 flex items-center gap-1 z-50">
            {isAddingLink ? (
              <form onSubmit={handleLinkSubmit} className="flex items-center gap-1">
                <input
                  autoFocus
                  type="url"
                  className="text-sm px-2 py-1 outline-none border border-gray-200 rounded min-w-[220px]"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Paste a link... (https://)"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingLink(false);
                    editor.commands.focus();
                  }}
                  className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline px-2 py-1 max-w-[250px] truncate block font-medium"
                >
                  {linkUrl}
                </a>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button
                  type="button"
                  onClick={() => setIsAddingLink(true)}
                  className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  title="Edit link"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                  title="Remove link"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </BubbleMenu>
      )}

      {/* Toolbar */}
      <div className="sticky top-[var(--navbar-h)] z-20 flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-gray-200 bg-gray-50/95 backdrop-blur-sm rounded-t-xl">
        {btn("B", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
        {btn("I", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
        {btn("U", () => editor.chain().focus().toggleUnderline().run(), editor.isActive("underline"))}
        {btn(
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
          () => {
            if (editor.isActive("link")) {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            const previousUrl = editor.getAttributes("link").href;
            setLinkUrl(previousUrl || "");
            setIsAddingLink(true);
          }, editor.isActive("link"))}
        {btn("H1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }))}
        {btn("H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
        {btn("•", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        {btn("1.", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
        {btn('" "', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}
        {btn("</>", () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive("codeBlock"))}
        {btn("__", () => editor.chain().focus().setHorizontalRule().run())}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Insert Image"
          className="rounded-md px-2.5 py-1.5 text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />
        {btn(
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>,
          () => editor.chain().focus().undo().run()
        )}
        {btn(
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>,
          () => editor.chain().focus().redo().run()
        )}
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        onPaste={onPaste}
        onDrop={onDrop}
        className="prose prose-sm max-w-none px-4 py-3 min-h-[300px] focus:outline-none [&_.ProseMirror:focus]:outline-none [&_.ProseMirror>p.is-empty::before]:text-gray-300 [&_.ProseMirror>p.is-empty::before]:content-[attr(data-placeholder)] [&_.ProseMirror>p.is-empty::before]:float-left [&_.ProseMirror>p.is-empty::before]:pointer-events-none [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:max-w-full"
      />
    </div>
  );
}
