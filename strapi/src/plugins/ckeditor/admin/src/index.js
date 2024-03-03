import * as yup from 'yup';

import React from 'react';
import styled from 'styled-components';
import { Icon } from '@strapi/design-system/Icon';
import { Flex } from '@strapi/design-system/Flex';
import CKEditorIcon from './CKEditorIcon';
import pluginId from './pluginId'

const IconBox = styled( Flex )`
  background-color: #f0f0ff; /* primary100 */
  border: 1px solid #d9d8ff; /* primary200 */
  svg > path {
    fill: #4945ff; /* primary600 */
  }
`;

export default {
  register( app ) {
    app.customFields.register( {
      name: 'HTMLEditor',
      type: 'richtext',
      pluginId: pluginId,
      icon: () => {
        return (
          <IconBox justifyContent="center" alignItems="center" width={ 7 } height={ 6 } hasRadius aria-hidden>
            <Icon as={ CKEditorIcon } />
          </IconBox>
        );
      },
      intlLabel: {
        id: `${pluginId}.label`,
        defaultMessage: 'HTML Editor'
      },
      intlDescription: {
        id:  `${pluginId}.description`,
        defaultMessage: 'Edit your HTML content'
      },
      components: {
        Input: async () => import( './components/CKEditorInput' ),
      },
      options: {
        base: [
          {
            sectionTitle: null,
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id:  `${pluginId}.required.label`,
                  defaultMessage: 'Required field',
                },
                description: {
                  id:  `${pluginId}.required.description`,
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    } );
  },
  async registerTrads( { locales } ) {
    const importedTrads = await Promise.all(
      locales.map( ( locale ) => {
        return import( `./translations/${ locale }.json` )
          .then( ( { default: data } ) => {
            return {
              data: data,
              locale,
            };
          } )
          .catch( () => {
            return {
              data: {},
              locale,
            };
          } );
      } )
    );

    return Promise.resolve( importedTrads );
  },
};
