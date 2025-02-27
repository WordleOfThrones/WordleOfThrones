import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import useFetchCharacter from '@/hooks/useFetchCharacter';
import styles from '@/styles/Classic.module.css';
import CharacterSuggestions from "@/components/CharacterSuggestions";
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
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
  const [countdown, setCountdown] = useState<string>("00:00:00");


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
        resetTime.setHours(0, 0, 0, 0); // Reseta para meia-noite do dia atual
        resetTime.setDate(resetTime.getDate() + 1); // Adiciona um dia para garantir a troca do personagem

        const nextTime = resetTime.getTime(); // Obtém timestamp da meia-noite do próximo dia
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
      console.log("🔍 Personagem Buscado:", characterData);
      setCharacters((prevCharacters) => [characterData, ...prevCharacters]);
    }
  }, [characterData]);

  // Atualiza o temporizador em tempo real
  useEffect(() => {
    if (!nextGameTime) return;

    const updateCountdown = () => {
      const now = Date.now();
      const remainingTime = nextGameTime - now;

      if (remainingTime <= 0) {
        setCountdown("00:00:00");
        localStorage.removeItem("nextGameTime");
        setNextGameTime(null);
        return;
      }

      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      setCountdown(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextGameTime]);

  // Modal de Vitória
  const VictoryModal = ({ character, attempts, onClose }: { character: any; attempts: number; onClose: () => void }) => {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2> PARABÉNS, VOCÊ ACERTOU!!</h2>
          <p><strong>número de tentativas:</strong> {attempts}</p>

          <img src={character.imagem} alt={character.nome} className={styles.characterImage} />
          <blockquote>"{character.serie || 'PRECISO DA ROTA DE DESCRICAAAO'}"</blockquote>
          <p><strong>{character.nome}</strong></p>

          <p className={styles.disabledText}>Ver estatísticas</p>

       
          <p>Próximo jogo em: <span className={styles.countdown}>{countdown}</span></p>

          <hr />

          <p><strong>Outros modos:</strong></p>
          <div className={styles.iconContainer}>
            <Link href="/imagem">
              <Image src="/images/perg.png" alt="Modo Imagem" width={50} height={50} className={styles.icon} />
            </Link>

            <Link href="/descricao">
              <Image src="/images/eye.png" alt="Modo Descrição" width={50} height={50} className={styles.icon} />
            </Link>
          </div>

          <button onClick={onClose} className={styles.closeButton}>Fechar</button>
        </div>
      </div>
    );
  };

  function handleSearch(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (characterName.trim() === "") {
      alert("Por favor, digite o nome de um personagem.");
      return;
    }
    handleSubmit(event);
    setAttempts(attempts + 1);

    // Verifica se o nome digitado é igual ao personagem sorteado
    if (selectedCharacter && characterName.toLowerCase().trim() === selectedCharacter.nome.toLowerCase().trim()) {
      setGameOver(true);
    }
    setCharacterName("");
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    setCharacterName(event.target.value);
  }

  const getBoxStyle = (field: string, value: string) => {
    if (!selectedCharacter || !selectedCharacter[field]) return `${styles.box}`;

    return selectedCharacter[field].toLowerCase() === value.toLowerCase()
      ? `${styles.box} ${styles.boxGreen}`
      : `${styles.box} ${styles.boxRed}`;
  };
  function setInputManually(name: string): void {
    setCharacterName(name);
  }

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
            onClose={() => setGameOver(false)}
          />
        )}
      </div>
    </>
  );

}
