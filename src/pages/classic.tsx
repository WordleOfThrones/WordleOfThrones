"use client";
import { useRef, useState, ChangeEvent, FormEvent } from "react";
import useGameLogic from "@/hooks/useGameLogic";
import styles from "@/styles/GameMode/Classic.module.css";
import CharacterSuggestions from "@/components/GameFeatures/CharacterSuggestions";
import Header from "@/components/Header";
import VictoryModal from "@/components/GameFeatures/VictoryModal";
import useScore from "@/hooks/useScore";

export default function Classic() {
  // Lógica de jogo para o modo Clássico (mode = 1)
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

  const formRef = useRef<HTMLFormElement>(null);


  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCharacterName(event.target.value);
  }


  function handleSuggestionClick(name: string) {
    setCharacterName(name);
    formRef.current?.requestSubmit();
  }

  function onLocalHandleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!characterName.trim()) return;

    if (selectedCharacter) {
      const guess = characterName.trim().toLowerCase();
      const correct = selectedCharacter.nome.trim().toLowerCase();
      if (guess !== correct) {
        recordError();
      } else {
        finalizeScore();
        setGameOver(true);
      }
    }
    handleSearch(e);
    setCharacterName("");
  }

  const normalizeText = (text: string): string =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
  const getBoxStyle = (field: string, value: string) => {
    if (!selectedCharacter || !selectedCharacter[field]) return styles.box;

    const correctValue = normalizeText(selectedCharacter[field]);
    const inputValue = normalizeText(value);

    if (correctValue === inputValue) return `${styles.box} ${styles.boxGreen}`;

    const correctParts = new Set(correctValue.split("/").map((p) => p.trim()).filter(Boolean));
    const inputParts = new Set(inputValue.split("/").map((p) => p.trim()).filter(Boolean));

    for (const part of inputParts) {
      if (correctParts.has(part)) return `${styles.box} ${styles.boxYellow}`;
    }
    return `${styles.box} ${styles.boxRed}`;
  };

  function setInputManually(name: string) {
    setCharacterName(name);
  }
  const idUser = Number(localStorage.getItem("userId")) || 1;
  const currentDate = new Date().toISOString().split("T")[0];
  const baseDate = new Date("2023-03-25");
  const current = new Date(currentDate);
  const diffDays = Math.floor((current.getTime() - baseDate.getTime()) / (1000 * 3600 * 24));
  const idDataJogo = diffDays + 1;

  function handleCloseModal(finalScore: number, attempts: number, timePenalty: number) {
    setGameOver(false);
    setFinalStats({ score: finalScore, attempts, time: timePenalty });
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
              />
              <button type="submit" className={styles.searchButton}>
                <img src="/enter.svg" alt="Enviar" />
              </button>
              <CharacterSuggestions
                characterName={characterName}
                setCharacterName={setCharacterName}
                setInputManually={setInputManually}
              />
            </div>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          </form>
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
                    <img
                      src={character.imagem}
                      alt={character.nome || "Personagem"}
                      className={styles.characterImage}
                    />
                  ) : (
                    <div className={styles.placeholder}>Sem Imagem</div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.column}>
              <div className={styles.columnLabel}>Gênero</div>
              {characters.map((character, index) => {
                const isNew = index === 0;
                return (
                  <div
                    key={character.id}
                    className={`${styles.box} ${isNew ? styles.boxNew : ""} ${getBoxStyle("genero", character.genero)}`}
                  >
                    {character
                      .genero
                      .split("/")
                      .map((g: string, i: number) => (
                        <div key={i}>{g}</div>
                      ))}
                  </div>
                );
              })}

            </div>

            <div className={styles.column}>
              <div className={styles.columnLabel}>Série</div>
              {characters.map((character, index) => (
                <div key={index} className={getBoxStyle("serie", character.serie)}>
                  {character.serie}
                </div>
              ))}
            </div>

            <div className={styles.column}>
              <div className={styles.columnLabel}>Casa</div>
              {characters.map((character, index) => (
                <div key={index} className={getBoxStyle("casa", character.casa)}>
                  {character.casa}
                </div>
              ))}
            </div>

            <div className={styles.column}>
              <div className={styles.columnLabel}>Raça</div>
              {characters.map((character, index) => (
                <div key={index} className={getBoxStyle("raca", character.raca)}>
                  {character.raca}
                </div>
              ))}
            </div>

            <div className={styles.column}>
              <div className={styles.columnLabel}>Origem</div>
              {characters.map((character, index) => (
                <div key={index} className={getBoxStyle("origem", character.origem)}>
                  {character.origem}
                </div>
              ))}
            </div>

            <div className={styles.column}>
              <div className={styles.columnLabel}>Religião</div>
              {characters.map((character, index) => (
                <div key={index} className={getBoxStyle("religiao", character.religiao)}>
                  {character.religiao}
                </div>
              ))}
            </div>

            <div className={styles.column}>
              <div className={styles.columnLabel}>Primeira Aparição</div>
              {characters.map((character, index) => (
                <div key={index} className={getBoxStyle("primeiraAparicao", character.primeiraAparicao)}>
                  {character.primeiraAparicao}
                </div>
              ))}
            </div>
          </div>
        )}

        {gameOver && selectedCharacter && (
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
          <p>
            <strong>Pontuação:</strong> {finalStats.score}
          </p>
          <p>
            <strong>Tentativas:</strong> {finalStats.attempts}
          </p>
          <p>
            <strong>Tempo:</strong> {finalStats.time} seg
          </p>
        </div>
      )}
    </div>
  );
}
