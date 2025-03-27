import { useRef, useState, ChangeEvent, FormEvent, useEffect } from "react";
import useGameLogic from "@/hooks/useGameLogic";
import styles from "@/styles/GameMode/Descricao.module.css";
import CharacterSuggestions from "@/components/GameFeatures/CharacterSuggestions";
import Header from "@/components/Header";
import VictoryModal from "@/components/GameFeatures/VictoryModal";
import useScore from "@/hooks/useScore";

export default function Descricao() {
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
  } = useGameLogic(2);

  const formRef = useRef<HTMLFormElement>(null);
  const { recordError, finalizeScore, getFinalScore, getTimePenalty, errors } = useScore();

  const [idUser, setIdUser] = useState<number | null>(null);

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

  const [finalStats, setFinalStats] = useState<{
    score: number;
    attempts: number;
    time: number;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCloseModal(finalScore: number, attempts: number, timePenalty: number) {
    setFinalStats({ score: finalScore, attempts, time: timePenalty });
    setIsModalOpen(false);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (gameOver) return;
    setCharacterName(event.target.value);
  }

  function handleSuggestionClick(name: string) {
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

  function getTipBoxClass(isRevealed: boolean) {
    return isRevealed || gameOver
      ? `${styles.tipBox} ${styles.tipRevealed}`
      : styles.tipBox;
  }

  function getGeneroTip() {
    if (!selectedCharacter) return "???";
    const genero = selectedCharacter.genero || "???";
    if (attempts >= 3 || gameOver) {
      return `Gênero: ${genero}`;
    } else {
      return `gênero em (${3 - attempts}) tentativas`;
    }
  }

  function getTituloTip() {
    if (!selectedCharacter) return "???";
    const titulo = selectedCharacter.titulo || "???";
    if (attempts >= 5 || gameOver) {
      return `Título: ${titulo}`;
    } else {
      return `título em (${5 - attempts}) tentativas`;
    }
  }

  function getBoxStyle(value: string) {
    if (!selectedCharacter || !selectedCharacter.nome) return styles.box;
    const correctName = selectedCharacter.nome.trim().toLowerCase();
    const inputName = value.trim().toLowerCase();
    return correctName === inputName
      ? `${styles.box} ${styles.boxGreen}`
      : `${styles.box} ${styles.boxRed}`;
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.searchContainer}>
        <h2 className={styles.title}>Que personagem possui essa descrição?</h2>
        {selectedCharacter && (
          <div className={styles.descriptionContainer}>
            <p className={styles.descriptionText}>
              {`“${selectedCharacter.descricao || "Sem Descrição"}”`}
            </p>
          </div>
        )}

        {selectedCharacter && (
          <div className={styles.tipsContainer}>
            <div className={getTipBoxClass(attempts >= 3)}>
              <div className={styles.tipIconContainer}>
                <img
                  src="/venus-mars-solid.svg"
                  alt="Ícone Gênero"
                  className={styles.tipIcon}
                />
              </div>
              <p className={styles.tipText}>{getGeneroTip()}</p>
            </div>
            <div className={getTipBoxClass(attempts >= 5)}>
              <div className={styles.tipIconContainer}>
                <img
                  src="/medal_icon-icons.com_69352.svg"
                  alt="Ícone Título"
                  className={styles.tipIcon}
                />
              </div>
              <p className={styles.tipText}>{getTituloTip()}</p>
            </div>
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
              {character?.imagem ? (
                <img
                  src={character.imagem}
                  alt={character.nome || "Sem Imagem"}
                  className={styles.guessCharacterImage}
                />
              ) : (
                <div className={styles.placeholder}>Sem Imagem</div>
              )}
              <span style={{ marginLeft: "8px" }}>
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
          mode={2}
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
