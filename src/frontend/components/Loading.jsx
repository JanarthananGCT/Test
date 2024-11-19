import React from 'react';
import ForgeReconciler, { Box, Inline, Spinner } from '@forge/react';

const LoadingPage = () => (
  <Box
    xcss={{
      width: "90%",
      margin: "space.500",
      height: "80vh",
    }}
  >
    <Inline alignBlock="center" alignInline="center">
      <Spinner size="large" />
    </Inline>
  </Box>
);

export default LoadingPage;
