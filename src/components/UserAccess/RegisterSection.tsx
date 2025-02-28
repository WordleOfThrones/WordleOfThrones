// components/RegisterForm.js
import React from 'react';
import styles from '../styles/Login.module.css';

const RegisterForm = () => {
  return (
    <div className={styles.formContainer}>
      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <span className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.svgIcon}>
              <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"/>
            </svg>
          </span>
          <input type="text" placeholder="Nome de usuário" className={styles.inputField} />
        </div>

        <div className={styles.inputGroup}>
          <span className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={styles.svgIcon}>
              <path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"/>
            </svg>
          </span>
          <input type="email" placeholder="Endereço de email" className={styles.inputField} />
        </div>

        <div className={styles.inputGroup}>
          <span className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.svgIcon}>
              <path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/>
            </svg>
          </span>
          <input type="password" placeholder="Senha" className={styles.inputField} />
        </div>

        <div className={styles.inputGroup}>
          <span className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.svgIcon}>
              <path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/>
            </svg>
          </span>
          <input type="password" placeholder="Confirme a senha" className={styles.inputField} />
        </div>

        <button className={styles.submitButton}>ENVIAR</button>
      </form>
    </div>
  );
};

export default RegisterForm;
