import { makeStyles, MenuItem, TextField } from '@material-ui/core';
import { useField } from 'formik';
import React, { useEffect } from 'react';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  multiple?: boolean;
  MuiSize?: 'small' | 'medium';
  helperText?: string | null;
  select?: {
    defaultValue: string;
    options: Array<{ value: string; label: string }>;
  };
  // onCustomChange?: (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => any;
};

const useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: '1.8rem',
  },
}));

const InputField: React.FC<InputFieldProps> = ({
  color,
  MuiSize = 'medium',
  label,
  multiple = false,
  helperText = null,
  select = undefined,
  // onCustomChange,
  ...props
}) => {
  const classes = useStyles();

  const [field, { touched, error, initialTouched }] = useField(props);

  useEffect(() => {
    console.log(field);
  }, [field]);

  return (
    <TextField
      className={classes.textField}
      {...props}
      {...field}
      // onChange={onCustomChange ? onCustomChange : field.onChange}
      id={field.name}
      variant='outlined'
      fullWidth
      select={!!select}
      size={MuiSize}
      multiline={multiple}
      InputLabelProps={{
        shrink:
          props.type === 'date'
            ? true
            : props.type === 'checkbox'
            ? false
            : undefined,
      }}
      rows={multiple ? 4 : 1}
      label={label}
      error={touched && Boolean(error)}
      helperText={error ? error : !initialTouched && helperText}
    >
      {select &&
        select.options.map((option) => (
          <MenuItem
            // style={{ cursor: 'pointer', padding: '0.3rem' }}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default InputField;
