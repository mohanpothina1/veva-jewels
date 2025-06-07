import React, { useState } from "react";
import axios from "axios";
import "./AuthStyles.css";

function UserForm({ phoneNumber }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveUser = async () => {
    if (!form.fullName || !form.email) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8086/api/auth/profile",
        {
          phoneNumber,
          ...form,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile saved successfully!");
    } catch (err) {
      alert("Failed to save user data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Enter Your Details</h2>
      
      <input
        type="text"
        className="form-input"
        placeholder="Full Name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        required
      />
      
      <input
        type="email"
        className="form-input"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      
      <input
        type="text"
        className="read-only-input"
        value={phoneNumber}
        readOnly
      />
      
      <button
        className="submit-button"
        onClick={saveUser}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Submit →"}
      </button>
    </div>
  );
}

export default UserForm;