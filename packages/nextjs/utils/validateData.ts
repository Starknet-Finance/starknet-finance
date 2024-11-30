export const handleNumberInput = (value: string) => {
  return value === "" || /^\d*\.?\d*$/.test(value);
};
