"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { updateProfilePhoto, updateUserProfile } from "@/lib/action";
import { 
  User, Mail, Shield, Camera, Save, X, 
  BookOpen, Clock } from "lucide-react";
  import { getBorrowsByUserId } from "@/lib/action";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [borrows, setBorrows] = useState([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        username: session.user.name || "",
        email: session.user.email || "",
      });
    }

    if (session?.user?.id) {
      startTransition(async () => {
        const data = await getBorrowsByUserId(session.user.id);
        setBorrows(data);
      });
    }
  }, [session]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("id_users", session.user.id);
      formData.append("image", file);

      const imagePath = await updateProfilePhoto(formData);
      
      await update({
        ...session,
        user: {
          ...session.user,
          image: imagePath,
        },
      });

      alert("Profile photo updated successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataObj = new FormData();
      formDataObj.append("id_users", session.user.id);
      formDataObj.append("username", formData.username);

      await updateUserProfile(formDataObj);
      
      await update({
        ...session,
        user: {
          ...session.user,
          name: formData.username,
        },
      });
      
      setIsEditing(false);
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <X className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl overflow-hidden">
                    {session.user.image 
                    ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name}
                        className="w-full h-full object-cover"
                      />) 
                    : (
                      <span className="text-4xl font-bold text-white">
                        {getInitials(session.user.name)}
                      </span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {isUploadingPhoto ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    ) : (
                      <Camera className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {session.user.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{session.user.email}</p>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full 
                ${
                session?.user?.role === 'admin'
                ? 'bg-linear-to-r from-purple-500 to-purple-600 text-white'
                : 'bg-linear-to-r from-green-500 to-green-600 text-white' 
                }`}>
                  {session?.user?.role === "admin" 
                  ? (<Shield className="h-4 w-4" />)
                  : (<User className="h-4 w-4" />)
                  }
                  <span className="text-sm font-semibold capitalize">
                    {session.user.role}
                  </span>
                </div>
              </div>

              {/* Stats */}
              {session?.user?.role ==="public" && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Books Borrowed</p>
                      <p className="font-bold text-gray-900">
                        {borrows.filter(b => b.status === 'progress').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="font-bold text-gray-900">{borrows.filter(b => b.status === 'pending').length}</p>
                    </div>
                  </div>
                </div>
                  </>
              </div>
            )}
            </div>
          </div>

          {/* Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Field>
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      Username
                    </FieldLabel>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      Email
                    </FieldLabel>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                      disabled
                    />
                    {session?.user?.role === "public" && (
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    )} 
                  </Field>

                  <Field>
                    <FieldLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      {session?.user?.role === "admin" 
                      ? (<Shield className="h-4 w-4" />)
                      : (<User className="h-4 w-4" />)
                      }
                      Role
                    </FieldLabel>
                    <input
                      type="text"
                      value={session.user.role}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-gray-50 capitalize"
                      disabled
                    />
                    {session?.user?.role === "public" && (
                      <p className="text-xs text-gray-500 mt-1">Role is assigned by administrators</p>
                    )}
                  </Field>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          username: session.user.name || "",
                          email: session.user.email || "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Username</p>
                      <p className="text-lg font-semibold text-gray-900">{session.user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Email Address</p>
                      <p className="text-lg font-semibold text-gray-900">{session.user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      {session?.user?.role === "admin" 
                      ? (<Shield className="h-4 w-4" />)
                      : (<User className="h-4 w-4" />)
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Account Role</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">{session.user.role}</p>
                    </div>
                  </div>
                    <div className="flex items-start gap-4 p-4">
                      <div className="w-full">

                        <button onClick={() => signOut({ callbackUrl: "/login"})} 
                        className="bg-red-50 border border-red-200 rounded-md p-2 items-center w-full cursor-pointer text-red-600 font-semibold transition delay-75 hover:bg-red-500 hover:text-white"
                        >LogOut</button>
                      </div>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}