import React from 'react';
import { GifGrid } from './features/gifs/GifGrid';
import { Container, makeStyles, Box, Typography } from '@material-ui/core';
import { GifSearch } from './features/gifs/GifSearch';
import { GifLightbox } from './features/gifs/GifLightbox';

const useStyles = makeStyles((theme) => ({
  root: {},
  search: {
    marginBottom: theme.spacing(2),
    position: 'sticky',
    top: theme.spacing(2),
    zIndex: theme.zIndex.modal,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Container component="header" maxWidth="md">
        <Typography variant="h1">Gifs!</Typography>
      </Container>
      <Container component="section" maxWidth="md">
        <GifSearch className={classes.search} fullWidth />
        <GifGrid />
        <GifLightbox />
      </Container>
    </Box>
  );
}

export default App;
