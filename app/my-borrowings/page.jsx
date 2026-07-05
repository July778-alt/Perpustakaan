"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppSidebar_public } from "@/components/app-sidebar-public";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getBorrowsByUserId } from "@/lib/action";
import { 
  BookOpen, Clock, Calendar, User, Building, 
  CheckCircle, XCircle, Loader, AlertCircle,
  ArrowLeft, Library
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyBorrowingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [borrows, setBorrows] = useState([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.id) {
      startTransition(async () => {
        const data = await getBorrowsByUserId(session.user.id);
        setBorrows(data);
      });
    }
  }, [session, status, router]);

  const getStatusConfig = (status) => {
    switch(status) {
      case 'pending':
        return {
          color: 'from-yellow-500 to-yellow-600',
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: Clock,
          label: 'Pending'
        };
      case 'progress':
        return {
          color: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: Loader,
          label: 'Reading'
        };
      case 'closed':
        return {
          color: 'from-green-500 to-green-600',
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: CheckCircle,
          label: 'Returned'
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: AlertCircle,
          label: status
        };
    }
  };

  if (status === "loading" || isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your borrowings...</p>
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
          </div>
        </header>

        <main className="p-6 bg-linear-to-br from-emerald-50 via-white to-teal-50 min-h-screen">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-linear-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold mt-1">
                    {borrows.filter(b => b.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-white/30" />
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Reading</p>
                  <p className="text-3xl font-bold mt-1">
                    {borrows.filter(b => b.status === 'progress').length}
                  </p>
                </div>
                <BookOpen className="h-12 w-12 text-white/30" />
              </div>
            </div>

            <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Returned</p>
                  <p className="text-3xl font-bold mt-1">
                    {borrows.filter(b => b.status === 'closed').length}
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-white/30" />
              </div>
            </div>
          </div>

          {/* Borrowings List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              All Borrowings
              <span className="text-sm font-normal text-gray-500">({borrows.length} total)</span>
            </h2>

            {borrows.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                <div className="inline-flex p-4 bg-emerald-100 rounded-full mb-4">
                  <BookOpen className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No borrowings yet</h3>
                <p className="text-gray-500 mb-6">Start borrowing books from our library</p>
                <Link href="/home">
                  <Button className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    Browse Books
                  </Button>
                </Link>
              </div>
            ) : (
              borrows.map((borrow) => {
                const statusConfig = getStatusConfig(borrow.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div 
                    key={borrow.id_borrows}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200"
                  >
                    <div className="flex flex-col md:flex-row gap-4 p-6">
                      {/* Book Cover */}
                      <div className="w-full md:w-32 h-40 md:h-48 shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                        <img 
                          src={borrow.image || "/book-placeholder.jpg"} 
                          alt={borrow.book_title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {borrow.book_title}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {borrow.author}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                              <Building className="h-4 w-4" />
                              {borrow.publisher}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.text} shadow-sm`}>
                            <StatusIcon className="h-4 w-4" />
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Borrowed On</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(borrow.borrow_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Return Date</p>
                              <p className="font-semibold text-gray-900">
                                {borrow.due_return_date 
                                  ? new Date(borrow.due_return_date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : 'Not specified'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        {borrow.status === 'progress' && (
                          <div className="mt-4">
                            <Link href={`/books/${borrow.id_books}`}>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              >
                                View Book Details
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}