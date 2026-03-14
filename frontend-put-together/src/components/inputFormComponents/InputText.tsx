import type { InputTextProps } from "./typeInputText";

export const InputText = ({ value, onSetInput, disabled }: InputTextProps) => {
  return (
    <>
      <input
        type="text"
        className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-lila-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
        placeholder="z.B. A2 – Perfekt mit sein"
        value={value}
        onChange={(e) => onSetInput(e.target.value)}
        disabled={disabled}
      />
    </>
  );
};
