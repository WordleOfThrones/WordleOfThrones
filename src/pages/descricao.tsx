import { useRef, ChangeEvent } from "react";
import useGameLogic from "@/hooks/useGameLogic";
import styles from "@/styles/GameMode/Descricao.module.css";
import CharacterSuggestions from "@/components/GameFeatures/CharacterSuggestions";
import Header from "@/components/Header";
import VictoryModal from "@/components/GameFeatures/VictoryModal";

export default function Descricao() {
  // 1) Usa o hook com o 'mode' que você definiu para descrição (por exemplo, 2 ou 4)
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
  } = useGameLogic(2); // <-- Ajuste o número do modo conforme seu back-end

  const formRef = useRef<HTMLFormElement>(null);

  // 2) Quando o usuário digita no input
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCharacterName(event.target.value);
  }

  // 3) Quando clica numa sugestão
  function handleSuggestionClick(name: string) {
    setCharacterName(name);
    formRef.current?.requestSubmit(); // Submete o form automaticamente
  }

  // 4) Se quiser colorir as tentativas (verde/vermelho) com base no acerto
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
        <h2 className={styles.title}>QUE PERSONAGEM POSSUI ESSA DESCRIÇÃO?</h2>

        {/* Exibe a descrição do personagem */}
        {selectedCharacter && (
          <div className={styles.descriptionContainer}>
            <p className={styles.descriptionText}>
              {selectedCharacter.descricao || "Sem Descrição"}
            </p>
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

            {/* Sugestões de personagem */}
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
              {character.imagem ? (
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

      {/* Modal de vitória */}
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
