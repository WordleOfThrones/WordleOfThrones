import { useState } from "react";
import styles from "../styles/UserAccess/RegisterPage.module.css";
import Logo from "@/components/Header/Logo"; 
import Link from "next/link";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nameUser: "",
    nickname: "",
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
      const response = await fetch("https://thronesapi-1.onrender.com/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Cadastro realizado com sucesso! Faça login para continuar.");
        setFormData({ nameUser: "", nickname: "", email: "", password: "" });
      } else {
        setError(data.message || "Erro ao cadastrar. Tente novamente.");
      }
    } catch (error) {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Logo que leva de volta para a página inicial */}
      <div className={styles.logoContainer}>
        <Logo />
      </div>

      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <h2>Cadastro</h2>
        <input
          type="text"
          name="nameUser"
          placeholder="Nome completo"
          value={formData.nameUser}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nickname"
          placeholder="Apelido"
          value={formData.nickname}
          onChange={handleChange}
          required
        />
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
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </form>
      <p className={styles.redirectText}>
  Já tem uma conta?{" "}
  <Link href="/login">
    <span className={styles.link}>Faça login</span>
  </Link>
</p>
    </div>
  );
}
