
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BookOpenIcon, 
  CarIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  TrophyIcon, 
  CarFrontIcon 
} from 'lucide-react';

const CourseCard = ({ 
  title, 
  description, 
  lessons, 
  duration, 
  level 
}: { 
  title: string, 
  description: string, 
  lessons: number, 
  duration: string, 
  level: string 
}) => (
  <div className="bg-[#1A2330] rounded-xl p-6 space-y-4 transform transition-all hover:scale-105">
    <div className="flex justify-between items-center">
      <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full">
        {level}
      </span>
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
    <div className="flex justify-between text-gray-500 text-sm">
      <span>📖 {lessons} lessons</span>
      <span>⏱️ {duration}</span>
    </div>
    <Button variant="default" className="w-full">View Course</Button>
  </div>
);

const WhyChooseDrizzyCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <div className="bg-[#1A2330] rounded-xl p-6 text-center space-y-4 transform transition-all hover:scale-105">
    <div className="flex justify-center">
      <div className="bg-blue-600/20 p-4 rounded-full">
        <Icon className="text-blue-500 w-8 h-8" />
      </div>
    </div>
    <h3 className="text-lg font-bold text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/ee38cfc0-ebe4-4186-a0df-433076c7fd18.png" 
              alt="Drizzy Logo" 
              className="h-16 w-16 object-contain"
            />
            <h1 className="text-5xl font-bold leading-tight">
              Drizzy Drive
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Expert online lectures and professional in-person instruction to help you become a safe, confident driver.
          </p>
          <div className="flex space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Browse Courses
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600">
              Book an Instructor
            </Button>
          </div>
        </div>
        <div className="hidden md:block bg-gray-800 rounded-xl h-[500px]">
          {/* Placeholder for hero image */}
        </div>
      </div>

      {/* Courses Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Driving Courses</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <CourseCard 
            title="Beginner's Driving Course" 
            description="Perfect for first-time drivers. Covers all the basics of vehicle operation and road safety."
            lessons={12}
            duration="6 weeks"
            level="Beginner"
          />
          <CourseCard 
            title="Defensive Driving" 
            description="Learn advanced techniques to anticipate and avoid dangerous situations on the road."
            lessons={8}
            duration="4 weeks"
            level="Intermediate"
          />
          <CourseCard 
            title="Highway Driving Mastery" 
            description="Build confidence for highway driving with specialized techniques and safety practices."
            lessons={6}
            duration="3 weeks"
            level="Intermediate"
          />
        </div>
        <div className="text-center mt-12">
          <Button variant="default">View All Courses</Button>
        </div>
      </div>

      {/* Why Choose Drizzy Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Drizzy?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <WhyChooseDrizzyCard 
            icon={BookOpenIcon}
            title="Comprehensive Online Courses"
            description="Access detailed video lectures, interactive quizzes, and practice tests to master driving theory."
          />
          <WhyChooseDrizzyCard 
            icon={CarIcon}
            title="Professional Instructors"
            description="Learn from certified driving instructors with years of experience and excellent safety records."
          />
          <WhyChooseDrizzyCard 
            icon={CalendarIcon}
            title="Flexible Scheduling"
            description="Book driving lessons at times that work for you with our easy-to-use online scheduling system."
          />
          <WhyChooseDrizzyCard 
            icon={ShieldCheckIcon}
            title="Certified Program"
            description="Our curriculum meets all state requirements for driver education and certification."
          />
          <WhyChooseDrizzyCard 
            icon={TrophyIcon}
            title="High Pass Rates"
            description="Our students consistently achieve above-average pass rates on both written and practical driving tests."
          />
          <WhyChooseDrizzyCard 
            icon={CarFrontIcon}
            title="Modern Vehicles"
            description="Practice in well-maintained, dual-control vehicles equipped with the latest safety features."
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
