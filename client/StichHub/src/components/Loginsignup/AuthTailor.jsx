import React, { useState } from "react";
import logo from "../../assets/logo/Long - Logo Transparent (White).png";
import shortlogo from "../../assets/logo/Short-Logo Transparent (Black).png";
import tailorimg from "../../assets/loginsignup/tailorimg.webp";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "../../axios.js";
import { Player } from "@lottiefiles/react-lottie-player";
import { FiEye, FiEyeOff } from "react-icons/fi";
import validate from "../../common/validation";
import AuthErrorMessage from "../AuthError";
import Captcha from "./Captcha";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const AuthTailor = () => {
  const [isregister, setIsRegister] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [trackState, setTrackState] = useState(false)
  const navigateTo = useNavigate();

  const switchMode = () => {
    setForm(initialForm);
    setIsRegister((prevIsregister) => !prevIsregister);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if(e.target.name !== "confirmPassword"){
      const validationMessage = validate[e.target.name](e.target.value);
      setError((prev)=>{
        return {...prev, ...validationMessage}
      })
    }else{
       if(form.password !== e.target.value){
         setError((prev)=>{
          return {...prev, confirmPassword: true, confirmPasswordError: "Password does not match"}
         })
       }else{
        setError((prev)=>{
          return {...prev, confirmPassword: false, confirmPasswordError: false}
         })
       }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let submitable = true
    Object.values(error).forEach(e=>{
      if(e){
        submitable = false;
        return ;
      }
    })

    if(submitable){
    setIsLoading(true);

    try {
      const res = isregister
        ? await axios.post("/userTailor/register", form)
        : await axios.post("/userTailor/signin", form);

        // console.log(res.data.result.isVerified)
      const result = res.data;
     
      if (isregister) localStorage.setItem("tailorFirstLogin", "true");
      localStorage.setItem("tailorProfile", JSON.stringify({ ...result }));

      setIsLoading(false);
      if(res.data.result.isVerified=== false){
        navigateTo("/verification");
        }else{
          navigateTo("/TailorDashboard")
        }
    } catch (error) {

      alert(error.response.data.message);
      setIsLoading(false);
    }}else{
      alert("Please enter valid values");

    }
  };

  const googleSuccess = async (res) => {
    const result = jwt_decode(res?.credential);
    localStorage.setItem("tailorProfile", JSON.stringify({ result }));

    try {
      navigateTo("/TailorProfileVerification");
    } catch (error) {
      console.error(error);
    }
  };

  const googleError = () => {
    alert("Google Sign In was unsuccessful. Try again later");
  };

  const [passwordType, setPasswordType] = useState("password");
  
  const passwordToggle = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    }
    else
      setPasswordType("password");
  };
  const margin = isregister? "-mt-3": "";

  return (
    <div className="bg-gray-800 h-[105vh] flex justify-between overflow-hidden">
      {/* Loading Animations */}
      {isLoading ? (
        <div className="relative">
          <div className="absolute z-[100] left-[-10vw] lg:left-[30vw] top-[18vh]">
            <Player
              src="https://assets8.lottiefiles.com/packages/lf20_prjwp0b2.json"
              background="transparent"
              speed="1"
              style={{ height: "500px", width: "500px" }}
              loop
              autoplay
            />
          </div>
        </div>
      ) : null}
      {/* Left Side (img)*/}
      <div className="hidden lg:flex bg-[url('../src/assets/loginsignupbg.webp')] bg-contain bg-no-repeat bg-[#BADDF1] bg-center w-[49vw] my-10  rounded-2xl">
        <img loading="lazy"
          src={shortlogo}
          className="w-[5vw] absolute bottom-14 left-5" alt="a white and blue letters S and H on a black background"
        ></img>
      </div>

      {/* Right Side */}
      <div className="relative bg-primary w-full lg:w-[49vw] my-9 rounded-3xl lg:rounded-r-3xl">
        <div className="relative z-[5]">
          {/* logo */}
 
         

          <a href="/" className="flex justify-center mt-3">
 
            <img src={logo} className="w-[240px]" alt="logo with text that says StichHub stitch your way" loading="lazy"/>
          </a>
          {/* title */}
          <div className="flex justify-center -my-2">
            <div>
              <img src={tailorimg} alt="a person with a mustache and a sewing machine" className="w-[60px] mr-5" loading="lazy"/>
            </div>
            <div className="mt-3 text-center">
              <span className="text-white text-3xl font-semibold">
                Tailor {isregister ? "Register" : "Sign in"}
              </span>
            </div>
          </div>

          {/* form */}
          <div className="flex justify-center">
            <form onSubmit={ handleSubmit} aria-label="Tailor authentication form">
              {isregister && (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 absolute z-[5] m-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-[8px] block w-[300px] py-1 pl-[45px] bg-white border rounded-xl text-xl shadow-sm drop-shadow-lg placeholder-slate-400 text-black focus:font-medium
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    "
                    aria-label="Enter you name"
                    required
                    aria-required="true"
                    aria-describedby="name-error"
                    aria-invalid={error.nameError ? "true" : "false"}
                  />
                    {(error.name && error.nameError)? <AuthErrorMessage message={error.nameError} name='name'/>:null}
                </div>
              )}
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 absolute z-[5] m-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>

                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-[8px] block w-[300px] py-1 pl-[45px] bg-white border border-slate-300 rounded-xl text-xl shadow-sm drop-shadow-lg placeholder-slate-400 text-black focus:font-medium
                  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                  invalid:border-pink-500 invalid:text-pink-600
                  focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  aria-label="Enter you email"
                  required
                  aria-required="true"
                  aria-describedby="email-error"
                  aria-invalid={error.emailError ? "true" : "false"}
                />
                   {(error.email && error.emailError)? <AuthErrorMessage message={error.emailError} name='email'/>:null}
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 absolute z-[5] m-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>

                <input
                  type={passwordType}
                  placeholder="Password"
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  className="mt-[8px] block w-[300px] py-1 pl-[45px] bg-white border border-slate-300 rounded-xl text-xl shadow-sm drop-shadow-lg placeholder-slate-400 text-black focus:font-medium
                  focus:outline-none pr-[2.3rem] focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                "
                  aria-label="Enter you password"
                  required
                  aria-required="true"
                  aria-describedby="password-error"
                  aria-invalid={error.passwordError ? "true" : "false"}
                />
                <div onClick={passwordToggle} className="absolute cursor-pointer flex items-center z-[5] mt-[-1.8rem] ml-[17rem]">
                {passwordType === "password" ? <FiEyeOff /> : <FiEye />}
                </div>
                {(error.password && error.passwordError)? <AuthErrorMessage message={error.passwordError} name='password'/>:null}
              </div>
              {isregister && (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 absolute z-[5] m-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="mt-[8px] block w-[300px] py-1 pl-[45px] bg-white border border-slate-300 rounded-xl text-xl shadow-sm drop-shadow-lg placeholder-slate-400 text-black focus:font-medium
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                "
                    aria-label="Confirm your password"
                    required
                    aria-required="true"
                    aria-describedby="confirmPassword-error"
                    aria-invalid={error.confirmPassword ? "true" : "false"}
                  />
                        {(error.confirmPassword && error.confirmPasswordError)? <AuthErrorMessage message={error.confirmPasswordError} name='confirmPassword'/>:null}
                </div>
              )}
                        <Captcha message={setTrackState} trackState={trackState}/>
              <div className="flex justify-center">
              {isregister ? (<button
                  type="submit"
                  className="mt-[10px] block w-[170px] py-1 bg-blue-500 text-white hover:bg-slate-200 hover:text-blue-600 hover:transition-all duration-500 hover:font-semibold rounded-xl font-regular text-xl"
                  disabled={!trackState}
                  style={{cursor:`${trackState ? "pointer": "not-allowed"}`}}
                >Register</button>):(<button
                  type="submit"
                  className="mt-[10px] block w-[170px] py-1 bg-blue-500 text-white hover:bg-slate-200 hover:text-blue-600 hover:transition-all duration-500 hover:font-semibold rounded-xl font-regular text-xl"
                  disabled={!trackState}
                  style={{cursor:`${trackState ? "pointer": "not-allowed"}`}}
                >Sign in</button>)}
              </div>
          

              <h1 className="text-center text-white text-xl -py-1">or</h1>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={googleSuccess}
                  onFailure={googleError}
                  cookiePolicy="single_host_origin"
                />
              </div>
              <h1 className={"text-center text-white text-md "+margin}>
              {isregister ? "" : 
                <a
                  className="cursor-pointer text-blue-400"
                  onClick={()=>{
                    navigateTo("/forgotpassword/tailor");
                  }}
                >
                  Forgot Password?
                </a>}<br/>
                {isregister ? "Already a user?" : "Don't have an account?"}
                <a
                  className="cursor-pointer text-blue-400"
                  onClick={switchMode}
                >
                  &nbsp; {isregister ? "sign in" : "register"}
                </a>
              </h1>
            </form>
          </div>
        </div>

        {/* BG-Gradients */}
        <div className="absolute circleGradient-blue w-[300px] h-[300px] top-[-10px] right-[-100px] z-0 blur-2xl"></div>
        <div className="absolute circleGradient-peach w-[300px] h-[300px] bottom-[0px] right-[-100px] z-0 blur-2xl"></div>
      </div>
    </div>
  );
};

export default AuthTailor;
