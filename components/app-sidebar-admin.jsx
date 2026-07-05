"use client";

import * as React from "react";
import { ChevronRight, Book, Users, Clock, BarChart, Library, Shield } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navData = {
  navMain: [
    {
      title: "Master Data",
      items: [
        {
          title: "Users",
          key: "users",
          icon: Users
        },
        {
          title: "Books",
          key: "books",
          icon: Book
        },
      ],
    },
    {
      title: "Borrowings",
      items: [
        {
          title: "Borrows",
          key: "borrows",
          icon: Clock
        },
      ],
    },
  ],
};

export function AppSidebar_admin({ onNavigate, ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="">
        <SidebarFooter className="">
          <NavUser user={props.user} />
        </SidebarFooter>
      </SidebarHeader>

      <SidebarContent className="gap-2 p-2">
        {navData.navMain.map((section) => (
          <Collapsible
            key={section.title}
            defaultOpen
            className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg px-3 py-2 text-sm font-semibold">
                <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer">
                  <span>{section.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton 
                          asChild 
                          className="hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors p-4 gap-4"
                        >
                          <button 
                            className="w-full flex items-center gap-3 px-3 py-2 cursor-pointer" 
                            onClick={() => onNavigate(item.key, section.title)}
                          >
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}