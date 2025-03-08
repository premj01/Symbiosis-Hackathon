import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format, addWeeks } from "date-fns";
import { FaBook, FaCalendar } from "react-icons/fa";
import axios from "axios";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    topic: "",
    numberOfWeeks: "",
    difficultyLevel: "beginner",
    startDate: new Date(),
  });

  const [endDate, setEndDate] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calculate end date when number of weeks changes
    if (name === "numberOfWeeks" && value > 0) {
      const calculatedEndDate = addWeeks(formData.startDate, parseInt(value));
      setEndDate(calculatedEndDate);
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      startDate: date,
    }));

    if (formData.numberOfWeeks) {
      const calculatedEndDate = addWeeks(
        date,
        parseInt(formData.numberOfWeeks)
      );
      setEndDate(calculatedEndDate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/categories", {
        ...formData,
        endDate,
      });
      console.log("Category added successfully:", response.data);
      // Add success notification or redirect logic here
    } catch (error) {
      console.error("Error adding category:", error);
      // Add error handling logic here
    }
  };

  return (
    <main className="dark text-foreground bg-background min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaBook className="text-primary" />
          Add New Learning Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic Name</Label>
            <Input
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="Enter topic name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfWeeks">Number of Weeks</Label>
            <Input
              id="numberOfWeeks"
              name="numberOfWeeks"
              type="number"
              min="1"
              value={formData.numberOfWeeks}
              onChange={handleInputChange}
              placeholder="Enter number of weeks"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <RadioGroup
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, difficultyLevel: value }))
              }
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner">Beginner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">Advanced</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FaCalendar />
                Start Date
              </Label>
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={handleDateChange}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FaCalendar />
                End Date (Calculated)
              </Label>
              <div className="p-4 rounded-md border bg-muted">
                {endDate
                  ? format(endDate, "PPP")
                  : "Select start date and weeks"}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Your Plan
          </Button>
        </form>
      </div>
    </main>
  );
};

export default AddCategory;
