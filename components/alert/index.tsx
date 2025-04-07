import { AlertType } from '@/lib/helpers/enums';
import classNames from 'classnames';
import React from 'react';

interface IAletProps {
  display: boolean;
  text?: string;
  type?: AlertType;
  onClose: () => void;
}

const Alert: React.FC<IAletProps> = ({
  display,
  text = '',
  type = AlertType.INFO,
  onClose,
}) => {
  const divClassNames = classNames({
    'alert alert-error alert-soft': type === AlertType.ERROR,
    'alert alert-info alert-soft': type === AlertType.INFO,
    'alert alert-success alert-soft': type === AlertType.SUCCESS,
    'alert alert-warning alert-soft': type === AlertType.WARNING,
  });

  const hoverColorMap: Record<AlertType, string> = {
    [AlertType.ERROR]: 'hover:bg-red-600/20', //dark:hover:bg-gray-700
    [AlertType.INFO]: 'hover:bg-sky-600/20',
    [AlertType.SUCCESS]: 'hover:bg-green-600/20',
    [AlertType.WARNING]: 'hover:bg-yellow-600/20',
  };

  const buttonClass = classNames(
    'btn btn-ghost btn-xs border-none transition-colors text-inherit',
    hoverColorMap[type],
  );

  return (
    display && (
      <div role="alert" className={divClassNames} onClick={() => onClose()}>
        {type === AlertType.INFO && (
          <svg
            className="shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
        )}
        {type === AlertType.SUCCESS && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}

        {type === AlertType.WARNING && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )}

        {type === AlertType.ERROR && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <span>{text}</span>
        <div>
          <button onClick={() => onClose()} className={buttonClass}>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  );
};

export default Alert;
