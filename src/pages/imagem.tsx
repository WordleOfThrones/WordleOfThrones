import { useRef, ChangeEvent } from "react";
import useGameLogic from "@/hooks/useGameLogic";
import styles from "@/styles/GameMode/Imagem.module.css";
import CharacterSuggestions from "@/components/GameFeatures/CharacterSuggestions";
import Header from "@/components/Header";
import VictoryModal from "@/components/GameFeatures/VictoryModal";

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
    blurLevel, 
  } = useGameLogic(3); 

  const formRef = useRef<HTMLFormElement>(null);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCharacterName(event.target.value);
  }

  function handleSuggestionClick(name: string) {
    setCharacterName(name);
    formRef.current?.requestSubmit();
  }

  const normalizeText = (text: string): string =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

  const getBoxStyle = (value: string) => {
    if (!selectedCharacter || !selectedCharacter.nome) return styles.box;

    const correctValue = normalizeText(selectedCharacter.nome);
    const inputValue = normalizeText(value);

    return correctValue === inputValue ? `${styles.box} ${styles.boxGreen}` : `${styles.box} ${styles.boxRed}`;
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.searchContainer}>
        <h2 className={styles.title}>QUE PERSONAGEM ESTÁ NESSA IMAGEM?</h2>

        {selectedCharacter && (
          <div className={styles.imageContainer}>
            <img
              src={selectedCharacter.imagem}
              className={styles.characterImage}
              style={{ filter: `blur(${blurLevel}px)` }}
              alt={selectedCharacter.nome || "Personagem"}
            />
          </div>
        )}

        <form ref={formRef} onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
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

      {characters.length > 0 && (
        <div className={styles.tableContainer}>
          {characters.map((character, idx) => (
            <div key={idx} className={getBoxStyle(character.nome)}>
              {character.imagem ? (
                <img src={character.imagem} alt={character.nome || "Sem Imagem"} className={styles.guessCharacterImage} />
              ) : (
                <div className={styles.placeholder}>Sem Imagem</div>
              )}
              <span style={{ marginLeft: "8px" }}>{character?.nome ?? "Sem Nome"}</span>
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
        />
      )}
    </div>
  );
}

