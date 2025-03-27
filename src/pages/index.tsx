"use client";
import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import Link from "next/link";
import Button from "../components/Button";

const mensagensBase = [
  (contagem: any) => ` ${contagem.classic} jogadores desbravaram o modo Clássico`,
  (contagem: any) => ` ${contagem.descricao} jogadores decifraram através da Descrição`,
  (contagem: any) => ` ${contagem.imagem} jogadores revelaram rostos pela Imagem`,
];

export default function Home() {
  const [contagem, setContagem] = useState({
    classic: 0,
    descricao: 0,
    imagem: 0,
  });

  const [mensagemIndex, setMensagemIndex] = useState(0);

  const mensagens = useMemo(() => {
    return mensagensBase.map(fn => fn(contagem));
  }, [contagem]);

  useEffect(() => {
    async function fetchJogos() {
      const hoje = new Date().toISOString().split("T")[0];
      const res = await fetch(`https://thronesapi-1.onrender.com/api/game?data=${hoje}`);
      const data = await res.json();

      const porModo: Record<number, Set<string>> = {};

      data.registros.forEach((jogo: any) => {
        if (jogo.status === 1) {
          const key = `${jogo.idUser ?? "anon"}-${jogo.data}`;
          if (!porModo[jogo.idModoJogo]) {
            porModo[jogo.idModoJogo] = new Set();
          }
          porModo[jogo.idModoJogo].add(key);
        }
      });

      setContagem({
        classic: porModo[1]?.size || 0,
        descricao: porModo[2]?.size || 0,
        imagem: porModo[3]?.size || 0,
      });
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
        <Link href={"/classic"}>
          <Button
            title="Clássico"
            info="Consiga pistas a cada tentativa"
            iconsrc="/images/targeryan.png"
          />
        </Link>
        <Link href={"/descricao"}>
          <Button
            title="Descrição"
            info="Adivinhe o personagem pela descrição"
            iconsrc="/images/perg.png"
          />
        </Link>
        <Link href={"/imagem"}>
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
