import { useState, useEffect } from "react";
import styles from "@/styles/CharacterSuggestions.module.css";

interface CharacterSuggestionsProps {
  characterName: string;
  setCharacterName: (name: string) => void;
}

export default function CharacterSuggestions({ characterName, setCharacterName }: CharacterSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (characterName.length > 2) {
        try {
          console.log("🔍 Buscando todos os personagens...");
          const response = await fetch("https://thronesapi-1.onrender.com/api/character-all/");
          if (!response.ok) throw new Error("Erro ao buscar personagens");

          const data = await response.json();
          console.log("Lista de personagens recebida:", data);

          const filteredSuggestions = data
            .filter((char: any) => char.nome.toLowerCase().startsWith(characterName.toLowerCase()))
            .map((char: any) => char.nome);

          setSuggestions(filteredSuggestions);
        } catch (error) {
          console.error("Erro ao buscar sugestões:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchCharacters();
  }, [characterName]);

  return (
    <div className={styles.suggestionsContainer}> 
      {suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={styles.suggestionItem}
              onClick={() => {
                setCharacterName(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
