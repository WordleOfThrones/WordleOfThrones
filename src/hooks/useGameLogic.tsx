import { useState, useEffect, FormEvent } from "react";
import useFetchCharacter from "@/hooks/useFetchCharacter";

export default function useGameLogic(mode: number) {
  const { characterName, setCharacterName, characterData, errorMessage, handleSubmit } = useFetchCharacter();

  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [gameOver, setGameOver] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [nextGameTime, setNextGameTime] = useState<number | null>(null);
  const [idUser, setIdUser] = useState<number | null>(null); 

  function getIdDataJogo(base = "2023-03-25"): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const baseDate = new Date(base);
    baseDate.setHours(0, 0, 0, 0);
    const diffMs = today.getTime() - baseDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  }

  const idDataJogo = getIdDataJogo();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const playedKey = `played-mode-${mode}-${idDataJogo}`;
      const alreadyPlayed = localStorage.getItem(playedKey);
      if (alreadyPlayed === "true") {
        setGameOver(true);
      }
      const storedId = localStorage.getItem("userId");
      setIdUser(storedId ? Number(storedId) : null);
    }
  }, [mode, idDataJogo]);

  useEffect(() => {
    const fetchSelectedCharacter = async () => {
      try {
        const response = await fetch(`https://thronesapi-1.onrender.com/api/character/sorted-character/${mode}`);
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
        setGameOver(true);
        const playedKey = `played-mode-${mode}-${idDataJogo}`;
        localStorage.setItem(playedKey, "true");
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
    idUser, 
    idDataJogo,
    blurLevel: 30,
  };
}
