"use client";
import { useRef, useState, useEffect, ChangeEvent, FormEvent } from "react";
import useGameLogic from "@/hooks/useGameLogic";
import styles from "@/styles/GameMode/Classic.module.css";
import CharacterSuggestions from "@/components/GameFeatures/CharacterSuggestions";
import Header from "@/components/Header";
import VictoryModal from "@/components/GameFeatures/VictoryModal";
import useScore from "@/hooks/useScore";
import Image from "next/image";

export default function Classic() {
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
  } = useGameLogic(1);

  const { recordError, finalizeScore, getFinalScore, getTimePenalty, errors } = useScore();

  const [finalStats, setFinalStats] = useState<{
    score: number;
    attempts: number;
    time: number;
  } | null>(null);

  const [idUser, setIdUser] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userId");
      setIdUser(stored ? Number(stored) : null);
    }
  }, []);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (gameOver) return;
    setCharacterName(event.target.value);
  }

  function handleSuggestionClick(name: string) {
    setCharacterName(name);
    formRef.current?.requestSubmit();
  }

  function getIdDataJogo(base = "2023-03-25"): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const baseDate = new Date(base);
    baseDate.setHours(0, 0, 0, 0);
    const diffMs = today.getTime() - baseDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  }

  const idDataJogo = getIdDataJogo();

  function onLocalHandleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (gameOver || !characterName.trim()) return;

    if (selectedCharacter) {
      const guess = characterName.trim().toLowerCase();
      const correct = selectedCharacter.nome.trim().toLowerCase();
      if (guess !== correct) {
        recordError();
      } else {
        finalizeScore();
        setGameOver(true);
        setIsModalOpen(true);
      }
    }

    handleSearch(e);
    setCharacterName("");
  }

  function handleCloseModal(finalScore: number, attempts: number, timePenalty: number) {
    setFinalStats({ score: finalScore, attempts, time: timePenalty });
    setIsModalOpen(false);
  }

  const normalizeText = (text: string): string =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

  const getBoxStyle = (field: string, value: string) => {
    if (!selectedCharacter || !selectedCharacter[field]) return styles.box;

    const correctValue = normalizeText(selectedCharacter[field]);
    const inputValue = normalizeText(value);

    if (correctValue === inputValue) return `${styles.box} ${styles.boxGreen}`;

    const correctParts = new Set(correctValue.split("/").map(p => p.trim()));
    const inputParts = new Set(inputValue.split("/").map(p => p.trim()));

    for (const part of inputParts) {
      if (correctParts.has(part)) return `${styles.box} ${styles.boxYellow}`;
    }

    return `${styles.box} ${styles.boxRed}`;
  };

  function setInputManually(name: string): void {
    if (gameOver) return;
    setCharacterName(name);
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.searchContainer}>
        <Header />
        <div className={styles.searchBox}>
          <h2 className={styles.title}>Adivinhe um personagem diariamente</h2>
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
                <Image src="/enter.svg" alt="Enviar" width={24} height={24} />
              </button>
              <CharacterSuggestions
                characterName={characterName}
                setCharacterName={setCharacterName}
                setInputManually={setInputManually}
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
      </div>

      <div className={styles.tableContainer}>
        {characters.length > 0 && (
          <div className={styles.gridContainer}>
            <div className={styles.column}>
              <div className={styles.columnLabel}>Personagem</div>
              {characters.map((character, index) => (
                <div key={index} className={styles.box}>
                  {character.imagem ? (
                    <Image
                      src={character.imagem}
                      alt={character.nome || "Personagem"}
                      width={50}
                      height={50}
                      className={styles.characterImage}
                      unoptimized // use isso se for imagem externa
                    />
                  ) : (
                    <div className={styles.placeholder}>Sem Imagem</div>
                  )}
                </div>
              ))}
            </div>

            {/* Outras colunas */}
            {[
              { label: "Gênero", field: "genero" },
              { label: "Série", field: "serie" },
              { label: "Casa", field: "casa" },
              { label: "Raça", field: "raca" },
              { label: "Origem", field: "origem" },
              { label: "Religião", field: "religiao" },
              { label: "Primeira Aparição", field: "primeiraAparicao" },
            ].map(({ label, field }) => (
              <div key={field} className={styles.column}>
                <div className={styles.columnLabel}>{label}</div>
                {characters.map((character, index) => (
                  <div key={index} className={getBoxStyle(field, character[field])}>
                    {character[field]}
                  </div>
                ))}
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
            mode={1}
            errors={errors}
            getFinalScore={getFinalScore}
            getTimePenalty={getTimePenalty}
            idUser={idUser}
            idDataJogo={idDataJogo}
          />
        )}
      </div>

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
