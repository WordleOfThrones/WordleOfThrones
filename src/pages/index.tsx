"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Link from "next/link";
import Button from "../components/Button";

export default function Home() {
  const [contagem, setContagem] = useState({
    classic: 0,
    descricao: 0,
    imagem: 0,
  });

  const [mensagemIndex, setMensagemIndex] = useState(0);
  const mensagens = [
    ` ${contagem.classic} jogadores desbravaram o modo Clássico`,
    ` ${contagem.descricao} jogadores decifraram através da Descrição`,
    ` ${contagem.imagem} jogadores revelaram rostos pela Imagem`,
  ];

  useEffect(() => {
    async function fetchJogos() {
      try {
        const hoje = new Date().toISOString().split("T")[0];
        const modos = [1, 2, 3];
        const resultados: Record<number, number> = {};

        for (const modo of modos) {
          const res = await fetch(
            `https://thronesapi-1.onrender.com/api/game?data=${hoje}&idModoJogo=${modo}`
          );
          const data = await res.json();
          const jogosValidos = data.registros?.filter(
            (jogo: any) => jogo.status === 1
          ) || [];
          resultados[modo] = jogosValidos.length;
        }

        setContagem({
          classic: resultados[1] || 0,
          descricao: resultados[2] || 0,
          imagem: resultados[3] || 0,
        });
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      }
    }

    fetchJogos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMensagemIndex((prev) => (prev + 1) % mensagens.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [mensagens.length]);

  return (
    <div>
      <div className="headerContainer">
        <Header />
      </div>

      <div className="textContainer">
        <p>
          Adivinhe diariamente um personagem de <br />
          <span className="series">Game of Thrones</span>
          <span className="separator"> ou </span>
          <span className="seriess">House of the Dragon</span>
        </p>
      </div>

      <div className="buttonsContainer">
        <Link href="/classic">
          <Button
            title="Clássico"
            info="Consiga pistas a cada tentativa"
            iconsrc="/images/targeryan.png"
          />
        </Link>
        <Link href="/descricao">
          <Button
            title="Descrição"
            info="Adivinhe o personagem pela descrição"
            iconsrc="/images/perg.png"
          />
        </Link>
        <Link href="/imagem">
          <Button
            title="Imagem"
            info="Adivinhe o personagem pela foto desfocada"
            iconsrc="/images/eye-solid.svg"
          />
        </Link>

        <div className="rotatingMessageContainer">
          <p className="rotatingMessage">
            <span className="highlight">
              {mensagens[mensagemIndex].split(" ")[1]}
            </span>{" "}
            {mensagens[mensagemIndex].split(" ").slice(2).join(" ")}
          </p>
        </div>
      </div>
    </div>
  );
}
