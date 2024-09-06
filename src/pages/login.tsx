import React from 'react';
import Form from '../components/Form';
import styles from '../styles/Login.module.css';
import Header from '@/components/Header';
import { useRouter } from 'next/router';


export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/register'); // Redireciona para a página de login
  };

  return (

     <div>

<div className="headerContainer">
        <Header />
      </div>

    <div className={styles.container}>
      <div className={styles.login}>
        <h2>Seja bem vindo</h2>
        <h2> AO</h2>
        <h1>Wordle of Thrones</h1>
        <p>Para manter-se conectado, realize login com suas informações</p>
        <button className={styles.loginButton} onClick={handleLoginClick}>
          ENTRAR
        </button>
      </div>
      <div className={styles.register}>
        <h1>Realizar Cadastro</h1>
        <p>Preencha com seus dados</p>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <span className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.svgIcon}><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
            </span>
            <input type="text" placeholder="Nome de usuário" />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={styles.svgIcon}><path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"/></svg>
            </span>
            <input type="email" placeholder="Endereço de email" />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.svgIcon}><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg>
            </span>
            <input type="password" placeholder="Senha" />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.svgIcon}><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg>
            </span>
            <input type="password" placeholder="Confirme a senha" />
          </div>
          <button type="submit" className={styles.registerButton}>CADASTRAR</button>
        </form>
      </div>
    </div>

    </div>
  );
}
