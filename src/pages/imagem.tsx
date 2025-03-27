"use client";
import { useRef, useState, useEffect, ChangeEvent, FormEvent } from "react";
import useGameLogic from "@/hooks/useGameLogic";
import styles from "@/styles/GameMode/Imagem.module.css";
import CharacterSuggestions from "@/components/GameFeatures/CharacterSuggestions";
import Header from "@/components/Header";
import VictoryModal from "@/components/GameFeatures/VictoryModal";
import useScore from "@/hooks/useScore";

export default function Imagem() {
  const {
    characterName,
    setCharacterName,
    selectedCharacter,
    characters,
    gameOver,
    setGameOver,
    attempts,
    nextGameTime,
    errorMessage,
    handleSearch,
  } = useGameLogic(3);

  const { recordError, finalizeScore, getFinalScore, getTimePenalty, errors } = useScore();

  const [blur, setBlur] = useState(25);
  const [idUser, setIdUser] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [finalStats, setFinalStats] = useState<{
    score: number;
    attempts: number;
    time: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userId");
      setIdUser(stored ? Number(stored) : null);
    }
  }, []);

  function getIdDataJogo(base = "2023-03-25"): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const baseDate = new Date(base);
    baseDate.setHours(0, 0, 0, 0);
    const diffMs = today.getTime() - baseDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  }
  const idDataJogo = getIdDataJogo();

  function handleCloseModal(finalScore: number, attempts: number, timePenalty: number) {
    setFinalStats({
      score: finalScore,
      attempts,
      time: timePenalty,
    });
    setIsModalOpen(false);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (gameOver) return;
    setCharacterName(event.target.value);
  }

  function handleSuggestionClick(name: string) {
    if (gameOver) return;
    setCharacterName(name);
    formRef.current?.requestSubmit();
  }

  function onLocalHandleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (gameOver) return;
    if (!characterName.trim()) return;

    if (selectedCharacter) {
      const guess = characterName.trim().toLowerCase();
      const correct = selectedCharacter.nome.trim().toLowerCase();
      if (guess !== correct) {
        setBlur((prev) => Math.max(prev - 3, 0));
        recordError();
      } else {
        finalizeScore();
        setGameOver(true);
        setBlur(0); 
        setIsModalOpen(true);
      }
    }
    handleSearch(e);
    setCharacterName("");
  }

  function normalizeText(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }

  function getBoxStyle(value: string) {
    if (!selectedCharacter || !selectedCharacter.nome) return styles.box;
    const correctValue = normalizeText(selectedCharacter.nome);
    const inputValue = normalizeText(value);
    return correctValue === inputValue
      ? `${styles.box} ${styles.boxGreen}`
      : `${styles.box} ${styles.boxRed}`;
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.searchContainer}>
        <h2 className={styles.title}>Que personagem está nessa imagem?</h2>
        {selectedCharacter && (
          <div className={styles.imageContainer}>
            <img
              src={selectedCharacter.imagem}
              className={styles.characterImage}
              style={{ filter: `blur(${blur}px)` }}
              alt={selectedCharacter.nome || "Personagem"}
            />
          </div>
        )}
        <form ref={formRef} onSubmit={onLocalHandleSearch} className={styles.searchForm}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={characterName}
              onChange={handleInputChange}
              placeholder="Escreva o nome de um personagem..."
              className={styles.inputField}
              disabled={gameOver}
            />
            <button type="submit" className={styles.searchButton} disabled={gameOver}>
              <img src="/enter.svg" alt="Enviar" />
            </button>
            <CharacterSuggestions
              characterName={characterName}
              setCharacterName={setCharacterName}
              setInputManually={setCharacterName}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        </form>
        {!isModalOpen && gameOver && (
          <p className={styles.finishedMessage}>
            Você já jogou hoje. Volte amanhã para um novo desafio!
          </p>
        )}
      </div>

      {characters.length > 0 && (
        <div className={styles.tableContainer}>
          {characters.map((character, idx) => (
            <div key={idx} className={getBoxStyle(character.nome)}>
              {character.imagem ? (
                <img
                  src={character.imagem}
                  alt={character.nome || "Sem Imagem"}
                  className={styles.guessCharacterImage}
                />
              ) : (
                <div className={styles.placeholder}>Sem Imagem</div>
              )}
              <span className={styles.characterName}>
                {character?.nome ?? "Sem Nome"}
              </span>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && gameOver && selectedCharacter && (
        <VictoryModal
          character={selectedCharacter}
          attempts={attempts}
          nextGameTime={nextGameTime}
          onClose={handleCloseModal}
          mode={3}
          errors={errors}
          getFinalScore={getFinalScore}
          getTimePenalty={getTimePenalty}
          idUser={idUser}
          idDataJogo={idDataJogo}
        />
      )}

      {finalStats && (
        <div className={styles.gameSummary}>
          <h3>Resumo da Partida</h3>
          <p><strong>Pontuação:</strong> {finalStats.score}</p>
          <p><strong>Tentativas:</strong> {finalStats.attempts}</p>
          <p><strong>Tempo:</strong> {finalStats.time} seg</p>
        </div>
      )}
    </div>
  );
}
