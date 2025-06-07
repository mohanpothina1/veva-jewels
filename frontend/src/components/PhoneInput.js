import React, { useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./AuthStyles.css"; // Create this CSS file for common styles

function PhoneNumber({ onOtpSent, setPhoneNumber }) {
  const [phone, setPhone] = useState("");

  const requestOtp = async () => {
    try {
      await axios.post("http://localhost:8086/api/auth/request-otp", {
        phoneNumber: `+${phone}`,
      });
      setPhoneNumber(`+${phone}`);
      onOtpSent(true);
    } catch (err) {
      alert("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Enter Mobile Number</h2>
      <p className="instruction-text">
        We will send you an OTP to verify your number
      </p>
      
      <div className="input-container">
        <PhoneInput
          country={"in"}
          value={phone}
          onChange={setPhone}
          inputClass="phone-input"
          placeholder="Phone number"
          inputProps={{
            required: true,
          }}
        />
      </div>
      
      <button className="submit-button" onClick={requestOtp}>
        Request OTP →
      </button>
      
      <div className="recaptcha-notice">
        <div>I'm not a robot</div>
        <div className="recaptcha-brand">reCAPTCHA</div>
        <div>Privacy - Terms</div>
      </div>
    </div>
  );
}

export default PhoneNumber;