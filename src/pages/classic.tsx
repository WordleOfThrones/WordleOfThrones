import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import useFetchCharacter from '@/hooks/useFetchCharacter';
import styles from '@/styles/GameMode/Classic.module.css';
import CharacterSuggestions from "@/components/GameFeatures/CharacterSuggestions";
import Header from '@/components/Header';
import VictoryModal from '@/components/GameFeatures/VictoryModal';

export default function Classic() {
  const {
    characterName,
    setCharacterName,
    characterData,
    errorMessage,
    handleSubmit,
  } = useFetchCharacter();

  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [gameOver, setGameOver] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [nextGameTime, setNextGameTime] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);


  useEffect(() => {
    const fetchSelectedCharacter = async () => {
      try {
        const response = await fetch('https://thronesapi-1.onrender.com/api/character/sorted-character/1');
        if (!response.ok) {
          throw new Error('Falha ao buscar personagem sorteado');
        }
        const data = await response.json();
        setSelectedCharacter(data);

        // Define o tempo do próximo personagem baseado na API
        const now = new Date();
        const resetTime = new Date(now);
        resetTime.setHours(0, 0, 0, 0);
        resetTime.setDate(resetTime.getDate() + 1);

        const nextTime = resetTime.getTime();
        setNextGameTime(nextTime);
        localStorage.setItem("nextGameTime", nextTime.toString());
      } catch (error) {
        console.error('Erro ao buscar personagem sorteado:', error);
      }
    };

    fetchSelectedCharacter();
  }, []);

  // Atualiza a lista de personagens buscados
  useEffect(() => {
    if (characterData && characterData.imagem) {
      console.log("Personagem Buscado:", characterData);

      setCharacters((prevCharacters) => {
        if (!prevCharacters.some((char) => char.nome === characterData.nome)) {
          return [characterData, ...prevCharacters];
        }
        return prevCharacters;
      });
    }
  }, [characterData]);

  function handleSearch(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (characterName.trim() === "") {
      alert("Por favor, digite o nome de um personagem.");
      return;
    }

    if (characters.some((char) => char.nome.toLowerCase() === characterName.toLowerCase().trim())) {
      alert("Este personagem já foi buscado!");
      return;
    }

    setAttempts((prev) => prev + 1);

    handleSubmit(event);

    if (selectedCharacter) {
      if (characterName.toLowerCase().trim() === selectedCharacter.nome.toLowerCase().trim()) {
        console.log("🎉 Acertou! Atualizando gameOver para true");
        setGameOver(true);
      }
    }
    setCharacterName("");
  }
  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    setCharacterName(event.target.value);
  }

  const normalizeText = (text: string): string =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

  const getBoxStyle = (field: string, value: string) => {
    if (!selectedCharacter || !selectedCharacter[field]) return `${styles.box}`;
    const correctValue = normalizeText(selectedCharacter[field]);
    const inputValue = normalizeText(value);
    if (correctValue === inputValue) {
      return `${styles.box} ${styles.boxGreen}`;
    }
    const correctWords = new Set(correctValue.split(/[\s/,-]+/));
    const inputWords = new Set(inputValue.split(/[\s/,-]+/));
    const hasPartialMatch = Array.from(inputWords).some((word) => correctWords.has(word));
    if (hasPartialMatch) {
      return `${styles.box} ${styles.boxYellow}`;
    }
    return `${styles.box} ${styles.boxRed}`;
  };

  function setInputManually(name: string): void {
    setCharacterName(name);
  }

  useEffect(() => {
    if (formSubmitted && selectedCharacter && characterName.toLowerCase().trim() === selectedCharacter.nome.toLowerCase().trim()) {
      console.log(" Acertou! Atualizando gameOver para true");
      setGameOver(true);
      setCharacters((prevCharacters) => {
        const updatedList = prevCharacters.filter((char) => char.nome !== selectedCharacter.nome);
        return [selectedCharacter, ...updatedList];
      });
    }
  }, [formSubmitted, selectedCharacter, characterName]);
  return (

    <>
      <Header />
      <div className={styles.pageContainer}>
        <form onSubmit={handleSearch} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={characterName}
              onChange={handleInputChange}
              placeholder="Digite o nome do personagem"
              className={styles.inputField}
            />
            <CharacterSuggestions
              characterName={characterName}
              setCharacterName={setCharacterName}
              setInputManually={setInputManually}
            />
          </div>
          <button type="submit" className={styles.button}>Buscar</button>
        </form>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        {characters.length > 0 && (
          <div className={styles.container}>
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
    </>
  );

}
