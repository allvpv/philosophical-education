import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Stack } from '@strapi/design-system/Stack';
import { Field, FieldHint, FieldError, FieldLabel } from '@strapi/design-system/Field';

import { getGlobalStyling } from './GlobalStyling';
import EditorConfig from './EditorConfig';
import MediaLib from '../MediaLib';

import { CKEditor } from '@ckeditor/ckeditor5-react';

import ckeditor5Dll from 'ckeditor5/build/ckeditor5-dll.js';
import ckeditor5EditorBaloonDll from '@ckeditor/ckeditor5-editor-classic/build/editor-classic.js';

import sanitize from './utils/utils';

const settings = {};

const CKEditorInput = ({
  attribute,
  onChange,
  name,
  value,
  disabled,
  labelAction,
  intlLabel,
  required,
  description,
  error
}) => {
  const [ editorInstance, setEditorInstance ] = useState(false);
  const { formatMessage } = useIntl();
  const strapiTheme = localStorage.getItem('STRAPI_THEME');
  const GlobalStyling = getGlobalStyling(strapiTheme);

  const [ mediaLibVisible, setMediaLibVisible ] = useState(false);

  const handleToggleMediaLib = () => setMediaLibVisible(prev => !prev);

  const handleChangeAssets = assets => {
    let htmlString = '';

    assets.map(asset => {
      if (asset.mime.includes('image')) {
        const url = sanitize(asset.url);
        const alt = sanitize(asset.alt);

        htmlString += `<img src="${ url }" alt="${ alt }" />`;
      } else {
        const url = sanitize(asset.url);
        const alt = sanitize(asset.alt);

        htmlString += `<a href="${url}"">${alt}</a>`;
      }
    });

    const viewFragment = editorInstance.data.processor.toView(htmlString);
    const modelFragment = editorInstance.data.toModel(viewFragment);
    editorInstance.model.insertContent(modelFragment);

    handleToggleMediaLib();
  };

  return (
    <Field
      name={name}
      id={name}
      error={error}
      hint={description && formatMessage(description)}>
      <Stack spacing={ 1 }>
        <FieldLabel action={ labelAction } required={ required }>
          { formatMessage( intlLabel ) }
        </FieldLabel>
        <GlobalStyling />
        <CKEditor
          editor={ window.CKEditor5.editorClassic.ClassicEditor }
          disabled={ disabled }
          data={ value }
          onReady={ (editor) => {
            const mediaLibPlugin = editor.plugins.get('strapiMediaLib');
            mediaLibPlugin.connect(handleToggleMediaLib);

            setEditorInstance(editor);
          }}
          onChange={ (event, editor) => {
            const data = editor.getData();
            onChange({ target: { name, value: data } });
          }}
          config={ EditorConfig }
        />
        <FieldHint />
        <FieldError />
      </Stack>
      <MediaLib
        isOpen={ mediaLibVisible }
        onChange={ handleChangeAssets }
        onToggle={ handleToggleMediaLib } />
    </Field>
  );
};

CKEditorInput.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: '',
};

export default CKEditorInput;
