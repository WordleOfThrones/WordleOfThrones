import React from 'react';
import styles from '../../styles/Header.module.css';
import { useNavigation } from '../../hooks/useNavigation';

export default function LoginButton() {
  const { navigateToRegister } = useNavigation();

  return (
    <div className={styles.loginButtonContainer}>
      {/* <button className={styles.loginButton} onClick={navigateToRegister}>
        SEM PERFIL
      </button> */}
    </div>
  );
}
