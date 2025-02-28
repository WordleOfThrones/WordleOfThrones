import { useState, useEffect } from 'react';
import styles from '@/styles/VictoryModal.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface VictoryModalProps {
  character: any;
  attempts: number;
  nextGameTime: number | null;
  onClose: () => void;  
}

export default function VictoryModal({ character, attempts, nextGameTime, onClose }: VictoryModalProps) {
  const [countdown, setCountdown] = useState<string>("00:00:00");

  useEffect(() => {
    if (!nextGameTime) return;

    const updateCountdown = () => {
      const now = Date.now();
      const remainingTime = nextGameTime - now;

      if (remainingTime <= 0) {
        setCountdown("00:00:00");
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

 
  const characterImage = character?.imagem || "/image/botao.png";
  const characterDescription = character?.serie || "Descrição não disponível";

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2> PARABÉNS, VOCÊ ACERTOU!!</h2>
        <p><strong>Número de tentativas:</strong> {attempts}</p>

        <img src={characterImage} alt={character.nome} className={styles.characterImage} />
        <blockquote>"{characterDescription}"</blockquote>
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
}
