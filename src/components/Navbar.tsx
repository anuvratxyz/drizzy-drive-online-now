import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, UserIcon } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'sign-in' | 'sign-up'>('sign-in');
  const { user, logout, isAuthenticated } = useUser();
  const { toast } = useToast();

  const openSignIn = () => {
    setAuthModalTab('sign-in');
    setAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthModalTab('sign-up');
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return user?.email?.[0]?.toUpperCase() || 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
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
                <Link to="/courses" className="text-sm font-medium transition-colors hover:text-primary">
                  Courses
                </Link>
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
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={openSignIn}>
                Sign In
              </Button>
              <Button onClick={openSignUp}>
                Sign Up
              </Button>
            </>
          )}
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
