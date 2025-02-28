import { useState } from 'react';
import { useUpload } from '@/hooks/useUpload';
import styles from '@/styles/CharacterRegistration/CharacterForm.module.css';

export default function CharacterForm() {
  const [image, setImage] = useState<File | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [description, setDescription] = useState('');
  const [house, setHouse] = useState('');
  const [gender, setGender] = useState('');
  const [race, setRace] = useState('');
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('');
  const [religion, setReligion] = useState('');
  const [series, setSeries] = useState('');
  const [firstAppearance, setFirstAppearance] = useState('');

  const { progress, handleUpload } = useUpload();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log({
      characterName,
      description,
      house,
      gender,
      race,
      title,
      origin,
      religion,
      series,
      firstAppearance,
    });
    
    handleUpload(image, {
      name: characterName,
      description,
      house,
      gender,
      race,
      title,
      origin,
      religion,
      series,
      firstAppearance,
    });
  };  

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.formTitle}>Cadastrar Personagem</h1>
        <form onSubmit={handleFormSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome do Personagem</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Nome"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Casa</label>
              <select 
                className={styles.formInput} 
                value={house} 
                onChange={(e) => setHouse(e.target.value)} 
                required>
                <option value="">Selecione a Casa</option>
                <option value="Targaryen">Targaryen</option>
                <option value="Stark">Stark</option>
                <option value="Lannister">Lannister</option>
                <option value="Baratheon">Baratheon</option>
                <option value="Greyjoy">Greyjoy</option>
                <option value="Martell">Martell</option>
                <option value="Tyrell">Tyrell</option>
                <option value="Arryn">Arryn</option>
                <option value="Tully">Tully</option>
                <option value="Bolton">Bolton</option>
                <option value="Frey">Frey</option>
                <option value="Hightower">Hightower</option>
                <option value="Velaryon">Velaryon</option>
                <option value="Strong">Strong</option>
                <option value="Reed">Reed</option>
                <option value="Mormont">Mormont</option>
                <option value="Karstark">Karstark</option>
                <option value="Umber">Umber</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Gênero</label>
              <select 
                className={styles.formInput} 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                required>
                <option value="">Selecione o Gênero</option>
                <option value="H">Homem (Humano)</option>
                <option value="M">Mulher (Humano)</option>
                <option value="D">Dragão Macho</option>
                <option value="F">Dragão Fêmea</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Raça</label>
              <select 
                className={styles.formInput} 
                value={race} 
                onChange={(e) => setRace(e.target.value)} 
                required>
                <option value="">Selecione a Raça</option>
                <option value="Humano">Humano</option>
                <option value="Dragão">Dragão</option>
                <option value="Caminhante Branco">Caminhante Branco</option>
                <option value="Gigante">Gigante</option>
                <option value="Filhos da Floresta">Filhos da Floresta</option>
                <option value="Warg">Warg</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Título</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Origem</label>
              <select 
                className={styles.formInput} 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)} 
                required>
                <option value="">Selecione a Origem</option>
                <option value="Porto Real">Porto Real</option>
                <option value="Winterfell">Winterfell</option>
                <option value="Rochedo Casterly">Rochedo Casterly</option>
                <option value="Dragonstone">Dragonstone</option>
                <option value="Harrenhal">Harrenhal</option>
                <option value="Dorne">Dorne</option>
                <option value="Ilhas de Ferro">Ilhas de Ferro</option>
                <option value="Jardim de Cima">Jardim de Cima</option>
                <option value="Ninho da Águia">Ninho da Águia</option>
                <option value="Cidadela de Vilavelha">Cidadela de Vilavelha</option>
                <option value="Essos">Essos</option>
                <option value="Castelo Negro">Castelo Negro</option>
                <option value="Driftmark">Driftmark</option>
                <option value="Valíria">Valíria</option>
                <option value="Lys">Lys</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Religião</label>
              <select 
                className={styles.formInput} 
                value={religion} 
                onChange={(e) => setReligion(e.target.value)} 
                required>
                <option value="">Selecione a Religião</option>
                <option value="Fé dos Sete">Fé dos Sete</option>
                <option value="Deuses Antigos da Floresta">Deuses Antigos da Floresta</option>
                <option value="R'hllor">R&apos;hllor (Senhor da Luz)</option>
                <option value="O Deus Afogado">O Deus Afogado</option>
                <option value="O Deus de Muitas Faces">O Deus de Muitas Faces (Homem Sem Rosto)</option>
                <option value="Os Grandes Mestres de Meereen">Os Grandes Mestres de Meereen (Cultura Essos)</option>
                <option value="Fé dos Nove">Fé dos Nove</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Série</label>
              <select 
                className={styles.formInput} 
                value={series} 
                onChange={(e) => setSeries(e.target.value)} 
                required>
                <option value="">Selecione a Série</option>
                <option value="Game of Thrones">Game of Thrones (GoT)</option>
                <option value="House of the Dragon">House of the Dragon (HotD)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Primeira Aparição</label>
              <select 
                className={styles.formInput} 
                value={firstAppearance} 
                onChange={(e) => setFirstAppearance(e.target.value)} 
                required>
                <option value="">Selecione a Primeira Aparição</option>
                <option value="Temporada 1">Temporada 1</option>
                <option value="Temporada 2">Temporada 2</option>
                <option value="Temporada 3">Temporada 3</option>
                <option value="Temporada 4">Temporada 4</option>
                <option value="Temporada 5">Temporada 5</option>
                <option value="Temporada 6">Temporada 6</option>
                <option value="Temporada 7">Temporada 7</option>
                <option value="Temporada 8">Temporada 8</option>
              </select>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label className={styles.formLabel}>Descrição</label>
              <textarea
                className={styles.formTextarea}
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Escolher Imagem</label>
              <input
                type="file"
                className={styles.formFileInput}
                onChange={handleImageChange}
              />
            </div>

            <button className={styles.submitButton} type="submit">Cadastrar Personagem</button>
          </div>
        </form>
      </div>
    </div>
  );
}
