import React from 'react';
import { Box, Typography } from '@strapi/design-system';

const PgDataPage = () => {
  return (
    <Box padding={8}>
      <Typography variant="alpha">PostgreSQL Data Display</Typography>
      <Typography variant="beta">Your plugin is working!</Typography>
    </Box>
  );
};

export default PgDataPage;
