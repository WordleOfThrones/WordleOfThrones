export default function TextareaField({ label, value, onChange, required = false }: TextareaFieldProps) {
  return (
    <div>
      <label>{label}</label>
      <textarea value={value} onChange={onChange} required={required} />
    </div>
  );
};