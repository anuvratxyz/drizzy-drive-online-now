
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import AuthModal from './AuthModal';

const Navbar = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'sign-in' | 'sign-up'>('sign-in');

  const openSignIn = () => {
    setAuthModalTab('sign-in');
    setAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthModalTab('sign-up');
    setAuthModalOpen(true);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/ee38cfc0-ebe4-4186-a0df-433076c7fd18.png" 
              alt="Drizzy Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold">Drizzy</span>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <div className="grid gap-1">
                      <h4 className="font-medium leading-none">Driving Courses</h4>
                      <p className="text-sm text-muted-foreground">
                        Browse our comprehensive driving courses
                      </p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/book-instructor" className="text-sm font-medium transition-colors hover:text-primary">
                  Book Instructor
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <div className="grid gap-1">
                      <h4 className="font-medium leading-none">Learning Resources</h4>
                      <p className="text-sm text-muted-foreground">
                        Access study materials and guides
                      </p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
                  About Us
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={openSignIn}>
            Sign In
          </Button>
          <Button onClick={openSignUp}>
            Sign Up
          </Button>
        </div>
      </div>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
        defaultTab={authModalTab} 
      />
    </nav>
  );
};

export default Navbar;
