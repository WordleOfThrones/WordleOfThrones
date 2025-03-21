import { useRef, ChangeEvent, FormEvent } from "react";
import useGameLogic from "@/hooks/useGameLogic";
import styles from "@/styles/GameMode/Classic.module.css";
import CharacterSuggestions from "@/components/GameFeatures/CharacterSuggestions";
import Header from "@/components/Header";
import VictoryModal from "@/components/GameFeatures/VictoryModal";

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
    handleSearch
  } = useGameLogic(1);

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

  return (
<div className={styles.pageContainer}>
  <div className={styles.searchContainer}>
    <Header />
    <div className={styles.searchBox}>
      <h2 className={styles.title}>ADIVINHE DIARIAMENTE UM PERSONAGEM</h2>
      <form onSubmit={handleSearch} className={styles.searchForm}>
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
                        alt={character.nome || 'Personagem'}
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
                {characters.map((character, index) => (
                  <div key={index} className={getBoxStyle('genero', character.genero)}>
                    {character.genero}
                  </div>
                ))}
              </div>

              <div className={styles.column}>
                <div className={styles.columnLabel}>Série</div>
                {characters.map((character, index) => (
                  <div key={index} className={getBoxStyle('serie', character.serie)}>
                    {character.serie}
                  </div>
                ))}
              </div>

              <div className={styles.column}>
                <div className={styles.columnLabel}>Casa</div>
                {characters.map((character, index) => (
                  <div key={index} className={getBoxStyle('casa', character.casa)}>
                    {character.casa}
                  </div>
                ))}
              </div>

              <div className={styles.column}>
                <div className={styles.columnLabel}>Raça</div>
                {characters.map((character, index) => (
                  <div key={index} className={getBoxStyle('raca', character.raca)}>
                    {character.raca}
                  </div>
                ))}
              </div>

              <div className={styles.column}>
                <div className={styles.columnLabel}>Origem</div>
                {characters.map((character, index) => (
                  <div key={index} className={getBoxStyle('origem', character.origem)}>
                    {character.origem}
                  </div>
                ))}
              </div>

              <div className={styles.column}>
                <div className={styles.columnLabel}>Religião</div>
                {characters.map((character, index) => (
                  <div key={index} className={getBoxStyle('religiao', character.religiao)}>
                    {character.religiao}
                  </div>
                ))}
              </div>

              <div className={styles.column}>
                <div className={styles.columnLabel}>Primeira Aparição</div>
                {characters.map((character, index) => (
                  <div key={index} className={getBoxStyle('primeiraAparicao', character.primeiraAparicao)}>
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
        onClose={() => setGameOver(false)}
      />
    )}
  </div>
</div>

  );

}
