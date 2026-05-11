"use client";

import { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
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

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Write your blog content here...",
      }),
      Image.configure({ inline: true }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

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

  const btn = (label: string, action: () => void, isActive?: boolean) => (
    <button
      type="button"
      onClick={action}
      className={`rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors ${
        isActive
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-gray-200 bg-gray-50/50">
        {btn("B", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
        {btn("I", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
        {btn("U", () => editor.chain().focus().toggleUnderline().run(), editor.isActive("underline"))}
        <div className="w-px h-5 bg-gray-200 mx-1" />
        {btn("H1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }))}
        {btn("H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
        <div className="w-px h-5 bg-gray-200 mx-1" />
        {btn("• List", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        {btn("1. List", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
        {btn('" Quote', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}
        <div className="w-px h-5 bg-gray-200 mx-1" />
        {btn("Code", () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive("codeBlock"))}
        {btn("HR", () => editor.chain().focus().setHorizontalRule().run())}
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md px-2.5 py-1.5 text-xs font-medium border bg-white text-gray-600 border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        {btn("Undo", () => editor.chain().focus().undo().run())}
        {btn("Redo", () => editor.chain().focus().redo().run())}
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
