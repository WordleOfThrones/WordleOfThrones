import { useState } from 'react';
import { CharacterData } from '../interfaces/CharacterDataProps';

export default function useFetchCharacter() {
  const [characterName, setCharacterName] = useState<string>('');
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage(null);

    try {
      const response = await fetch(`https://thronesapi-1.onrender.com/api/character?name=${characterName}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar o personagem');
      }

      const data: CharacterData = await response.json();

      if (data && Object.keys(data).length > 0) {
        setCharacterData(data);
      } else {
        setCharacterData(null);
        setErrorMessage('Personagem não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
      setErrorMessage('Ocorreu um erro ao buscar o personagem.');
      setCharacterData(null);
    }
  };

  return {
    characterName,
    setCharacterName,
    characterData,
    errorMessage,
    handleSubmit,
  };
}
