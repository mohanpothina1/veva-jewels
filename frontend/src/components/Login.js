import React, { useState } from "react";
import PhoneNumber from "./PhoneInput";
import OtpVerification from "./OtpVerification";
import UserForm from "./UserForm";

function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  return (
    <div style={{ padding: "2rem" }}>
      {!isOtpSent && (
        <PhoneNumber onOtpSent={setIsOtpSent} setPhoneNumber={setPhoneNumber} />
      )}

      {isOtpSent && !isOtpVerified && (
        <OtpVerification phoneNumber={phoneNumber} onVerified={setIsOtpVerified} />
      )}

      {isOtpVerified && <UserForm phoneNumber={phoneNumber} />}
    </div>
  );
}

export default Login;
