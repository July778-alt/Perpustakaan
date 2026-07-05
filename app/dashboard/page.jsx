"use client";

import { AppSidebar_admin } from "@/components/app-sidebar-admin"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import BooksTable from "@/components/BooksTable";
import UsersTable from "@/components/UsersTable";
import BorrowsTable from "@/components/BorrowsTable";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { forbidden } from "next/navigation";

export default function Page() {
  const [page, setPage] = useState("users");

  function handleNavigate(pageName) {
    setPage(pageName);

  }

  const { data: session, status, update } = useSession();

  const user = session?.user;

  if (user?.role === "public") { 
    forbidden();
  }


  return (
    <SidebarProvider>
      <AppSidebar_admin onNavigate={handleNavigate} user={user}/>
      <SidebarInset>
        <header
          className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {page === "users" && <UsersTable />}
          {page === "books" && <BooksTable />}
          {page === "borrows" && <BorrowsTable />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
