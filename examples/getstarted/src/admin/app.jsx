import React, { useEffect } from 'react';
import { Button } from '@strapi/design-system';
import { registerPreviewRoute } from './preview';

const config = {
  locales: ['it', 'es', 'en', 'en-GB'], // Available locales
};

// Add custom title, favicon, and logo in the bootstrap method
const bootstrap = (app) => {
  // Set a custom title when the admin panel loads
  document.title = 'AI4MAHILA ADMIN PORTAL'; // Change to your desired title

  // Add custom favicon
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = 'strapi/examples/getstarted/C4CK_logo.png'; // Replace with the correct path to your favicon
  document.head.appendChild(link);

  

  // Add a "Preview" button to the content manager
  app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
    name: 'PreviewButton',
    Component: () => (
      <Button onClick={() => window.alert('Not here, The preview is.')}>Preview</Button>
    ),
  });
};

export default {
  config,
  register: (app) => {
    registerPreviewRoute(app);
  },
  bootstrap,
};
