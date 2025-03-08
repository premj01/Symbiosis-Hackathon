import React, { useState, useContext } from "react";
import { Form, Input, Button, Card } from "@heroui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "./contextProvider/AuthContext";

const BACKEND_URL = "http://localhost:9000";

const OTPValidationPage = () => {
  const { isLogin, setisLogin } = useContext(AuthenticationContext);

  const [error, setError] = useState(null);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const secCode = localStorage.getItem("tempSecCode");
    if (!secCode) {
      setError("Session expired. Please register again.");
      localStorage.clear();
      navigate("/signup");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/register/otp`, {
        otp,
        SecCode: secCode,
      });

      // Store the new SecCode and remove the temporary one
      localStorage.removeItem("tempSecCode");
      if (response.data.SecCode) {
        localStorage.setItem("authToken", response.data.SecCode);

        setisLogin(true);
        navigate("/home");
      }
    } catch (error) {
      setisLogin(false);
      console.error("OTP verification failed:", error);
      setError(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
      alert("SignUp failed please try again");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4 bg-gradient-to-br from-background/50 to-background">
      <Card className="w-full max-w-md p-8 space-y-8 backdrop-blur-md bg-background/60 border border-default-200 shadow-2xl rounded-3xl">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Verify OTP
          </h2>
          <p className="text-sm text-default-500">
            Enter the OTP sent to your email
          </p>
        </div>

        <Form className="space-y-8 w-full" onSubmit={handleSubmit}>
          <div className="space-y-5 w-full">
            <Input
              isRequired
              label="OTP"
              labelPlacement="outside"
              placeholder="Enter OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full font-medium shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700"
            size="lg"
            radius="xl"
          >
            Verify OTP
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default OTPValidationPage;
