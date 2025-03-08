import React, { useState } from "react";
import { Input, Button, RadioGroup, Radio, Calendar } from "@heroui/react";
import { FaBook, FaCalendar, FaClock, FaGraduationCap } from "react-icons/fa";
import { parseDate } from "@internationalized/date";
import axios from "axios";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    topic: "",
    numberOfWeeks: "",
    difficultyLevel: "beginner",
    startDate: new Date().toISOString().split("T")[0],
  });

  const [showStartCalendar, setShowStartCalendar] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      startDate: new Date(date).toISOString().split("T")[0],
    }));
    setShowStartCalendar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/categories", formData);
      console.log("Category added successfully:", response.data);
      setFormData({
        topic: "",
        numberOfWeeks: "",
        difficultyLevel: "beginner",
        startDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <main className="dark text-foreground bg-background min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-lg p-8 border border-border">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FaBook className="text-primary text-2xl" />
          Create Learning Path
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <FaGraduationCap className="text-primary" />
              Topic Name
            </label>
            <Input
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="Enter topic name"
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
              name="numberOfWeeks"
              type="number"
              min="1"
              value={formData.numberOfWeeks}
              onChange={handleInputChange}
              placeholder="Enter number of weeks"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <FaGraduationCap className="text-primary" />
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-4">
              {["beginner", "moderate", "advanced"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, difficultyLevel: level }))
                  }
                  className={`p-3 rounded-lg border transition-all duration-200 capitalize ${
                    formData.difficultyLevel === level
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
            Create Your Learning Path
          </Button>
        </form>
      </div>
    </main>
  );
};

export default AddCategory;
