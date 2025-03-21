import { useState, useEffect, useRef } from "react";
import styles from "@/styles/GameFeatures/CharacterSuggestions.module.css";

interface CharacterSuggestionsProps {
  characterName: string;
  setCharacterName: (name: string) => void;
  setInputManually: (name: string) => void;
  onSuggestionClick?: (name: string) => void; 
}
export default function CharacterSuggestions({ characterName, setCharacterName, setInputManually }: CharacterSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isClicking = useRef(false);

  useEffect(() => {
    if (!characterName.trim() || isClicking.current) {
      setSuggestions([]);
      return;
    }

    const fetchCharacters = async () => {
      try {
        const response = await fetch("https://thronesapi-1.onrender.com/api/character-all/");
        if (!response.ok) throw new Error("Erro ao buscar personagens");

        const data = await response.json();
        const filteredSuggestions = data
          .filter((char: any) => char.nome.toLowerCase().startsWith(characterName.toLowerCase()))
          .map((char: any) => char.nome);

        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
        setSuggestions([]);
      }
    };

    fetchCharacters();
  }, [characterName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isClicking.current) {
        isClicking.current = false;
        return;
      }
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={styles.suggestionsContainer}>
      {suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={styles.suggestionItem}
              onMouseDown={(e) => {
                e.preventDefault(); 
                isClicking.current = true; 
                setInputManually(suggestion); 
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
