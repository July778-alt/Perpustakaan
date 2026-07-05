"use client";

import { AppSidebar_public } from "@/components/app-sidebar-public"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import { getAllBooks } from "@/lib/action";
import { useState, useEffect, useTransition } from "react";
import { SearchForm } from "@/components/search-form-public";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  BookOpen, 
  User, 
  Calendar
} from "lucide-react";

export default function HomePage(){
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login"});
  }

  useEffect(() => {
    startTransition(async () => {
      const data = await getAllBooks();
      setBooks(data);
    });
  }, []);

  const filteredBooks = books.filter((book) => {
    const keyword = search.toLowerCase();
    return (
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword) ||
      book.publisher.toLowerCase().includes(keyword)
    );
  });

  const availableBooks = books.filter(b => b.stock > 0).length;
  const totalStock = books.reduce((sum, book) => sum + book.stock, 0);

  return(
    <SidebarProvider>
      <AppSidebar_public user={session?.user} />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b h-16 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-start justify-start gap-4">
            <SidebarTrigger />
          </div>
          
          <div className="flex items-center gap-3 w-100">
            <div className="hidden md:block w-full">
              <SearchForm
                onSearchChange={setSearch} 
                books={books}
                showSuggestions={true}
              />
            </div>
          </div>

          <div className=""></div>
        </header>

        <main className="p-6 bg-gray-50 min-h-screen">
          {/* Search Bar Mobile */}
          <div className="md:hidden mb-6">
            <SearchForm
              onSearchChange={setSearch} 
              books={books}
              showSuggestions={true}
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Browse Books</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
              </p>
            </div>
          </div>

          {/* Empty State */}
          {filteredBooks.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-500">Try adjusting your search to find what you're looking for</p>
            </div>
          )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredBooks.map((book) => (
            <Link 
              key={book.id_books} 
              href={`/books/${book.id_books}`}
              className="group block cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-3/4 relative overflow-hidden bg-gray-100">
                <img 
                  src={book.image || "/book-placeholder.jpg"} 
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Stock Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-lg ${
                    book.stock > 0 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {book.stock > 0 ? `${book.stock} left` : 'Out of stock'}
                  </span>
                </div>

                {/* Hover Info */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-1.5 text-xs">
                      <User className="h-3 w-3" />
                      <span className="line-clamp-1">{book.author}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>{book.year_published}</span>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full mt-2 bg-white text-blue-600 hover:bg-blue-50 cursor-auto"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Book Info */}
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-1 text-gray-900 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
              </div>
            </Link>
          ))}
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}