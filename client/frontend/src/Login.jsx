import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE;

  const handleLogin = () => {
    fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_name", data.user_name);
          navigate("/dashboard");
        } else {
          alert("Login failed: " + data.message);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
