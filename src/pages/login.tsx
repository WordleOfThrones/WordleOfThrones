import { useState } from "react";
import styles from "../styles/UserAccess/LoginForm.module.css";
import Logo from "@/components/Header/Logo";
import Link from "next/link";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("https://thronesapi-1.onrender.com/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Login realizado com sucesso!");
      } else {
        setError(data.message || "Erro ao fazer login. Tente novamente.");
      }
    } catch (error) {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {error && <p className={styles.loginError}>{error}</p>}
        {success && <p className={styles.loginSuccess}>{success}</p>}

        {/* Link para cadastro */}
        <p className={styles.redirectText}>
          Ainda não tem uma conta?{" "}
          <Link href="/register">
            <span className={styles.link}>Cadastre-se</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
