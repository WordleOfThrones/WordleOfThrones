import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import axios from 'axios';
import { CharacterFormProps, UploadHookReturn } from '../interfaces/CharacterFormProps';

export function useUpload(): UploadHookReturn {
  const [progress, setProgress] = useState(0);

  const handleUpload = (file: File | null, characterData: CharacterFormProps) => {
    if (!file) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    if (!characterData.name || !characterData.description || !characterData.house ||
      !characterData.gender || !characterData.race || !characterData.title ||
      !characterData.origin || !characterData.religion || !characterData.series ||
      !characterData.firstAppearance) {
      alert('Todos os campos são obrigatórios!');
      return;
    }

    const storageRef = ref(storage, `image/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        console.error('Erro durante o upload da imagem:', error);
        alert('Erro durante o upload da imagem.');
      },
      async () => {
        try {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

          console.log('Imagem carregada com sucesso:', imageUrl);

          console.log('Dados sendo enviados para a API:', { ...characterData, imageUrl });

          await axios.post('https://thronesapi-1.onrender.com/api/character', {
            ...characterData,
            imageUrl, 
          });

          alert('Personagem cadastrado com sucesso!');
        } catch (error) {
          console.error('Erro ao cadastrar personagem:', error);
          alert('Erro ao cadastrar personagem.');
        }
      }
    );
  };

  return { progress, handleUpload };
}
