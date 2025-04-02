import React from 'react';
import { ErrorMessage } from '@hookform/error-message';

const InputField = ({
  type = 'text',
  label,
  value,
  register,
  errors,
  option,
  onChange = () => {},
  defaultValueT = ''
}) => {
  return (
    <>
      <label>{label}</label>
      <input
        type={type}
        {...register(value, {
          ...option
        })}
        autoComplete="off"
        onChange={onChange}
        defaultValue={defaultValueT}
      />
      <ErrorMessage
        errors={errors}
        name={value}
        render={({ messages }) => {
          return messages
            ? Object.entries(messages).map(([type, message]) => (
                <p className="add-school-error" key={type}>
                  {`⚠ ${message}`}
                </p>
              ))
            : null;
        }}
      />
    </>
  );
};

export default InputField;
