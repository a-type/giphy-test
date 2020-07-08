import * as React from 'react';
import {
  makeStyles,
  Theme,
  TextField,
  OutlinedTextFieldProps,
  IconButton,
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectSearchQuery, setSearchQuery } from './gifsSlice';
import clsx from 'clsx';

export type GifSearchProps = Omit<
  OutlinedTextFieldProps,
  'value' | 'onChange' | 'variant'
>;

const useStyles = makeStyles<Theme, GifSearchProps>((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
}));

export function GifSearch(props: GifSearchProps) {
  const classes = useStyles(props);
  const { className, InputProps, ...rest } = props;

  const searchQuery = useSelector(selectSearchQuery);
  const dispatch = useDispatch();
  const onInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchQuery(event.target.value));
    },
    [dispatch],
  );
  const onClear = React.useCallback(() => {
    dispatch(setSearchQuery(''));
  }, [dispatch]);

  return (
    <TextField
      label="Search!"
      value={searchQuery}
      onChange={onInputChange}
      variant="outlined"
      className={clsx(classes.root, className)}
      InputProps={{
        ...InputProps,
        endAdornment: searchQuery && (
          <IconButton onClick={onClear}>
            <Clear />
          </IconButton>
        ),
      }}
      {...rest}
    />
  );
}
