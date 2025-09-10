type InputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  };
  
  const Input = ({ value, onChange, placeholder }: InputProps) => (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="form-control"
    />
  );
  
  export default Input;
  