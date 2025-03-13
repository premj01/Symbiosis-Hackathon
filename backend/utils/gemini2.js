// Gemini-style study plan generator
// This file simulates an AI-powered study plan generation

/**
 * Generate a comprehensive, structured study plan for a given programming language
 * @param {Object} inputData - The input data containing email, lang, level, weeks, startDate
 * @returns {Object} - A structured study plan organized by weeks
 */
const generateStudyPlan = (inputData) => {
    const { email, lang, level, weeks, startDate } = inputData;
    
    // Validate input
    if (!email || !lang || !level || !weeks || !startDate) {
        throw new Error('Missing required parameters');
    }
    
    // Plan structure will hold the final plan
    const plan = {
        email,
        subject: lang,
        level,
        duration: weeks,
        startDate,
        totalModules: 0,
        overview: `${weeks}-week comprehensive ${lang} study plan for ${level} level`,
        planCreatedAt: new Date().toISOString()
    };
    
    // Add weekly structure based on language
    const topics = getLanguageTopics(lang, level);
    
    // Distribute topics across weeks
    const topicsPerWeek = Math.ceil(topics.length / weeks);
    let topicIndex = 0;
    
    for (let i = 1; i <= weeks; i++) {
        const weekTopics = [];
        const weekNumber = `week${i}`;
        
        // Assign topics for this week
        for (let j = 0; j < topicsPerWeek && topicIndex < topics.length; j++) {
            weekTopics.push(topics[topicIndex]);
            topicIndex++;
        }
        
        // Add resources and project ideas for this week
        const resources = generateResources(lang, weekTopics);
        const project = topicIndex > topics.length / 2 ? generateProjectIdea(lang, weekTopics) : null;
        
        plan[weekNumber] = {
            topics: weekTopics,
            resources: resources,
            project: project,
            quiz: true,
            estimatedHours: weekTopics.length * 3 // Rough estimate of hours needed
        };
    }
    
    plan.totalModules = topics.length;
    
    return plan;
};

/**
 * Get topics for a specific programming language based on level
 * @param {string} language - Programming language
 * @param {string} level - Skill level (beginner, intermediate, expert)
 * @returns {Array} - Array of relevant topics
 */
const getLanguageTopics = (language, level) => {
    const topics = {
        java: {
            beginner: [
                "Introduction to Java and setup",
                "Basic Syntax and Variables",
                "Control Flow: if-else, switch statements",
                "Loops: for, while, do-while",
                "Methods and Method Parameters",
                "Arrays and ArrayLists",
                "Object-Oriented Basics: Classes and Objects",
                "Constructors and Access Modifiers",
                "Inheritance",
                "Basic Exception Handling",
                "Simple File I/O",
                "Introduction to Collections Framework"
            ],
            intermediate: [
                "Advanced OOP: Abstract Classes and Interfaces",
                "Generics",
                "Collections Framework Deep Dive",
                "Exception Handling Best Practices",
                "File I/O and NIO",
                "Multithreading Basics",
                "Functional Programming with Lambdas",
                "Stream API",
                "Design Patterns: Singleton, Factory, Builder",
                "JDBC and Database Connectivity",
                "Unit Testing with JUnit",
                "Maven Build System",
                "Introduction to Spring Framework",
                "RESTful Web Services",
                "Working with JSON and XML"
            ],
            expert: [
                "Advanced Multithreading and Concurrency",
                "Java Memory Model",
                "Performance Optimization Techniques",
                "Reflection API",
                "Advanced Design Patterns",
                "Aspect-Oriented Programming",
                "Spring Boot Deep Dive",
                "Microservices Architecture",
                "Event-Driven Architecture",
                "Reactive Programming with Project Reactor",
                "JVM Internals and Tuning",
                "Advanced Testing: Integration, Performance",
                "CI/CD for Java Applications",
                "Security Best Practices",
                "Containerization with Docker",
                "Cloud Deployment"
            ]
        },
        python: {
            beginner: [
                "Python Installation and Setup",
                "Basic Syntax and Variables",
                "Control Flow: if-else statements",
                "Loops: for and while",
                "Functions",
                "Lists and Tuples",
                "Dictionaries and Sets",
                "String Manipulation",
                "File I/O Basics",
                "Exception Handling Basics",
                "Modules and Packages",
                "Introduction to OOP in Python"
            ],
            intermediate: [
                "Advanced Functions: Lambda, Map, Filter",
                "List Comprehensions",
                "Advanced OOP: Inheritance, Polymorphism",
                "Magic Methods",
                "Decorators",
                "Generators and Iterators",
                "Working with JSON and CSV",
                "Regular Expressions",
                "Virtual Environments",
                "Pip and Package Management",
                "Database Access with SQLite",
                "Introduction to Web Frameworks (Flask)",
                "API Requests with Requests library",
                "Testing with PyTest",
                "Introduction to Data Science Libraries"
            ],
            expert: [
                "Advanced Python Design Patterns",
                "Concurrency: Threading vs Multiprocessing",
                "Asyncio Programming",
                "Performance Optimization",
                "Memory Management",
                "Advanced Django",
                "REST API Development",
                "GraphQL in Python",
                "Microservices with Python",
                "Advanced Testing Strategies",
                "Python for Data Science: Advanced",
                "Machine Learning with Python",
                "DevOps for Python Applications",
                "Serverless Python",
                "Advanced Security Concepts",
                "Python in Cloud Environments"
            ]
        },
        javascript: {
            beginner: [
                "JavaScript Basics and Environment Setup",
                "Variables and Data Types",
                "Operators and Expressions",
                "Control Flow: if-else, switch",
                "Loops and Iteration",
                "Functions",
                "Arrays",
                "Objects",
                "DOM Manipulation Basics",
                "Events and Event Handling",
                "ES6+ Features: let/const, template literals",
                "Basic Form Validation"
            ],
            intermediate: [
                "Advanced Functions and Closures",
                "ES6+: Arrow Functions, Destructuring",
                "ES6+: Spread/Rest Operators, Default Parameters",
                "ES6+: Classes and Modules",
                "Asynchronous JavaScript: Callbacks, Promises",
                "Fetch API and AJAX",
                "Error Handling",
                "JSON Manipulation",
                "Local Storage and Session Storage",
                "Introduction to Node.js",
                "NPM and Package Management",
                "Introduction to a Framework (React or Vue basics)",
                "Responsive Web Design with JavaScript",
                "Basic Testing: Jest Introduction",
                "Build Tools: Webpack Basics"
            ],
            expert: [
                "Advanced Asynchronous Patterns: async/await",
                "JavaScript Design Patterns",
                "Performance Optimization",
                "Memory Management and Garbage Collection",
                "Functional Programming in JavaScript",
                "Advanced React or Vue",
                "State Management (Redux, Vuex)",
                "Server-Side Rendering",
                "TypeScript",
                "GraphQL",
                "Progressive Web Apps",
                "Microservices and API Architecture",
                "Testing: Unit, Integration, E2E",
                "Security Best Practices",
                "CI/CD for JavaScript Applications",
                "Containerization and Deployment"
            ]
        },
        cpp: {
            beginner: [
                "Introduction to C++ and Setup",
                "Basic Syntax and Structure",
                "Variables and Data Types",
                "Operators and Expressions",
                "Control Flow: if-else, switch",
                "Loops: for, while, do-while",
                "Functions",
                "Arrays and Strings",
                "Pointers Introduction",
                "Structures",
                "File I/O Basics",
                "Introduction to Classes and Objects"
            ],
            intermediate: [
                "Advanced OOP: Inheritance",
                "Polymorphism and Virtual Functions",
                "Function Overloading and Operator Overloading",
                "Templates",
                "Exception Handling",
                "STL Containers: vector, list, map",
                "STL Algorithms",
                "Memory Management",
                "Copy Constructors and Assignment Operators",
                "Smart Pointers",
                "Namespaces",
                "File I/O Advanced",
                "Multithreading Basics",
                "Introduction to CMake",
                "Unit Testing Basics"
            ],
            expert: [
                "Advanced STL Usage",
                "Custom Allocators",
                "Move Semantics and Perfect Forwarding",
                "RAII and Resource Management",
                "Template Metaprogramming",
                "Concurrency and Multithreading Advanced",
                "C++11/14/17/20 Features",
                "Design Patterns in C++",
                "Performance Optimization",
                "Memory Models and Atomics",
                "Embedded C++",
                "Game Development Concepts",
                "Interfacing with Other Languages",
                "Advanced Debugging Techniques",
                "Profiling and Benchmarking",
                "Advanced Project Architecture"
            ]
        }
    };
    
    // Default to JavaScript if language not found
    if (!topics[language]) {
        console.warn(`Language ${language} not found, defaulting to JavaScript`);
        language = 'javascript';
    }
    
    // Default to beginner if level not found
    if (!topics[language][level]) {
        console.warn(`Level ${level} not found, defaulting to beginner`);
        level = 'beginner';
    }
    
    return topics[language][level];
};

/**
 * Generate resource links for given topics
 * @param {string} language - Programming language
 * @param {Array} topics - Array of topics
 * @returns {Array} - Array of resource objects
 */
const generateResources = (language, topics) => {
    const resources = [];
    
    topics.forEach(topic => {
        // Generate simulated resources for each topic
        resources.push({
            title: `${topic} Tutorial`,
            type: 'article',
            url: `https://example.com/${language}/${topic.toLowerCase().replace(/\s+/g, '-')}`
        });
        
        // Add a video resource
        resources.push({
            title: `${topic} Video Explanation`,
            type: 'video',
            url: `https://video-tutorials.com/${language}/${topic.toLowerCase().replace(/\s+/g, '-')}`
        });
        
        // Add a practice resource for some topics
        if (Math.random() > 0.5) {
            resources.push({
                title: `${topic} Practice Exercises`,
                type: 'practice',
                url: `https://practice.dev/${language}/${topic.toLowerCase().replace(/\s+/g, '-')}/exercises`
            });
        }
    });
    
    return resources;
};

/**
 * Generate a project idea based on topics
 * @param {string} language - Programming language
 * @param {Array} topics - Array of topics
 * @returns {Object} - Project idea object
 */
const generateProjectIdea = (language, topics) => {
    // Sample project ideas for different languages
    const projectIdeas = {
        java: [
            "Build a REST API with Spring Boot",
            "Create a desktop application with JavaFX",
            "Develop a simple Android app",
            "Build a multi-threaded file processor",
            "Create a database application with JDBC"
        ],
        python: [
            "Build a web scraper",
            "Create a Flask web application",
            "Develop a data visualization dashboard",
            "Build a machine learning model",
            "Create a Discord bot"
        ],
        javascript: [
            "Build a single-page application",
            "Create a React component library",
            "Develop a Node.js REST API",
            "Build a real-time chat application",
            "Create a browser extension"
        ],
        cpp: [
            "Build a simple game engine",
            "Create a multi-threaded file compressor",
            "Develop a desktop application with Qt",
            "Build a custom data structure library",
            "Create a system monitoring tool"
        ]
    };
    
    // Default to JavaScript if language not found
    if (!projectIdeas[language]) {
        language = 'javascript';
    }
    
    // Get random project idea
    const randomIndex = Math.floor(Math.random() * projectIdeas[language].length);
    const projectTitle = projectIdeas[language][randomIndex];
    
    return {
        title: projectTitle,
        description: `A project to demonstrate your understanding of ${topics.join(', ')}`,
        difficulty: "moderate",
        estimatedHours: 8 + Math.floor(Math.random() * 10), // 8-17 hours
        resources: [
            {
                title: "Getting Started Guide",
                url: `https://example.com/projects/${projectTitle.toLowerCase().replace(/\s+/g, '-')}/guide`
            },
            {
                title: "Similar Project Example",
                url: `https://github.com/examples/${language}/${projectTitle.toLowerCase().replace(/\s+/g, '-')}`
            }
        ]
    };
};

module.exports = { generateStudyPlan }; 