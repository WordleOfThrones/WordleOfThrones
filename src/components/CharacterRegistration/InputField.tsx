export default function InputField({ label, value, onChange, required = false }: InputFieldProps) {
  return (
    <div>
      <label>{label}</label>
      <input type="text" value={value} onChange={onChange} required={required} />
    </div>
  );
};