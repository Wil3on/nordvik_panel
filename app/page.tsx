import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // Redirect to the login page for authenticated access
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Image
          src="/logo.svg"
          alt="Nordvik Panel"
          width={240}
          height={64}
          priority
          className="mb-8"
        />
        
        <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Nordvik Panel</h1>
        <p className="text-xl text-gray-400 mb-8 text-center max-w-2xl">
          The modern game server management solution for your gaming community
        </p>
        
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link 
            href="/login" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Create Account
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">Game Server Management</h3>
            <p className="text-gray-400">
              Easily install, configure, and manage game servers with our intuitive interface.
            </p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">Real-time Monitoring</h3>
            <p className="text-gray-400">
              Monitor server performance and player activity in real-time with detailed statistics.
            </p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">Cross-Platform Support</h3>
            <p className="text-gray-400">
              Support for both Windows and Linux servers with seamless integration.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="border-t border-gray-800 py-6 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p> {new Date().getFullYear()} Nordvik Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
