"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { FieldLabel } from "./ui/field";
import { storeBooks, getAllBooks, deleteBooks, updateBooks } from "@/lib/action";
import { 
  X, Plus, Edit, BookOpen,
  Search, Package, Trash2, Image as ImageIcon, Book, BookAlert
  
} from "lucide-react";

export default function BooksTable() {
  
  const [showPopup, setShowPopup] = useState(false)
  const [showPopupEdit, setShowPopupEdit] = useState(false)
  const [books, setBooks] = useState([]);
  const [editBooks, setEditBooks] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    startTransition(async () => {
      const data = await getAllBooks();
      setBooks(data);
    });
  }, []);

  async function handleDeleteBook(id) {
    if (confirm("Are you sure you want to delete this book?")) {
      await deleteBooks(id);
      setBooks(await getAllBooks());
    }
  }

  async function handleUpdateSuccess() {
    setBooks(await getAllBooks());
    setShowPopupEdit(false);
  }

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Books Management
          </h1>
          <p className="text-gray-500 mt-1">Manage your library collection</p>
        </div>
        <Button 
          onClick={() => setShowPopup(true)} 
          className="flex items-center gap-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          Add Book
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, author, publisher"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-600 text-sm font-medium">Total Books</p>
                        <p className="text-3xl font-bold text-blue-900 mt-1">{books.length}</p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-lg">
                        <Book className="text-white"/>
                    </div>
                </div>
            </div>
            
            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-purple-600 text-sm font-medium">Available</p>
                        <p className="text-3xl font-bold text-purple-900 mt-1">
                            {books.filter(b => b.stock > 0).length}
                        </p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-lg">
                        <BookOpen className="text-white"/>
                    </div>
                </div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-600 text-sm font-medium">Out of Stock</p>
                        <p className="text-3xl font-bold text-green-900 mt-1">
                             {books.filter(b => b.stock === 0).length}
                        </p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-lg">
                        <BookAlert className="text-white"/>
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
                  Book
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Publisher
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sinopsis
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <BookOpen className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 font-medium">No books found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id_books} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden shadow-md shrink-0 bg-gray-100">
                          <img 
                            src={book.image || "/book-placeholder.jpg"} 
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{book.title}</p>
                          <p className="text-xs text-gray-500">ID: {book.id_books}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-sm">{book.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-sm">{book.publisher}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-start gap-2">
                        <p className="text-sm text-gray-600 line-clamp-3 text-justify">
                          {book.sinopsis || "No sinopsis available"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <span className="text-sm font-medium">{book.year_published}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                        book.stock > 10 
                          ? 'bg-linear-to-r from-green-500 to-green-600 text-white'
                          : book.stock > 0
                          ? 'bg-linear-to-r from-yellow-500 to-yellow-600 text-white'
                          : 'bg-linear-to-r from-red-500 to-red-600 text-white'
                      }`}>
                        <Package className="h-3 w-3" />
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Button 
                          onClick={() => { setEditBooks(book); setShowPopupEdit(true); }} 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button 
                          onClick={() => handleDeleteBook(book.id_books)} 
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
   
      {/* Add Book Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="relative bg-linear-to-r from-emerald-600 to-teal-600 p-6">
              <button 
                onClick={() => setShowPopup(false)} 
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Add New Book</h2>
                  <p className="text-emerald-100 text-sm mt-0.5">Add a new book to your collection</p>
                </div>
              </div>
            </div>
            
            {/* Form */}
            <form action={storeBooks}>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field className="md:col-span-2">
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-emerald-600" />
                      Title
                    </FieldLabel>
                    <input 
                      type="text" 
                      name="title" 
                      placeholder="Enter book title" 
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm" 
                      required 
                    />
                  </Field>
                  
                  <Field>
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      Author
                    </FieldLabel>
                    <input 
                      type="text" 
                      name="author" 
                      placeholder="Enter author name" 
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm" 
                      required 
                    />
                  </Field>
                  
                  <Field>
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      Publisher
                    </FieldLabel>
                    <input 
                      type="text" 
                      name="publisher" 
                      placeholder="Enter publisher" 
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm" 
                      required 
                    />
                  </Field>
                  
                  <Field>
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      Year Published
                    </FieldLabel>
                    <input 
                      type="number" 
                      name="year_published" 
                      placeholder="2024" 
                      min="1900"
                      max="2030"
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm" 
                      required 
                    />
                  </Field>
                  
                  <Field>
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-emerald-600" />
                      Stock
                    </FieldLabel>
                    <input 
                      type="number" 
                      name="stock" 
                      placeholder="0" 
                      min="0"
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm" 
                      required 
                    />
                  </Field>

                  {/* Sinopsis Field */}
                  <Field className="md:col-span-2">
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      Sinopsis
                    </FieldLabel>
                    <textarea 
                      name="sinopsis" 
                      placeholder="Enter book sinopsis..."
                      rows="4"
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm resize-none"
                    />
                  </Field>
                  
                  <Field className="md:col-span-2">
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-emerald-600" />
                      Book Cover
                    </FieldLabel>
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*"
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" 
                    />
                  </Field>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowPopup(false)}
                  className="px-6 border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-6 shadow-lg shadow-emerald-500/30"
                >
                  Add Book
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Popup */}
      {showPopupEdit && editBooks && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="relative bg-linear-to-r from-blue-600 to-cyan-600 p-6">
              <button 
                onClick={() => setShowPopupEdit(false)} 
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit Book</h2>
                  <p className="text-blue-100 text-sm mt-0.5">Update book information</p>
                </div>
              </div>
            </div>
            
            {/* Form */}
            <form action={async (formData) => {
              await updateBooks(formData);
              await handleUpdateSuccess();
            }}>
              <input type="hidden" name="currentImage" value={editBooks.image} />
              <input type="hidden" name="id_books" value={editBooks.id_books} />
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Current Image Preview */}
                {editBooks.image && (
                  <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                      Current Cover
                    </FieldLabel>
                    <div className="flex items-center gap-4">
                      <img 
                        src={editBooks.image} 
                        alt="Current cover" 
                        className="w-16 h-20 object-cover rounded-lg border-2 border-white shadow-md" 
                      />
                      <span className="text-sm text-gray-600">
                        Current book cover will be replaced if you upload a new image
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field className="md:col-span-2">
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      Title
                    </FieldLabel>
                    <input 
                      type="text" 
                      name="title" 
                      defaultValue={editBooks.title}
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                      required 
                    />
                  </Field>
                  
                  <Field>
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      Author
                    </FieldLabel>
                    <input 
                      type="text" 
                      name="author" 
                      defaultValue={editBooks.author}
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                      required 
                    />
                  </Field>
                  
                  <Field>
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      
                      Publisher
                    </FieldLabel>
                    <input 
                      type="text" 
                      name="publisher" 
                      defaultValue={editBooks.publisher}
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                      required 
                    />
                  </Field>
                  
                  <Field>
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      Year Published
                    </FieldLabel>
                    <input 
                      type="number" 
                      name="year_published" 
                      defaultValue={editBooks.year_published}
                      min="1900"
                      max="2030"
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                      required 
                    />
                  </Field>
                  
                  <Field>
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      Stock
                    </FieldLabel>
                    <input 
                      type="number" 
                      name="stock" 
                      defaultValue={editBooks.stock}
                      min="0"
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                      required 
                    />
                  </Field>

                  {/* Sinopsis Field */}
                  <Field className="md:col-span-2">
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      Sinopsis
                    </FieldLabel>
                    <textarea 
                      name="sinopsis" 
                      placeholder="Enter book sinopsis..."
                      rows="4"
                      defaultValue={editBooks.sinopsis}
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                      required
                    />
                  </Field>
                  
                  <Field className="md:col-span-2">
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                      New Cover Image (Optional)
                    </FieldLabel>
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*"
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                    />
                  </Field>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowPopupEdit(false)}
                  className="px-6 border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 shadow-lg shadow-blue-500/30"
                >
                  Update Book
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}