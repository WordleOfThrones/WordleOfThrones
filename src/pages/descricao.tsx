import { useRef, ChangeEvent } from "react";
import useGameLogic from "@/hooks/useGameLogic";
import styles from "@/styles/GameMode/Descricao.module.css";
import CharacterSuggestions from "@/components/GameFeatures/CharacterSuggestions";
import Header from "@/components/Header";
import VictoryModal from "@/components/GameFeatures/VictoryModal";

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

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCharacterName(event.target.value);
  }

  function handleSuggestionClick(name: string) {
    setCharacterName(name);
    formRef.current?.requestSubmit();
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
      return `dica: ${genero}`;
    } else {
      return `gênero em (${3 - attempts}) tentativas`;
    }
  }

  function getTituloTip() {
    if (!selectedCharacter) return "???";
    const titulo = selectedCharacter.titulo || "???";
    if (attempts >= 5 || gameOver) {
      return `dica: ${titulo}`;
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
      {`“ ${selectedCharacter.descricao || 'Sem Descrição'} ”`}
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


        {/* Formulário de busca */}
        <form ref={formRef} onSubmit={handleSearch} className={styles.searchForm}>
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
              setInputManually={setCharacterName}
              onSuggestionClick={handleSuggestionClick}
            />

          </div>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        </form>
      </div>

      {/* Lista de tentativas (cards) */}
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

{gameOver && selectedCharacter && (
  <VictoryModal
    character={selectedCharacter}
    attempts={attempts}
    nextGameTime={nextGameTime}
    onClose={() => setGameOver(false)}
    mode={2}
  />
)}
    </div>
  );
}
