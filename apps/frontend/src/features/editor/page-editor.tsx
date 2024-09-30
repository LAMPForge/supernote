import { EditorContent, useEditor } from '@tiptap/react';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../user/atoms/current-user-atom.ts';
import { pageEditorAtom } from './atoms/edit-atoms.ts';
import { asideStateAtom } from '../../components/layouts/global/atoms/sidebar-atom.ts';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { mainExtensions } from './extensions/extensions.ts';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';
import EditorSkeleton from './components/editor-skeleton.tsx';

interface PageEditorProps {
  pageId: string;
  editable: boolean;
}

export default function PageEditor({ pageId, editable }: PageEditorProps) {
  const [currentUser] = useAtom(currentUserAtom);
  const [, setEditor] = useAtom(pageEditorAtom);
  const [, setAsideState] = useAtom(asideStateAtom);
  const documentName = `page.${pageId}`;
  const menuContainerRef = useRef(null);
  const ydoc = useMemo(() => new Y.Doc(), [pageId]);
  const [isLocalSynced, setLocalSynced] = useState(false);

  const localProvider = useMemo(() => {
    const provider = new IndexeddbPersistence(documentName, ydoc);

    provider.on("synced", () => {
      setLocalSynced(true);
    });

    return provider;
  }, [pageId, ydoc]);

  useLayoutEffect(() => {
    return () => {
      setLocalSynced(false);
      localProvider.destroy();
    };
  }, [localProvider]);

  const extensions = [
    ...mainExtensions,
  ];

  const editor = useEditor(
    {
      extensions,
      editable,
      editorProps: {
        handleDOMEvents: {
          keydown: (_view, event) => {
            if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
              const slashCommand = document.querySelector("#slash-command");
              if (slashCommand) {
                return true;
              }
            }
          },
        },
      },
      onCreate({ editor }) {
        if (editor) {
          // @ts-ignore
          setEditor(editor);
          editor.storage.pageId = pageId;
        }
      },
    },
    [pageId, editable],
  );

  return isLocalSynced ? (
    <div>
      <div ref={menuContainerRef}>
        <EditorContent editor={editor} />
      </div>
    </div>
  ): (
    <EditorSkeleton />
  )
}