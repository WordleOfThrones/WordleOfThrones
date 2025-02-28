import Header from '@/components/Header';
import Button from '@/components/Button';
import Link from 'next/link';


export default function Home() {
  return (
    <div>

      <div className="headerContainer">
        <Header />
      </div>

      <div className="textContainer">
        <p>Adivinhe diariamente um personagem de <br />
          <span className="series">Game of Thrones</span> 
          <span className="separator"> ou </span>
          <span className='seriess'>House of the Dragon</span>
        </p>
      </div>

      <div className="buttonsContainer">
        <Link href={'/classic'}>
          <Button 
            title="Classico"
            info="Consiga pistas a cada tentativa"
            iconsrc="/images/targeryan.png"
          />
        </Link>
        <Button 
          title="Descricao"
          info="Adivinhe o personagem pela descrição"
          iconsrc="/images/perg.png"
        />
         <Link href={'/imagem'}>
        <Button 
          title="Imagem"
          info="Adivinhe o personagem pela foto desfocada"
          iconsrc="/images/eye.png"
        />
        </Link>
      </div>

    </div>
  );
}
