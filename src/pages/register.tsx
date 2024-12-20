import axios from "axios";
import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', formData);
      setMessage(`Kayıt başarılı! Kullanıcı ID: ${response.data.id}`);
      setError('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Kayıt sırasında bir hata oluştu.');
      } else {
        setError('Bilinmeyen bir hata oluştu.');
      }
      setMessage('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Kayıt Ol</h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Kullanıcı Adı</label>
          <input
            type="text"
            name="username"
            className="w-full px-3 py-2 border rounded"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border rounded"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Şifre</label>
          <input
            type="password"
            name="password"
            className="w-full px-3 py-2 border rounded"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default Register;
