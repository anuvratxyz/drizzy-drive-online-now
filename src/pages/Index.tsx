
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
  // External link to Google sign-in for demo purposes
  const handleGoogleAuth = () => {
    window.open('https://accounts.google.com', '_blank');
    console.log('Google auth initiated from homepage');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/ee38cfc0-ebe4-4186-a0df-433076c7fd18.png" 
              alt="Drizzy Logo Small" 
              className="h-16 w-16 object-contain"
            />
            <h1 className="text-5xl font-bold leading-tight">
              Drizzy Drive
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Expert online lectures and professional in-person instruction to help you become a safe, confident driver.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Browse Courses
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600">
              Book an Instructor
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-green-600 text-green-600 flex items-center gap-2"
              onClick={handleGoogleAuth}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>
        <div className="hidden md:block bg-gray-800 rounded-xl h-[500px] relative">
          <img 
            src="/lovable-uploads/d5fff598-e8fe-4d9c-b224-c397cd7b9638.png" 
            alt="Drizzy Logo Large" 
            className="absolute inset-0 w-full h-full object-contain p-12"
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
            videoUrl="https://youtu.be/sEJQltBeaAI?si=UoYnnXggM6KmJ1sA"
            videos={[
              {
                title: "1. Highway Driving Fundamentals",
                url: "https://youtu.be/sEJQltBeaAI?si=UoYnnXggM6KmJ1sA"
              }
            ]}
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
