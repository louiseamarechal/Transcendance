import { MouseEventHandler } from 'react';
import '../../style/components/cancel-prompt.css';

type PromptProps = {
  message: string;
  onContinue: MouseEventHandler<HTMLButtonElement>;
  onCancel: MouseEventHandler<HTMLButtonElement>;
};

export default function CancelPrompt({
  message,
  onContinue,
  onCancel,
}: PromptProps) {
  return (
    <div className="prompt">
      <p>{message}</p>
      <div className="prompt-buttons">
        <button id="continue-button" onClick={onContinue}>
          Continue
        </button>
        <button id="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
