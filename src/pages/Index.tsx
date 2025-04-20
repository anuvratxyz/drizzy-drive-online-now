import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { 
  BookOpenIcon, 
  CarIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  TrophyIcon, 
  CarFrontIcon,
  PlayIcon
} from 'lucide-react';

const extractYoutubeVideoId = (url?: string): string | null => {
  if (!url) return null;
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[7].length === 11) ? match[7] : null;
};

const CourseCard = ({ 
  title, 
  description, 
  duration, 
  level,
  videoUrl,
  videos
}: { 
  title: string, 
  description: string, 
  duration: string, 
  level: string,
  videoUrl?: string,
  videos?: { title: string; url: string }[]
}) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(videoUrl);
  const videoId = extractYoutubeVideoId(selectedVideo);
  
  return (
    <div className="bg-[#1A2330] rounded-xl p-6 space-y-4 transform transition-all hover:scale-105">
      <div className="flex justify-between items-center">
        <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full">
          {level}
        </span>
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
      <div className="flex justify-end text-gray-500 text-sm">
        <span>⏱️ {duration}</span>
      </div>
      
      {!showVideo ? (
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => setShowVideo(true)}
        >
          Watch Lectures
        </Button>
      ) : (
        <div className="space-y-4">
          {videos && (
            <div className="grid gap-2">
              {videos.map((video, index) => (
                <Button
                  key={index}
                  variant={selectedVideo === video.url ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedVideo(video.url);
                    setIsPlaying(false);
                  }}
                >
                  {video.title}
                </Button>
              ))}
            </div>
          )}
          
          {videoId && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg group">
              {!isPlaying ? (
                <div 
                  className="relative cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
                    <PlayIcon className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              )}
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setShowVideo(false);
              setIsPlaying(false);
            }}
          >
            Back to Course
          </Button>
        </div>
      )}
    </div>
  );
};

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
      <Navbar />
      
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
        <div className="hidden md:block bg-gray-800 rounded-xl h-[500px] flex items-center justify-center">
          <img 
            src="/lovable-uploads/8af09a51-b0b9-48cc-9b22-005b75d1f2f8.png" 
            alt="Driving Lesson" 
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>
      </div>

      {/* Courses Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Driving Courses</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <CourseCard 
            title="Beginner's Driving Course" 
            description="Perfect for first-time drivers. Covers all the basics of vehicle operation and road safety."
            duration="6 weeks"
            level="Beginner"
            videoUrl="https://youtu.be/5ojncFo1HNk?si=n_g4nGbg1mJFBquL"
            videos={[
              { 
                title: "1. Introduction to Driving",
                url: "https://youtu.be/5ojncFo1HNk?si=n_g4nGbg1mJFBquL"
              },
              {
                title: "2. Basic Vehicle Controls",
                url: "https://youtu.be/ippjq7-QMS8?si=n2Ivr1nlaWHT9_ea"
              },
              {
                title: "3. Road Signs and Traffic Rules",
                url: "https://youtu.be/tlxPjW5QSOA?si=prBx2eEiXdN4x-Zu"
              },
              {
                title: "4. Parking Techniques",
                url: "https://youtu.be/SqzF8LfYQS4?si=J70HQ4j7rp5IU_3j"
              }
            ]}
          />
          <CourseCard 
            title="Defensive Driving" 
            description="Learn advanced techniques to anticipate and avoid dangerous situations on the road."
            duration="4 weeks"
            level="Intermediate"
            videoUrl="https://youtu.be/K11S1S4C1qA?si=OVG3Hqrkk0XeZ_hl"
            videos={[
              {
                title: "1. Introduction to Defensive Driving",
                url: "https://youtu.be/K11S1S4C1qA?si=OVG3Hqrkk0XeZ_hl"
              }
            ]}
          />
          <CourseCard 
            title="Highway Driving Mastery" 
            description="Build confidence for highway driving with specialized techniques and safety practices."
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
