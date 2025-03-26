
import { useState, useEffect, FormEvent } from "react";
import useFetchCharacter from "@/hooks/useFetchCharacter";

export default function useGameLogic(mode: number) {
  const { characterName, setCharacterName, characterData, errorMessage, handleSubmit } = useFetchCharacter();
  
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [gameOver, setGameOver] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [nextGameTime, setNextGameTime] = useState<number | null>(null);

  useEffect(() => {
    const fetchSelectedCharacter = async () => {
      try {
        console.log("Buscando personagem sorteado...");
        const response = await fetch(`https://thronesapi-1.onrender.com/api/character/sorted-character/${mode}`);
        console.log(">>> Status da resposta:", response.status);

        if (!response.ok) {
          throw new Error("Falha ao buscar personagem sorteado");
        }
        const data = await response.json();
        setSelectedCharacter(data);
        const now = new Date();
        const resetTime = new Date(now);
        resetTime.setHours(0, 0, 0, 0);
        resetTime.setDate(resetTime.getDate() + 1);
        const nextTime = resetTime.getTime();
        setNextGameTime(nextTime);
        localStorage.setItem("nextGameTime", nextTime.toString());
      } catch (error) {
        console.error(error);
      }
    };

    fetchSelectedCharacter();
  }, [mode]);

  useEffect(() => {
    if (characterData) {
      console.log("Personagem Buscado:", characterData);

      setCharacters((prevCharacters) => {
        if (!prevCharacters.some((char) => char.nome === characterData.nome)) {
          return [characterData, ...prevCharacters];
        }
        return prevCharacters;
      });
    }
  }, [characterData]);

  const handleSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (characterName.trim() === "") {
      alert("Por favor, digite o nome de um personagem.");
      return;
    }

    if (characters.some((char) => char.nome.toLowerCase() === characterName.toLowerCase().trim())) {
      alert("Este personagem já foi buscado!");
      return;
    }

    setAttempts((prev) => prev + 1);
    handleSubmit(event);

    if (selectedCharacter) {
      if (characterName.toLowerCase().trim() === selectedCharacter.nome.toLowerCase().trim()) {
        console.log("🎉 Acertou! Atualizando gameOver para true");
        setGameOver(true);
      }
    }
    setCharacterName("");
  };

  return {
    characterName,
    setCharacterName,
    characters,
    selectedCharacter,
    gameOver,
    setGameOver,
    attempts,
    nextGameTime,
    errorMessage,
    handleSearch,
    blurLevel: 30,
  };
}
