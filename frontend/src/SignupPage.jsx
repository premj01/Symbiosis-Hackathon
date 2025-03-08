import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Button, Card } from "@heroui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./LoginPage";

const BACKEND_URL = "http://localhost:9000";

const SignupPage = () => {
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = {
      username: usernameRef.current.value,
      mail: emailRef.current.value,
      password: passwordRef.current.value,
    };
    // console.log(formData);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/register`,
        formData
      );
      setSubmitted(response.data);

      // Store the SecCode in localStorage
      if (response.data.SecCode) {
        console.log(response.data);

        localStorage.setItem("tempSecCode", response.data.SecCode);
        localStorage.setItem("username", formData.username);
        localStorage.setItem("email", formData.mail);

        // Navigate to OTP validation page
        navigate("/otp_validate");
      }

      console.log("Registration initiated:", response.data);
    } catch (error) {
      console.error("Registration failed:", error);
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4 bg-gradient-to-br from-background/50 to-background">
      <Card className="w-full max-w-md p-8 space-y-8 backdrop-blur-md bg-background/60 border border-default-200 shadow-2xl rounded-3xl">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-sm text-default-500">
            Enter your details to sign up
          </p>
        </div>

        <Form className="space-y-8 w-full" onSubmit={handleSubmit}>
          <div className="space-y-5 w-full">
            <div className="w-full">
              <Input
                ref={usernameRef}
                isRequired
                label="Username"
                labelPlacement="outside"
                name="username"
                placeholder="Choose a username"
                type="text"
                variant="bordered"
                classNames={{
                  label: "text-default-600 text-sm font-medium mb-1",
                  input: [
                    "bg-transparent",
                    "border-default-200",
                    "hover:border-blue-500",
                    "focus:border-blue-500",
                    "transition-colors",
                    "placeholder:text-default-400",
                    "text-default-800",
                    "py-3",
                    "w-full",
                  ],
                  innerWrapper: "w-full",
                  inputWrapper: [
                    "bg-default-100/50",
                    "hover:bg-default-200/50",
                    "transition-colors",
                    "duration-200",
                    "rounded-2xl",
                    "w-full",
                    "shadow-inner",
                    "border-1",
                  ],
                  base: "w-full",
                  mainWrapper: "w-full",
                }}
              />
            </div>
            <br />
            <div className="w-full">
              <Input
                ref={emailRef}
                isRequired
                errorMessage="Please enter a valid email"
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Enter your email"
                type="email"
                variant="bordered"
                classNames={{
                  label: "text-default-600 text-sm font-medium mb-1",
                  input: [
                    "bg-transparent",
                    "border-default-200",
                    "hover:border-blue-500",
                    "focus:border-blue-500",
                    "transition-colors",
                    "placeholder:text-default-400",
                    "text-default-800",
                    "py-3",
                    "w-full",
                  ],
                  innerWrapper: "w-full",
                  inputWrapper: [
                    "bg-default-100/50",
                    "hover:bg-default-200/50",
                    "transition-colors",
                    "duration-200",
                    "rounded-2xl",
                    "w-full",
                    "shadow-inner",
                    "border-1",
                  ],
                  base: "w-full",
                  mainWrapper: "w-full",
                }}
              />
            </div>
            <br />
            <div className="w-full">
              <Input
                ref={passwordRef}
                isRequired
                label="Password"
                labelPlacement="outside"
                name="password"
                placeholder="Create a password"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                classNames={{
                  label: "text-default-600 text-sm font-medium mb-1",
                  input: [
                    "bg-transparent",
                    "border-default-200",
                    "hover:border-blue-500",
                    "focus:border-blue-500",
                    "transition-colors",
                    "placeholder:text-default-400",
                    "text-default-800",
                    "py-3",
                    "w-full",
                  ],
                  innerWrapper: "w-full",
                  inputWrapper: [
                    "bg-default-100/50",
                    "hover:bg-default-200/50",
                    "transition-colors",
                    "duration-200",
                    "rounded-2xl",
                    "w-full",
                    "shadow-inner",
                    "border-1",
                  ],
                  base: "w-full",
                  mainWrapper: "w-full",
                }}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full font-medium shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700"
            size="lg"
            radius="xl"
          >
            Sign Up
          </Button>

          {submitted && (
            <div className="text-small text-default-500 mt-6 p-4 rounded-xl bg-default-100/50 backdrop-blur-sm">
              You submitted:{" "}
              <code className="text-default-600 font-mono bg-default-200/50 px-1 py-0.5 rounded">
                {JSON.stringify(submitted)}
              </code>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default SignupPage;
