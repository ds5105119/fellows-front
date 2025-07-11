"use client";

import {
  ConditionalContents,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  ChangeCodeMirrorLanguage,
  CreateLink,
  InsertCodeBlock,
  InsertImage,
  ListsToggle,
  Separator,
} from "@mdxeditor/editor";

const Toolbar = () => (
  <ConditionalContents
    options={[
      {
        when: (editor) => editor?.editorType === "codeblock",
        contents: () => <ChangeCodeMirrorLanguage />,
      },
      {
        fallback: () => (
          <>
            <UndoRedo />
            <Separator />

            <BoldItalicUnderlineToggles />
            <ListsToggle />
            <Separator />

            <CodeToggle />
            <InsertCodeBlock />
            <Separator />

            <InsertImage />
            <CreateLink />
          </>
        ),
      },
    ]}
  />
);

export default Toolbar;
