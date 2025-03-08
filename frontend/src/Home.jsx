import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUsers, FaPalette } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-8">
        <div className="mx-auto max-w-4xl py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-6xl font-bold tracking-tight sm:text-8xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent animate-gradient">
              MakeMyPlan
            </h1>
            <p className="mt-4 text-2xl leading-8 text-foreground/80">
              Track your Schedule with Easy Handling
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Link to="/get-started">
                <button className="rounded-md bg-primary px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 flex items-center gap-2">
                  Get Started <BsArrowRight className="inline-block" />
                </button>
              </Link>
              <Link to="/signin">
                <button className="rounded-md px-6 py-3 text-lg font-semibold border-2 border-foreground/20 hover:bg-foreground/10 transition-all duration-300">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Why Choose MakeMyPlan?
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/70">
              Streamline your daily schedule and boost productivity with our
              intuitive planning tools
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center">
                <dt className="text-xl font-semibold leading-7 flex items-center gap-2">
                  <FaCalendarAlt className="text-3xl text-primary" />
                  Smart Scheduling
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-foreground/70">
                  <p>
                    Intelligent algorithms that help you optimize your daily
                    routine and maximize productivity.
                  </p>
                </dd>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center">
                <dt className="text-xl font-semibold leading-7 flex items-center gap-2">
                  <FaUsers className="text-3xl text-primary" />
                  Easy Collaboration
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-foreground/70">
                  <p>
                    Share and coordinate schedules with team members
                    effortlessly.
                  </p>
                </dd>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center">
                <dt className="text-xl font-semibold leading-7 flex items-center gap-2">
                  <FaPalette className="text-3xl text-primary" />
                  Customizable Views
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-foreground/70">
                  <p>
                    Personalize your planning experience with flexible viewing
                    options and themes.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
