import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';

const InputPhone = ({ control, errors }) => {
  return (
    <>
      <Controller
        name="phoneNumber"
        control={control}
        rules={{
          required: 'This input is required.'
        }}
        render={({ field }) => <PhoneInput specialLabel={''} country={'us'} {...field} />}
      />
      <ErrorMessage
        errors={errors}
        name="phoneNumber"
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

export default InputPhone;
