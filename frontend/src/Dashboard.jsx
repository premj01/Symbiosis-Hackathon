import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Progress,
  Button,
  Chip,
  Divider,
  Spinner,
} from "@heroui/react";
import {
  FaBook,
  FaClock,
  FaChartLine,
  FaCalendarAlt,
  FaPlus,
  FaGraduationCap,
  FaCode,
} from "react-icons/fa";

// Local data structure
const localTopicsData = [
  {
    id: "1",
    topicName: "React Fundamentals",
    topicProgress: 75,
    topicDuration: 30,
    topicDifficulty: "Intermediate",
    topicEndDate: "2024-04-30",
    lastUpdated: "2024-03-15",
    totalLessons: 24,
    completedLessons: 18,
  },
  {
    id: "2",
    topicName: "Node.js Basics",
    topicProgress: 45,
    topicDuration: 20,
    topicDifficulty: "Beginner",
    topicEndDate: "2024-05-15",
    lastUpdated: "2024-03-14",
    totalLessons: 20,
    completedLessons: 9,
  },
  {
    id: "3",
    topicName: "Advanced TypeScript",
    topicProgress: 25,
    topicDuration: 40,
    topicDifficulty: "Advanced",
    topicEndDate: "2024-06-01",
    lastUpdated: "2024-03-13",
    totalLessons: 30,
    completedLessons: 7,
  },
];

const Dashboard = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with setTimeout
    const fetchTopics = () => {
      setTimeout(() => {
        const transformedData = localTopicsData.map((topic) => ({
          ...topic,
          topicEndDate: new Date(topic.topicEndDate),
        }));
        setTopics(transformedData);
        setIsLoading(false);
      }, 1000); // 1 second delay to simulate loading
    };

    fetchTopics();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "danger";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <main className="dark text-foreground bg-background min-h-screen py-8">
        <div className="container mx-auto px-4 w-[80%] flex flex-col items-center justify-center h-[60vh]">
          <Spinner size="lg" color="primary" />
          <p className="text-default-400 mt-4">
            Loading your learning dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="dark text-foreground bg-background min-h-screen py-8">
      <div className="container mx-auto px-4 w-[80%]">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaGraduationCap className="text-primary" />
              Learning Dashboard
            </h1>
            <p className="text-small text-default-400">
              Track your learning progress and goals
            </p>
          </div>
          <div className="text-small text-default-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
        <Divider className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Card key={topic.id} className="max-w-full">
              <CardHeader className="flex gap-3">
                <div className="p-2 bg-default-100 rounded-lg">
                  <FaCode className="text-xl text-primary" />
                </div>
                <div className="flex flex-col">
                  <p className="text-md font-semibold">{topic.topicName}</p>
                  <Chip
                    size="sm"
                    color={getDifficultyColor(topic.topicDifficulty)}
                    variant="flat"
                    startContent={<FaBook className="text-xs" />}
                  >
                    {topic.topicDifficulty}
                  </Chip>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="py-4">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-small text-default-400">
                        Progress ({topic.completedLessons}/{topic.totalLessons}{" "}
                        lessons)
                      </span>
                      <span className="text-small text-default-400">
                        {topic.topicProgress}%
                      </span>
                    </div>
                    <Progress
                      aria-label="Progress"
                      size="md"
                      value={topic.topicProgress}
                      color={
                        topic.topicProgress >= 75
                          ? "success"
                          : topic.topicProgress >= 40
                          ? "warning"
                          : "primary"
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-default-400">
                      <FaClock />
                      <span className="text-small">
                        {topic.topicDuration} days duration
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-default-400">
                      <FaCalendarAlt />
                      <span className="text-small">
                        Due: {topic.topicEndDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
              <Divider />
              <CardFooter>
                <Button
                  color="primary"
                  variant="light"
                  size="sm"
                  className="w-full"
                >
                  Continue Learning
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Create New Plan Card */}
          <Card className="max-w-full border-2 border-dashed border-primary">
            <CardBody className="flex flex-col items-center justify-center py-12 gap-4">
              <Button
                isIconOnly
                color="primary"
                variant="light"
                size="lg"
                className="text-3xl rounded-full"
              >
                <FaPlus />
              </Button>
              <div className="text-center">
                <p className="text-primary font-semibold">Create New Plan</p>
                <p className="text-small text-default-400">
                  Add a new learning topic
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
