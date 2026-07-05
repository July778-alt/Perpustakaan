"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getBookById, requestBorrow } from "@/lib/action";
import { AppSidebar_public } from "@/components/app-sidebar-public";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, BookOpen, User, Building, Calendar, 
  Package, Clock, X, CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        const data = await getBookById(params.id);
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchBook();
    }
  }, [params.id]);

  const handleRequestBorrow = async () => {
    if (!session?.user?.id) {
      alert("Please login first to borrow books");
      router.push("/login");
      return;
    }

    setIsRequesting(true);
    try {
      await requestBorrow(session.user.id, book.id_books);
      setShowConfirmPopup(false);
      setShowSuccessPopup(true);
      
      setTimeout(() => {
        setShowSuccessPopup(false);
        router.push("/my-borrowings");
      }, 3000);
    } catch (error) {
      console.error("Error requesting borrow:", error);
      alert("Failed to request borrow. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
          <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or may have been removed.</p>
          <Link href="/home">
            <Button className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              Back to Library
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar_public user={session?.user} />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b h-16 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Link href="/home">
              <Button variant="ghost" size="sm" className="group hover:bg-emerald-50 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Library
              </Button>
            </Link>
          </div>
        </header>

        <main className="p-6 bg-linear-to-br from-emerald-50 via-white to-teal-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            {/* Book Detail Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="grid md:grid-cols-3 gap-8 p-6">
                {/* Book Cover - Smaller Size */}
                <div className="md:col-span-1">
                  <div className="relative aspect-3/4 rounded-xl overflow-hidden shadow-lg bg-linear-to-br from-gray-100 to-gray-200 group">
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-pulse bg-gray-300 w-full h-full"></div>
                      </div>
                    )}
                    <img 
                      src={book.image || "/book-placeholder.jpg"} 
                      alt={book.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                      {book.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <span className="font-medium">{book.author}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-blue-600 font-medium">Published</p>
                          <p className="text-sm font-semibold text-blue-900">{book.year_published}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-green-600 font-medium">Stock</p>
                          <p className="text-sm font-semibold text-green-900">{book.stock} Books</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-md font-bold text-gray-900 mb-2">About This Book</h3>
                    <p className="text-gray-600 leading-relaxed text-sm text-justify">
                      {book.sinopsis || `This is a wonderful book by ${book.author}, published by ${book.publisher} in ${book.year_published}. Discover an engaging story that will captivate your imagination and expand your horizons.`}
                    </p>
                  </div>

                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Book Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600">Author</span>
                        <span className="text-gray-900 font-medium">{book.author}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600">Publisher</span>
                        <span className="text-gray-900 font-medium">{book.publisher}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600">Year Published</span>
                        <span className="text-gray-900 font-medium">{book.year_published}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600">Availability</span>
                        <span className={`font-medium ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {book.stock > 0 ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button 
                      disabled={book.stock === 0}
                      onClick={() => setShowConfirmPopup(true)}
                      className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3"
                    >
                      {book.stock > 0 ? (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Request to Borrow
                        </>
                      ) : (
                        'Currently Unavailable'
                      )}
                    </Button>
                    {book.stock === 0 && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        This book is currently not available. Please check back later.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Popup */}
          {showConfirmPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                <div className="relative bg-linear-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl">
                  <button 
                    onClick={() => setShowConfirmPopup(false)} 
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Confirm Borrow Request</h2>
                      <p className="text-emerald-100 text-sm mt-0.5">Review your request details</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <img 
                        src={book.image || "/book-placeholder.jpg"} 
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{book.title}</h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <p className="text-xs text-gray-500 mt-2">{book.publisher}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Borrow Period
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Borrow Date:</span>
                          <span className="font-semibold text-gray-900">
                            {new Date().toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Return Date:</span>
                          <span className="font-semibold text-gray-900">
                            {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-blue-200">
                          <span className="text-blue-700 font-medium">Duration: 14 days</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-sm text-amber-900">
                        <strong className="block mb-1">Important:</strong>
                        Your request will be reviewed by the admin. You will be notified once it's approved. 
                        Please return the book on time to avoid penalties.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowConfirmPopup(false)}
                    disabled={isRequesting}
                    className="flex-1 border-gray-300 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleRequestBorrow}
                    disabled={isRequesting}
                    className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30"
                  >
                    {isRequesting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showSuccessPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in fade-in zoom-in duration-200">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                <p className="text-gray-600 mb-4">
                  Your borrow request has been submitted successfully. 
                  The admin will review and approve it shortly.
                </p>
                <div className="animate-pulse text-sm text-gray-500">
                  Redirecting to My Borrowings...
                </div>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}