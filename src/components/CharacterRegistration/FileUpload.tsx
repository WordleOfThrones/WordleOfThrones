export default function FileUpload({ onFileChange }: FileUploadProps) {
  return (
    <div>
      <label>Upload de Imagem</label>
      <input type="file" onChange={onFileChange} />
    </div>
  );
};