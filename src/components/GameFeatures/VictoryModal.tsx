"use client";
import { useState, useEffect, useRef } from "react";
import styles from "@/styles/GameFeatures/VictoryModal.module.css";
import Image from "next/image";
import Link from "next/link";

interface VictoryModalProps {
  character: any;
  attempts: number;
  nextGameTime: number | null;
  onClose: (finalScore: number, attempts: number, timePenalty: number) => void;
  mode: number;
  errors: number;
  getFinalScore: () => number;
  getTimePenalty: () => number;
  idUser: number;
  idDataJogo: number;
}

export default function VictoryModal({
  character,
  attempts,
  nextGameTime,
  onClose,
  mode,
  errors,
  getFinalScore,
  getTimePenalty,
  idUser,
  idDataJogo,
}: VictoryModalProps) {
  const [countdown, setCountdown] = useState("00:00:00");
  const didPost = useRef(false);

  const finalScore = getFinalScore();
  const timePenalty = getTimePenalty();

  const modeMapping: Record<number, number> = { 1: 1, 2: 2, 3: 3 };

  useEffect(() => {
    if (!nextGameTime) return;
    const update = () => {
      const diff = nextGameTime - Date.now();
      if (diff <= 0) return setCountdown("00:00:00");
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(
        `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [nextGameTime]);

  useEffect(() => {
    if (didPost.current) return;
    didPost.current = true;

    const body = {
      idUser,
      idDataJogo,
      idModoJogo: modeMapping[mode],
      pontuacao: finalScore,
      qtdTentativas: attempts,
      tempo: timePenalty,
      status: 1,
      data: new Date().toISOString().split("T")[0],
    };

    fetch("https://thronesapi-1.onrender.com/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Erro ao salvar jogo: ${res.status}`);
        return res.json();
      })
      .then(data => console.log("Jogo salvo com sucesso:", data))
      .catch(err => console.error("Erro ao salvar jogo:", err));
  }, [mode, idUser, idDataJogo, attempts, timePenalty, finalScore]);

  const characterImage = character?.imagem || "/image/botao.png";
  const characterDescription = character?.titulo || "Descrição não disponível";

  function handleCloseClick() {
    onClose(finalScore, attempts, timePenalty);
  }

  const renderLinks = () => {
    switch (mode) {
      case 1:
        return (
          <>
            <Link href="/descricao"><Image src="/images/perg.png" alt="Descrição" width={50} height={50} className={styles.icon}/></Link>
            <Link href="/imagem"><Image src="/images/eye-solid.svg" alt="Imagem" width={50} height={50} className={styles.icon}/></Link>
          </>
        );
      case 2:
        return (
          <>
            <Link href="/classic"><Image src="/images/targeryan.png" alt="Clássico" width={50} height={50} className={styles.icon}/></Link>
            <Link href="/imagem"><Image src="/images/eye-solid.svg" alt="Imagem" width={50} height={50} className={styles.icon}/></Link>
          </>
        );
      case 3:
        return (
          <>
            <Link href="/classic"><Image src="/images/targeryan.png" alt="Clássico" width={50} height={50} className={styles.icon}/></Link>
            <Link href="/descricao"><Image src="/images/perg.png" alt="Descrição" width={50} height={50} className={styles.icon}/></Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Parabéns, você acertou!!</h2>
        <p className={styles.titleTry}><strong>Tentativas:</strong> {attempts}</p>
        <p className={styles.titleTry}><strong>Pontuação:</strong> {finalScore}</p>
        <div className={styles.characterRow}>
          <img src={characterImage} alt={character?.nome} className={styles.characterImage}/>
          <div className={styles.characterInfo}>
            <p className={styles.characterTitle}>"{characterDescription}"</p>
            <p className={styles.characterName}>{character?.nome}</p>
          </div>
        </div>
        <p>Próximo jogo em: <span className={styles.countdown}>{countdown}</span></p>
        <hr/>
        <p><strong>Outros modos:</strong></p>
        <div className={styles.iconContainer}>{renderLinks()}</div>
        <button onClick={handleCloseClick} className={styles.closeButton}>Fechar</button>
      </div>
    </div>
  );
}