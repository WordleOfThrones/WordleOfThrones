import { useState, useEffect } from 'react';
import styles from "@/styles/GameFeatures/VictoryModal.module.css";
import Image from 'next/image';
import Link from 'next/link';

interface VictoryModalProps {
  character: any;
  attempts: number;
  nextGameTime: number | null;
  onClose: () => void;
  mode: number;
}

export default function VictoryModal({ character, attempts, nextGameTime, onClose, mode }: VictoryModalProps) {
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

      setCountdown(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextGameTime]);

  const characterImage = character?.imagem || "/image/botao.png";
  const characterDescription = character?.titulo || "Descrição não disponível";

  let links;
  switch (mode) {
    case 1:
      // Modo Clássico
      links = (
        <>
          <Link href="/descricao">
            <Image
              src="/images/eye.png"
              alt="Modo Descrição"
              width={50}
              height={50}
              className={styles.icon}
            />
          </Link>
          <Link href="/imagem">
            <Image
              src="/images/perg.png"
              alt="Modo Imagem"
              width={50}
              height={50}
              className={styles.icon}
            />
          </Link>
        </>
      );
      break;
    case 2:
      // Modo Descrição
      links = (
        <>
          <Link href="/classic">
            <Image
              src="/images/targeryan.png"
              alt="Modo Clássico"
              width={50}
              height={50}
              className={styles.icon}
            />
          </Link>
          <Link href="/imagem">
            <Image
              src="/images/perg.png"
              alt="Modo Imagem"
              width={50}
              height={50}
              className={styles.icon}
            />
          </Link>
        </>
      );
      break;
    case 3:
      // Modo Imagem
      links = (
        <>
          <Link href="/classic">
            <Image
              src="/images/targeryan.png"
              alt="Modo Clássico"
              width={50}
              height={50}
              className={styles.icon}
            />
          </Link>
          <Link href="/descricao">
            <Image
              src="/images/eye.png"
              alt="Modo Descrição"
              width={50}
              height={50}
              className={styles.icon}
            />
          </Link>
        </>
      );
      break;
    default:
      links = null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Parabéns, você acertou!!</h2>
        <p className={styles.titleTry}><strong>Número de tentativas:</strong> {attempts}</p>
        <div className={styles.characterRow}>
          <img
            src={characterImage}
            alt={character.nome}
            className={styles.characterImage}
          />
          <div className={styles.characterInfo}>
            <p className={styles.characterTitle}>"{characterDescription}"</p>
            <p className={styles.characterName}>{character.nome}</p>
          </div>
        </div>
        <p className={styles.disabledText}>Ver estatísticas</p>
        <p>Próximo jogo em: <span className={styles.countdown}>{countdown}</span></p>
        <hr />
        <p><strong>Outros modos:</strong></p>
        <div className={styles.iconContainer}>
          {links}
        </div>
        <button onClick={onClose} className={styles.closeButton}>Fechar</button>
      </div>
    </div>
  );
}
