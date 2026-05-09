import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../main";
import { data, useNavigate } from "react-router-dom";
import { api } from "../utils/api.js";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const handleRegister = async (data) => {
    if (!data.phone.startsWith("+")) {
      data.phone = `+91${data.phone}`;
    }
    await axios.post(api.register, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      console.log('Register success response:', res.data);
      toast.success(res.data.message);
      try {
        navigateTo(`/otp-verification/${data.email}/${data.phone}`);
        console.log('Navigated to otp-verification', data.email, data.phone);
      } catch (navErr) {
        console.error('Navigation error:', navErr);
      }
    }).catch((error) => {
      console.error('Register error response:', error.response?.data || error.message);
      const msg = error.response?.data?.message || error.message || 'Registration failed.';
      toast.error(msg);
    })
  };
  return <>

    <div>
      <form className="auth-form" onSubmit={handleSubmit((data) => handleRegister(data))}>
        <h2>Register</h2>
        <input type="text" placeholder="Name" required {...register("name")} />
        <input type="email" placeholder="Email" required {...register("email")} />
        <div>
          <span>+91</span>
          <input type="number" placeholder="Phone" required {...register("phone")} />
        </div>
        <input type="password" placeholder="Password" required {...register("password")} />
        <div className="verification-method">
          <p>Select Verification Method</p>
          <div className="wrapper">
            <label>
              <input type="radio" name="verificationMethod" value={"email"} {...register("verificationMethod")} required />Email
            </label>
            <label>
              <input type="radio" name="verificationMethod" value={"phone"} {...register("verificationMethod")} required />
              Phone    </label>
          </div>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>


  </>;
};

export default Register;
