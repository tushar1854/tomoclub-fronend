import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import './loader.css';

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader-2">
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      </div>
    </div>
  );
};

export default Loader;
