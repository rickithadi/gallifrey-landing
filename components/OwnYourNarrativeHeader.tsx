import { ArrowLeft, Menu, X } from "lucide-react";

import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";

interface OwnYourNarrativeHeaderProps {
  variant?: "transparent" | "solid" | "blur";
}

export function OwnYourNarrativeHeader({ variant = "blur" }: OwnYourNarrativeHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerClasses = {
    transparent: "bg-transparent",
    solid: "bg-white shadow-sm",
    blur: "bg-white/80 backdrop-blur-md border-b border-gray-100",
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClasses[variant]}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Back to Main Site */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-oyn-orange-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline text-sm font-medium">Back to Gallifrey</span>
            </Link>

            {/* Logo/Brand for Own Your Narrative */}
            <div className="ml-4 pl-4 border-l border-gray-200">
              <Link href="/own-your-narrative" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-oyn-orange-600 to-oyn-orange-500 rounded-lg"></div>
                <span className="font-semibold text-gray-900 hidden sm:inline">Own Your Narrative</span>
              </Link>
            </div>
          </div>

          {/* Right: Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#services" className="text-gray-600 hover:text-oyn-orange-600 transition-colors text-sm font-medium">
              Services
            </Link>
            <Link href="#process" className="text-gray-600 hover:text-oyn-orange-600 transition-colors text-sm font-medium">
              Process
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-oyn-orange-600 transition-colors text-sm font-medium">
              Contact
            </Link>
            <Button className="bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white px-6 py-2 rounded-lg">
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-oyn-orange-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="#services"
                className="text-gray-600 hover:text-oyn-orange-600 transition-colors text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#process"
                className="text-gray-600 hover:text-oyn-orange-600 transition-colors text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Process
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-oyn-orange-600 transition-colors text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Button className="bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white w-full py-3 rounded-lg mt-2">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
