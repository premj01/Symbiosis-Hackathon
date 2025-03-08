import React, { useState } from "react";
import { Input, Button, Calendar } from "@heroui/react";
import { FaBook, FaCalendar, FaClock, FaCode } from "react-icons/fa";
import { parseDate } from "@internationalized/date";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lang: "",
    weeks: "",
    level: "base",
    startDate: new Date().toISOString().split("T")[0],
  });

  const [error, setError] = useState("");
  const [showStartCalendar, setShowStartCalendar] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when input changes
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      startDate: new Date(date).toISOString().split("T")[0],
    }));
    setShowStartCalendar(false);
    setError(""); // Clear error when date changes
  };

  const validateForm = () => {
    if (!formData.lang.trim()) {
      setError("Programming language is required");
      return false;
    }

    const weeks = parseInt(formData.weeks);
    if (!weeks || weeks < 1 || weeks > 52) {
      setError("Weeks must be between 1 and 52");
      return false;
    }

    const startDate = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setError("Start date must be in the future");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      const email = localStorage.getItem("email");

      if (!authToken || !email) {
        setError("Authentication information missing. Please login again.");
        return;
      }

      const requestData = {
        email: email,
        lang: formData.lang.trim(),
        level: formData.level,
        weeks: parseInt(formData.weeks),
        startDate: formData.startDate,
      };

      const response = await axios.post(
        "http://localhost:9000/api/preferences",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Study plan created successfully:", response.data);

      localStorage.setItem("lang", requestData.lang);
      localStorage.setItem("level", requestData.level);

      navigate("/ask_questions");
    } catch (error) {
      console.error("Error creating study plan:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create study plan. Please try again."
      );
    }
  };

  return (
    <main className="dark text-foreground bg-background min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-lg p-8 border border-border">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FaBook className="text-primary text-2xl" />
          Create Study Plan
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <FaCode className="text-primary" />
              Programming Language
            </label>
            <Input
              name="lang"
              value={formData.lang}
              onChange={handleInputChange}
              placeholder="Enter programming language"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <FaClock className="text-primary" />
              Duration (Weeks)
            </label>
            <Input
              name="weeks"
              type="number"
              min="1"
              max="52"
              value={formData.weeks}
              onChange={handleInputChange}
              placeholder="Enter number of weeks (1-52)"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <FaCode className="text-primary" />
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-4">
              {["base", "intermediate", "advance"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, level: level }))
                  }
                  className={`p-3 rounded-lg border transition-all duration-200 capitalize ${
                    formData.level === level
                      ? "bg-primary border-primary-focus text-primary-foreground"
                      : "bg-card border-border hover:border-primary"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <FaCalendar className="text-primary" />
              Start Date
            </label>
            <div className="relative">
              <Button
                onClick={() => setShowStartCalendar(!showStartCalendar)}
                type="button"
                className={`w-full justify-start text-left ${
                  showStartCalendar ? "border-primary" : ""
                }`}
              >
                {new Date(formData.startDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Button>
              {showStartCalendar && (
                <div className="absolute z-10 mt-2 bg-popover border border-border shadow-xl rounded-lg">
                  <Calendar
                    aria-label="Start Date"
                    value={parseDate(formData.startDate)}
                    onChange={handleDateChange}
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-lg font-medium shadow-lg transition-all duration-200"
          >
            Create Study Plan
          </Button>
        </form>
      </div>
    </main>
  );
};

export default AddCategory;
