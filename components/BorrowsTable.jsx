"use client";

import { useState, useTransition, useEffect } from "react";
import { getAllBorrows, storeBorrow, updateBorrowStatus, deleteBorrow, getAllUsers, getAllBooks, approveBorrow, rejectBorrow } from "@/lib/action";
import { Button } from "./ui/button";
import { Field, FieldLabel } from "./ui/field";
import { 
  X, Plus, Clock, User, BookOpen, Calendar, 
  Search, AlertCircle, Trash2, CheckCircle, XCircle, Loader, Check
} from "lucide-react";

export default function BorrowsTable() {
  const [borrows, setBorrows] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    startTransition(async () => {
      const [borrowsData, usersData, booksData] = await Promise.all([
        getAllBorrows(),
        getAllUsers(),
        getAllBooks()
      ]);
      setBorrows(borrowsData);
      setUsers(usersData);
      setBooks(booksData);
    });
  }, []);

  async function handleDeleteBorrow(id) {
    if (confirm("Are you sure you want to delete this borrow record?")) {
      await deleteBorrow(id);
      setBorrows(await getAllBorrows());
    }
  }

  async function handleStatusChange(id, newStatus) {
    await updateBorrowStatus(id, newStatus);
    setBorrows(await getAllBorrows());
  }

  async function handleApproveBorrow(id) {
    if (confirm("Approve this borrow request? The book stock will be decreased.")) {
      await approveBorrow(id);
      setBorrows(await getAllBorrows());
    }
  }

  async function handleRejectBorrow(id) {
    if (confirm("Reject this borrow request? This action cannot be undone.")) {
      await rejectBorrow(id);
      setBorrows(await getAllBorrows());
    }
  }

  const filteredBorrows = borrows.filter(borrow => 
    borrow.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrow.book_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrow.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'from-yellow-500 to-yellow-600';
      case 'progress': return 'from-blue-500 to-blue-600';
      case 'closed': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'progress': return 'In Progress';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Borrowings Management
          </h1>
          <p className="text-gray-500 mt-1">Track and manage book borrowings</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student, book or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">
                {borrows.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {borrows.filter(b => b.status === 'progress').length}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <Loader className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Returned</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {borrows.filter(b => b.status === 'closed').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Borrow Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Return Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBorrows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 font-medium">No borrow records found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBorrows.map((borrow) => (
                  <tr key={borrow.id_borrows} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-semibold text-sm">
                             {borrow.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        
                        <div>
                          <p className="font-semibold text-gray-900">{borrow.username}</p>
                          <p className="text-xs text-gray-500">{borrow.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div>
                          <p className="text-sm font-medium">{borrow.book_title}</p>
                          <p className="text-xs text-gray-500">{borrow.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <span className="text-sm">
                          {new Date(borrow.borrow_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-600">  
                        <span className="text-sm">
                          {borrow.due_return_date ? new Date(borrow.due_return_date).toLocaleDateString() : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center flex items-center justify-center">
                      {borrow.status === 'pending' ? (
                        <div className="flex justify-center gap-2">
                          <Button 
                            onClick={() => handleApproveBorrow(borrow.id_borrows)} 
                            size="sm"
                            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleRejectBorrow(borrow.id_borrows)} 
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1.5 border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <div className="">
                          {borrow.status === "progress" && (
    <Button
      onClick={() => handleStatusChange(borrow.id_borrows, "closed")}
      size="sm"
      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Check className="h-3.5 w-3.5" />
      Mark Returned
    </Button>
  )}

  {borrow.status === "closed" && (
    <div className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
      <CheckCircle className="h-3.5 w-3.5" />
      Returned
    </div>
  )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Button 
                          onClick={() => handleDeleteBorrow(borrow.id_borrows)} 
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1.5 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}