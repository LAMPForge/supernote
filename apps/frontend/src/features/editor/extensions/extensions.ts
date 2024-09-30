import Placeholder from "@tiptap/extension-placeholder";
import { StarterKit } from "@tiptap/starter-kit";
import SlashCommand from "./slash-command";

export const mainExtensions = [
  StarterKit.configure({
    history: false,
    dropcursor: {
      width: 3,
      color: "#70CFF8",
    },
    codeBlock: false,
    code: {
      HTMLAttributes: {
        spellcheck: false,
      },
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }
      if (node.type.name === "detailsSummary") {
        return "Toggle title";
      }
      if (node.type.name === "paragraph") {
        return 'Write anything. Enter "/" for commands';
      }
    },
    includeChildren: true,
    showOnlyWhenEditable: true,
  }),
  SlashCommand,
] as any;