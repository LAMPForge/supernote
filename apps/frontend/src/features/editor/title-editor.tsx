import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { Document } from "@tiptap/extension-document";
import { Heading } from "@tiptap/extension-heading";
import { Text } from "@tiptap/extension-text";
import { Placeholder } from "@tiptap/extension-placeholder";
import { History } from "@tiptap/extension-history";
import { useUpdatePageMutation } from '../page/queries/page-query.ts';
import { useAtom, useAtomValue } from 'jotai';
import { treeDataAtom } from '../page/tree/atoms/tree-data-atom.ts';
import { useNavigate } from 'react-router-dom';
import { buildPageUrl } from '../page/page.utils.ts';
import { updateTreeNodeName } from '../page/tree/tree.utils.ts';
import { pageEditorAtom, titleEditorAtom } from './atoms/edit-atoms.ts';
import "./styles/index.css";

export interface TitleEditorProps {
  pageId: string;
  slugId: string;
  title: string;
  spaceSlug: string;
  editable: boolean;
}

export function TitleEditor({
  pageId,
  slugId,
  title,
  spaceSlug,
  editable,
}: TitleEditorProps) {
  const [debouncedTitleState, setDebouncedTitleState] = useState(null);
  const [debouncedTitle] = useDebouncedValue(debouncedTitleState, 1000);
  const updatePageMutation = useUpdatePageMutation();
  const pageEditor = useAtomValue(pageEditorAtom);
  const [, setTitleEditor] = useAtom(titleEditorAtom);
  const [treeData, setTreeData] = useAtom(treeDataAtom);

  const navigate = useNavigate();

  const titleEditor = useEditor({
    extensions: [
      Document.extend({
        content: "heading",
      }),
      Heading.configure({
        levels: [1],
      }),
      Text,
      Placeholder.configure({
        placeholder: "Untitled",
        showOnlyWhenEditable: false,
      }),
      History.configure({
        depth: 20,
      }),
    ],
    onCreate({ editor }) {
      if (editor) {
        // @ts-ignore
        setTitleEditor(editor);
      }
    },
    onUpdate({ editor }) {
      const currentTitle = editor.getText();
      setDebouncedTitleState(currentTitle);
    },
    editable: editable,
    content: title,
  });

  useEffect(() => {
    const pageSlug = buildPageUrl(spaceSlug, slugId, title);
    navigate(pageSlug, { replace: true });
  }, [title]);

  useEffect(() => {
    if (debouncedTitle !== null) {
      updatePageMutation.mutate({
        pageId: pageId,
        title: debouncedTitle,
      });

      const newTreeData = updateTreeNodeName(treeData, pageId, debouncedTitle);
      setTreeData(newTreeData);
    }
  }, [debouncedTitle]);

  useEffect(() => {
    if (titleEditor && title !== titleEditor.getText()) {
      titleEditor.commands.setContent(title);
    }
  }, [pageId, title, titleEditor]);

  useEffect(() => {
    setTimeout(() => {
      titleEditor?.commands.focus("end");
    }, 500);
  }, [titleEditor]);

  function handleTitleKeyDown(event) {
    if (!titleEditor || !pageEditor || event.shiftKey) return;

    const { key } = event;
    const { $head } = titleEditor.state.selection;

    const shouldFocusEditor =
      key === "Enter" ||
      key === "ArrowDown" ||
      (key === "ArrowRight" && !$head.nodeAfter);

    if (shouldFocusEditor) {
      pageEditor.commands.focus("start");
    }
  }

  return <EditorContent editor={titleEditor} onKeyDown={handleTitleKeyDown} />;
}