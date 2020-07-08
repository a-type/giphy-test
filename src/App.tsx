import React from 'react';
import { GifGrid } from './features/gifs/GifGrid';
import { Container, makeStyles, Box, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function App() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Container component="header" maxWidth="md">
        <Typography variant="h1">Gifs!</Typography>
      </Container>
      <Container component="section" maxWidth="md">
        <GifGrid />
      </Container>
    </Box>
  );
}

export default App;
