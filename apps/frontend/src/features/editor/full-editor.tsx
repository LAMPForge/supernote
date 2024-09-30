import { useAtom } from 'jotai';
import { userAtom } from '../user/atoms/current-user-atom.ts';
import { Container } from '@mantine/core';
import classes from './styles/editor.module.css';
import React from 'react';
import { TitleEditor } from './title-editor.tsx';
import PageEditor from './page-editor.tsx';

const MemoizedTitleEditor = React.memo(TitleEditor);
const MemoizedPageEditor = React.memo(PageEditor);

export interface FullEditorProps {
  pageId: string;
  slugId: string;
  title: string;
  spaceSlug: string;
  editable: boolean;
}

export function FullEditor({
  pageId,
  slugId,
  title,
  spaceSlug,
  editable,
}: FullEditorProps) {
  const [user] = useAtom(userAtom)
  const fullPageWidth = user.settings?.preferences?.fullPageWidth;

  return (
    <Container
      fluid={fullPageWidth}
      {...(fullPageWidth && { mx: 80 })}
      size={850}
      className={classes.editor}
    >
      <MemoizedTitleEditor
        pageId={pageId}
        slugId={slugId}
        title={title}
        spaceSlug={spaceSlug}
        editable={editable}
      />
      <MemoizedPageEditor pageId={pageId} editable={editable} />
    </Container>
  )
}
