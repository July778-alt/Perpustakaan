"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { getAllBooks } from "@/lib/action";

export default function LandingPage() {
  const [isPending, startTransition] = useTransition();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    startTransition(async () => {
      const data = await getAllBooks();
      setBooks(data);
    });
    }, []);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">Livra</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-md font-medium"
                >
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-20 h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&h=1080&fit=crop')",
          }}
        >

          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Find and Borrow Books More Conveniently.
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              All available in a clean and easy-to-use interface.
            </p>
            <Link href="/login">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-6 text-lg rounded-md font-medium"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Books</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.slice(0, 4).map((book) => (
              <Link key={book.id_books} href="/login">
                <div className="group cursor-pointer">
                  <div className="relative aspect-2/3 rounded-lg overflow-hidden shadow-lg mb-4 bg-gray-100">
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/login">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-12 py-6 text-lg rounded-md font-medium"
              >
                View All Books
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-black text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Livra</h3>
              <p className="text-sm leading-relaxed">
                Empowering education through digital library management
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Features</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Pricing</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">FAQ</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Documentation</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Help Center</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 Livra</p>
          </div>
        </div>
      </footer>
    </div>
  );
}