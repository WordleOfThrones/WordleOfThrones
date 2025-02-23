import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/CharacterList.module.css';

export default function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const router = useRouter();

  // Função para buscar os personagens da API
  const fetchCharacters = async () => {
    try {
      const response = await axios.get('https://thronesapi-1.onrender.com/api/character-all'); // Rota para obter todos os personagens
      setCharacters(response.data);
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
    }
  };

  // Função para deletar um personagem
  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar este personagem?')) {
      try {
        await axios.delete(`https://thronesapi-1.onrender.com/api/character/${id}`); // Chama a rota de deleção
        fetchCharacters(); // Recarrega os personagens após a deleção
      } catch (error) {
        console.error('Erro ao deletar personagem:', error);
      }
    }
  };

  // Função para editar um personagem
  const handleEdit = (id: number) => {
    // Redireciona para a página de edição de personagem com o ID do personagem
    router.push(`https://thronesapi-1.onrender.com/api/character/${id}`);
  };

  useEffect(() => {
    fetchCharacters(); // Chama a função para buscar personagens ao carregar o componente
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
            characters.map((character: any) => (
              <tr key={character.idPersonagem}>
                <td>{character.idPersonagem}</td>
                <td>
                  <img src={character.imagem} alt={character.nome} width="50" />
                </td>
                <td>{character.nome}</td>
                <td>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleDelete(character.idPersonagem)}>
                    Deletar
                  </button>
                  <button 
                    className={styles.editButton} 
                    onClick={() => handleEdit(character.idPersonagem)}>
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
