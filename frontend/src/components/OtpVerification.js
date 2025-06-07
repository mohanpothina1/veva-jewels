import React, { useState } from "react";
import axios from "axios";
import "./AuthStyles.css";

function OtpVerification({ phoneNumber, onVerified }) {
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8086/api/auth/verify-otp",
        {
          phoneNumber,
          otp,
        }
      );

      localStorage.setItem("token", response.data.token);
      onVerified(true);
    } catch (err) {
      alert("OTP Verification Failed. Please check the OTP and try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Enter OTP</h2>
      <p className="instruction-text">The OTP is sent on Mobile number</p>
      <div className="phone-number-display">{phoneNumber}</div>
      
      <input
        type="text"
        className="otp-input"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        maxLength="6"
        inputMode="numeric"
      />
      
      <button className="submit-button" onClick={verifyOtp}>
        Verify OTP →
      </button>
      
      <div className="recaptcha-notice">
        <div>I'm not a robot</div>
        <div className="recaptcha-brand">reCAPTCHA</div>
      </div>
    </div>
  );
}

export default OtpVerification;