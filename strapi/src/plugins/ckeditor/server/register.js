'use strict';

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: 'HTMLEditor',
    plugin: 'ckeditor',
    type: 'richtext'
  })
};
