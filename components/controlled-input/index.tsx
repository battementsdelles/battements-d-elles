'use client';
import { CustomError } from '@/lib/helpers/custom-error';
import classNames from 'classnames';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

interface ControlledInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  name: string;
  control: Control<any>;
  customError?: CustomError;
  embeddedLabel?: boolean;
  secureText?: boolean;
}

const ControlledInput: React.FC<ControlledInputProps> = ({
  control,
  name,
  label,
  customError,
  embeddedLabel = false,
  secureText = false,
  ...inputProps
}) => {
  const [showText, setShowText] = React.useState(!secureText);
  const inputClassNames = classNames({
    input: true,
    'input-error mb-0': !!customError,
  });

  const labelClassNames = classNames({
    label: embeddedLabel,
    'block text-sm font-medium mb-1': !embeddedLabel,
    'text-error': !!customError,
  });

  const SvgEye = ({ open = true }) => (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => setShowText(!showText)}
    >
      <g id="SVGRepo_iconCarrier">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={
            open
              ? 'M1.5 12c0-2.25 3.75-7.5 10.5-7.5S22.5 9.75 22.5 12s-3.75 7.5-10.5 7.5S1.5 14.25 1.5 12zM12 16.75a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5zM14.7 12a2.7 2.7 0 1 1-5.4 0 2.7 2.7 0 0 1 5.4 0z'
              : 'M20.707 20.707a1 1 0 0 0 0-1.414l-16-16a1 1 0 0 0-1.414 1.414L5.205 6.62C2.785 8.338 1.5 10.683 1.5 12c0 2.25 3.75 7.5 10.5 7.5 1.916 0 3.59-.423 5.006-1.08l2.287 2.287a1 1 0 0 0 1.414 0zm-6.13-4.716-1.51-1.51a2.7 2.7 0 0 1-3.548-3.548l-1.51-1.51a4.75 4.75 0 0 0 6.568 6.568zM22.5 12c0 1.005-.749 2.61-2.18 4.078l-3.594-3.595a4.75 4.75 0 0 0-5.209-5.209L9.088 4.846C9.985 4.626 10.957 4.5 12 4.5c6.75 0 10.5 5.25 10.5 7.5z'
          }
          fill="#000000"
        ></path>
      </g>
    </svg>
  );

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            {!embeddedLabel && (
              <label className={labelClassNames}>{label}</label>
            )}
            <label className={inputClassNames}>
              {embeddedLabel && (
                <span className={labelClassNames}>{label}</span>
              )}
              <input
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                {...inputProps}
                type={showText ? 'text' : 'password'}
              />
              {secureText && <SvgEye open={!showText} />}
            </label>
            {customError && (
              <div className="text-xs text-error mt-1 ml-2">
                {customError.details}
              </div>
            )}
          </>
        )}
      />
    </>
  );
};

export default ControlledInput;
