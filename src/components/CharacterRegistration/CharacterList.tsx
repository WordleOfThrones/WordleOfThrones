"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import styles from "@/styles/CharacterRegistration/CharacterList.module.css";

interface Character {
  idPersonagem: number;
  nome: string;
  imagem: string;
}

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const router = useRouter();

  const fetchCharacters = async () => {
    try {
      const response = await axios.get("https://thronesapi-1.onrender.com/api/character-all");
      setCharacters(response.data);
    } catch (error) {
      console.error("Erro ao buscar personagens:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este personagem?")) {
      try {
        await axios.delete(`https://thronesapi-1.onrender.com/api/character/${id}`);
        fetchCharacters();
      } catch (error) {
        console.error("Erro ao deletar personagem:", error);
      }
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/editar-personagem/${id}`); // Rota interna da aplicação
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Personagens Cadastrados</h2>
      <table className={styles.characterTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Foto</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {characters.length > 0 ? (
            characters.map((character) => (
              <tr key={character.idPersonagem}>
                <td>{character.idPersonagem}</td>
                <td>
                  <Image
                    src={character.imagem}
                    alt={character.nome}
                    width={50}
                    height={50}
                    objectFit="cover"
                  />
                </td>
                <td>{character.nome}</td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(character.idPersonagem)}
                  >
                    Deletar
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(character.idPersonagem)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Nenhum personagem cadastrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
