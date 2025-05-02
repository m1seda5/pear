import React, { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import axios from "axios";

const SignupCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [yearGroup, setYearGroup] = useState("");
  const [department, setDepartment] = useState("");
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    otp: "",
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(600);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [campus, setCampus] = useState("");
  const [response, setResponse] = useState(null);

  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const validateEmailFormat = (email) => {
    if (!email) return "Email is required";

    const emailLower = email.toLowerCase();

    if (emailLower.includes("pear")) {
      return "";
    }

    if (!emailLower.includes("brookhouse.ac.ke")) {
      return "Please use your Brookhouse email address";
    }

    return "";
  };

  const validateUsernameFormat = (username, email) => {
    if (!username || !email) return "";

    const emailLower = email.toLowerCase();

    if (emailLower.includes("pear")) {
      if (!username.toLowerCase().includes("pear")) {
        return 'Admin usernames must contain "pear"';
      }
      return "";
    }

    const userIdentifier = emailLower.split("@")[0];
    const surname = userIdentifier.slice(1);

    if (!username.toLowerCase().includes(surname.toLowerCase())) {
      return `Username must contain your surname (${surname})`;
    }

    return "";
  };

  useEffect(() => {
    if (inputs.email) {
      const error = validateEmailFormat(inputs.email);
      setEmailError(error);

      const email = inputs.email.toLowerCase();

      if (email.includes("pear")) {
        setIsStudent(false);
        setIsTeacher(false);
        setIsAdmin(true);
        setCampus("admin");
        return;
      }

      setIsAdmin(false);

      const isRunda = email.includes("runda");
      setCampus(isRunda ? "runda" : "karen");

      const isStudentEmail = email.includes("students");
      setIsStudent(isStudentEmail);
      setIsTeacher(!isStudentEmail);
    }
  }, [inputs.email]);

  useEffect(() => {
    if (inputs.username && inputs.email) {
      const error = validateUsernameFormat(inputs.username, inputs.email);
      setUsernameError(error);
    }
  }, [inputs.username, inputs.email]);

  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  useEffect(() => {
    if (isOtpVerified && response) {
      localStorage.setItem("user-threads", JSON.stringify(response.data));
      setUser(response.data);
      window.location.href = "/";
    }
  }, [isOtpVerified, response, setUser]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendOTP = async () => {
    try {
      setIsResendDisabled(true);
      setErrorMessage("");

      const response = await axios.post("/api/users/resend-otp", {
        email: inputs.email,
      });

      if (response.data.message) {
        setTimer(600);
        setResendAttempts((prev) => prev + 1);
        showToast("Success", "New OTP sent successfully", "success");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to resend OTP";
      setErrorMessage(errorMsg);
      showToast("Error", errorMsg, "error");

      if (error.response?.status !== 429) {
        setIsResendDisabled(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!inputs.email || !inputs.password || !inputs.name || !inputs.username) {
      showToast("Error", "All fields are required", "error");
      return false;
    }

    if (emailError) {
      showToast("Error", emailError, "error");
      return false;
    }

    if (usernameError) {
      showToast("Error", usernameError, "error");
      return false;
    }

    if (!isAdmin) {
      if (isStudent && !yearGroup) {
        showToast("Error", "Please select your year group", "error");
        return false;
      }

      if (isTeacher && !department) {
        showToast("Error", "Please select your department", "error");
        return false;
      }
    }

    return true;
  };

  const sendOtp = async (isResend = false) => {
    try {
      if (!validateForm()) return;

      let role = "admin";
      if (!isAdmin) {
        role = isStudent ? "student" : "teacher";
      }

      const signupData = {
        name: inputs.name,
        email: inputs.email,
        username: inputs.username,
        password: inputs.password,
        role,
        ...(campus !== "admin" ? { campus: campus.toLowerCase() } : {}),
        ...(role === "student" ? { yearGroup } : {}),
        ...(role === "teacher" ? { department } : {}),
      };

      if (isResend) {
        await axios.post("/api/users/resend-otp", { email: inputs.email });
      } else {
        await axios.post("/api/users/signup", signupData);
      }

      setIsOtpSent(true);
      setTimer(600);
      setIsResendDisabled(true);
      showToast(
        "Success",
        `OTP ${isResend ? "re-" : ""}sent to your email. Please verify within 10 minutes.`,
        "success"
      );
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || "Error sending OTP");
      showToast("Error", error.response?.data?.error || "Error sending OTP", "error");
    }
  };

  const verifyOtp = async () => {
    try {
      const numericOTP = parseInt(formData.otp, 10);
      if (isNaN(numericOTP)) {
        setErrorMessage("OTP must be a numeric value");
        return;
      }

      const response = await axios.post("/api/users/verify-otp", {
        email: inputs.email,
        otp: numericOTP,
      });

      if (response.data._id) {
        setResponse(response);
        setIsOtpVerified(true);
        showToast("Success", "Account created successfully!", "success");
      } else {
        setIsOtpVerified(true);
        setErrorMessage("");
        showToast("Success", "OTP verified successfully", "success");
      }
    } catch (error) {
      console.error("Verify OTP error:", error.response?.data?.error || error.message);
      setErrorMessage(error.response?.data?.error || "Failed to verify OTP");

      if (error.response?.status === 429) {
        setIsOtpSent(false);
        setFormData({ otp: "" });
      }
    }
  };

  return (
    <div className="container">
      <div className="login-container is-centered">
        <div className="columns is-vcentered">
          <div className="column">
            <h2 className="form-title has-text-centered">Create Your Account</h2>
            <h3 className="form-subtitle has-text-centered">
              {campus && `(${campus})`}
            </h3>

            <div className="login-form">
              <div className="form-panel">
                <div className="columns is-multiline">
                  <div className="column is-6">
                    <div className="field">
                      <label>Full Name</label>
                      <div className="control">
                        <input
                          type="text"
                          className="input"
                          placeholder="Enter your full name"
                          value={inputs.name}
                          onChange={(e) =>
                            setInputs({ ...inputs, name: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="field">
                      <label>Username</label>
                      <div className="control">
                        <input
                          type="text"
                          className={`input ${usernameError ? "is-danger" : ""}`}
                          placeholder="Enter your username"
                          value={inputs.username}
                          onChange={(e) =>
                            setInputs({ ...inputs, username: e.target.value })
                          }
                        />
                        {usernameError && (
                          <p className="help is-danger">{usernameError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="column is-12">
                    <div className="field">
                      <label>Email</label>
                      <div className="control">
                        <input
                          type="email"
                          className={`input ${emailError ? "is-danger" : ""}`}
                          placeholder={
                            isAdmin
                              ? "example@pear.com"
                              : "example@brookhouse.ac.ke"
                          }
                          value={inputs.email}
                          onChange={(e) =>
                            setInputs({ ...inputs, email: e.target.value })
                          }
                        />
                        {emailError && (
                          <p className="help is-danger">{emailError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="column is-12">
                    <div className="field">
                      <label>Password</label>
                      <div className="control has-icons-right">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="input"
                          placeholder="Enter your password"
                          value={inputs.password}
                          onChange={(e) =>
                            setInputs({ ...inputs, password: e.target.value })
                          }
                        />
                        <span
                          className="icon is-right is-clickable"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i
                            className={`fas ${
                              showPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                          ></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isAdmin && (
                    <div className="column is-12">
                      <div className="field">
                        <div className="control">
                          <label className="checkbox">
                            <input
                              type="checkbox"
                              checked={isStudent}
                              disabled
                            />
                            Student Account
                          </label>
                          <label className="checkbox">
                            <input
                              type="checkbox"
                              checked={isTeacher}
                              disabled
                            />
                            Teacher Account
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {isStudent && !isAdmin && (
                    <div className="column is-12">
                      <div className="field">
                        <label>Year Group</label>
                        <div className="control">
                          <div className="select is-fullwidth">
                            <select
                              value={yearGroup}
                              onChange={(e) => setYearGroup(e.target.value)}
                            >
                              <option value="">Select Year Group</option>
                              <option value="Year 9">Year 9</option>
                              <option value="Year 10">Year 10</option>
                              <option value="Year 11">Year 11</option>
                              <option value="Year 12">Year 12</option>
                              <option value="Year 13">Year 13</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isTeacher && !isAdmin && (
                    <div className="column is-12">
                      <div className="field">
                        <label>Department</label>
                        <div className="control">
                          <div className="select is-fullwidth">
                            <select
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                            >
                              <option value="">Select Department</option>
                              <option value="Mathematics">Math</option>
                              <option value="Chemistry">Chemistry</option>
                              <option value="Biology">Biology</option>
                              <option value="Physics">Science</option>
                              <option value="Computer Science">
                                Computer Science
                              </option>
                              <option value="BTEC Business">BTEC Business</option>
                              <option value="BTEC Sport">BTEC Sport</option>
                              <option value="BTEC Art">BTEC Art</option>
                              <option value="BTEC Music">BTEC Music</option>
                              <option value="Business">Business</option>
                              <option value="Economics">Economics</option>
                              <option value="English">English</option>
                              <option value="History">History</option>
                              <option value="Sociology">Sociology</option>
                              <option value="Psychology">Psychology</option>
                              <option value="Geography">Geography</option>
                              <option value="Arts">Arts</option>
                              <option value="Music">Music</option>
                              <option value="Physical Education">
                                Physical Education
                              </option>
                              <option value="media">Pear Media</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isOtpSent && (
                    <div className="column is-12">
                      <div className="buttons">
                        <button
                          className="button is-solid primary-button is-fullwidth raised"
                          onClick={() => sendOtp(false)}
                          disabled={
                            !inputs.email ||
                            !inputs.password ||
                            !inputs.name ||
                            !inputs.username ||
                            !!emailError ||
                            !!usernameError ||
                            (!isAdmin &&
                              ((isStudent && !yearGroup) ||
                                (isTeacher && !department)))
                          }
                        >
                          Verify Email
                        </button>
                      </div>
                    </div>
                  )}

                  {isOtpSent && (
                    <div className="column is-12">
                      <div className="field">
                        <label>Enter OTP</label>
                        <div className="control">
                          <input
                            type="text"
                            className="input"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            maxLength={4}
                            placeholder="Enter 4-digit OTP"
                          />
                        </div>
                      </div>
                      <div className="buttons">
                        <button
                          className="button is-solid primary-button"
                          onClick={verifyOtp}
                          disabled={!formData.otp}
                        >
                          Verify OTP & Create Account
                        </button>
                        <button
                          className="button is-outlined"
                          onClick={handleResendOTP}
                          disabled={isResendDisabled}
                        >
                          Resend OTP {timer > 0 && `(${formatTime(timer)})`}
                        </button>
                      </div>
                      {errorMessage && (
                        <p className="help is-danger">{errorMessage}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="account-link has-text-centered">
                <a onClick={() => setAuthScreen("login")}>
                  Already have an account? Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupCard;