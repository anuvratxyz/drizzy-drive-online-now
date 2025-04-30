
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsList, Tabs, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CalendarIcon, ClockIcon, BookOpenIcon } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  lessons: number;
  videoUrl: string;
  image: string;
  category: string;
}

const coursesData: Course[] = [
  {
    id: 1,
    title: "Beginner's Driving Course",
    description: "Perfect for first-time drivers. Covers all the basics of vehicle operation and road safety.",
    level: "Beginner",
    duration: "6 weeks",
    lessons: 12,
    videoUrl: "https://youtu.be/5ojncFo1HNk",
    image: "/lovable-uploads/d5fff598-e8fe-4d9c-b224-c397cd7b9638.png",
    category: "basics"
  },
  {
    id: 2,
    title: "Defensive Driving",
    description: "Learn advanced techniques to anticipate and avoid dangerous situations on the road.",
    level: "Intermediate",
    duration: "4 weeks",
    lessons: 8,
    videoUrl: "https://youtu.be/K11S1S4C1qA",
    image: "/lovable-uploads/d5fff598-e8fe-4d9c-b224-c397cd7b9638.png",
    category: "advanced"
  },
  {
    id: 3,
    title: "Highway Driving Mastery",
    description: "Build confidence for highway driving with specialized techniques and safety practices.",
    level: "Intermediate",
    duration: "3 weeks",
    lessons: 6,
    videoUrl: "https://youtu.be/sEJQltBeaAI",
    image: "/lovable-uploads/d5fff598-e8fe-4d9c-b224-c397cd7b9638.png",
    category: "advanced"
  },
  {
    id: 4,
    title: "Parallel Parking Made Easy",
    description: "Master the art of parallel parking with step-by-step instructions and practice techniques.",
    level: "Beginner",
    duration: "2 weeks",
    lessons: 4,
    videoUrl: "https://youtu.be/SqzF8LfYQS4",
    image: "/lovable-uploads/d5fff598-e8fe-4d9c-b224-c397cd7b9638.png",
    category: "basics"
  },
  {
    id: 5,
    title: "Night Driving Essentials",
    description: "Learn how to safely navigate and handle different conditions during night driving.",
    level: "Intermediate",
    duration: "2 weeks",
    lessons: 4,
    videoUrl: "https://youtu.be/sEJQltBeaAI",
    image: "/lovable-uploads/d5fff598-e8fe-4d9c-b224-c397cd7b9638.png",
    category: "advanced"
  },
  {
    id: 6,
    title: "Winter Driving Safety",
    description: "Essential techniques for maintaining control and staying safe in snow, ice, and other winter conditions.",
    level: "Advanced",
    duration: "3 weeks",
    lessons: 6,
    videoUrl: "https://youtu.be/K11S1S4C1qA",
    image: "/lovable-uploads/d5fff598-e8fe-4d9c-b224-c397cd7b9638.png",
    category: "specialized"
  }
];

const CourseCard = ({ course }: { course: Course }) => (
  <div className="bg-[#1A2330] rounded-xl overflow-hidden transform transition-all hover:scale-105">
    <div className="h-40 relative overflow-hidden">
      <img 
        src={course.image} 
        alt={course.title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute top-3 right-3">
        <Badge className="bg-blue-600 hover:bg-blue-700">{course.level}</Badge>
      </div>
    </div>
    <div className="p-6 space-y-4">
      <h3 className="text-xl font-bold text-white">{course.title}</h3>
      <p className="text-gray-400">{course.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center">
          <BookOpenIcon className="w-4 h-4 mr-1" />
          <span>{course.lessons} lessons</span>
        </div>
      </div>
      <Button className="w-full">Enroll Now</Button>
    </div>
  </div>
);

const Courses = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Driving Courses</h1>
          <p className="text-gray-400 text-center max-w-2xl">
            Browse through our comprehensive selection of driving courses designed to help you become a safe, confident driver.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="specialized">Specialized</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid md:grid-cols-3 gap-8">
              {coursesData.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="basics" className="mt-0">
            <div className="grid md:grid-cols-3 gap-8">
              {coursesData
                .filter((course) => course.category === 'basics')
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-0">
            <div className="grid md:grid-cols-3 gap-8">
              {coursesData
                .filter((course) => course.category === 'advanced')
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="specialized" className="mt-0">
            <div className="grid md:grid-cols-3 gap-8">
              {coursesData
                .filter((course) => course.category === 'specialized')
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Courses;
