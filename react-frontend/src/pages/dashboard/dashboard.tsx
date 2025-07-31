"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { FileText, Plus, Github, Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import useDocStore from "@lib/stores/doc-store";

interface Document {
  id: string;
  title: string;
  description: string;
  status: "draft" | "published" | "review";
  modified: string;
  author: string;
}

interface Repository {
  name: string;
  updated: string;
  status: "active" | "syncing" | "error";
  icon: string;
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const docStore = useDocStore();
  const handleCreate = async () => {
    console.log("handle create");
    return await docStore.createDoc();
  };
  const repositories: Repository[] = [
    {
      name: "project-docs",
      updated: "2 hours ago",
      status: "active",
      icon: "📁",
    },
    {
      name: "api-documentation",
      updated: "1 day ago",
      status: "syncing",
      icon: "🔧",
    },
    {
      name: "user-guides",
      updated: "3 days ago",
      status: "active",
      icon: "📚",
    },
    {
      name: "technical-specs",
      updated: "1 week ago",
      status: "error",
      icon: "⚙️",
    },
  ];

  const documents: Document[] = [
    {
      id: "1",
      title: "API Integration Guide",
      description:
        "Documentation for integrating third-party APIs into our platform...",
      status: "draft",
      modified: "2 hours ago",
      author: "John Doe",
    },
    {
      id: "2",
      title: "User Onboarding Flow",
      description:
        "Step-by-step guide for new user registration and setup process...",
      status: "published",
      modified: "1 day ago",
      author: "Jane Smith",
    },
    {
      id: "3",
      title: "Security Guidelines",
      description:
        "Comprehensive security protocols and best practices for development...",
      status: "review",
      modified: "3 days ago",
      author: "Mike Johnson",
    },
    {
      id: "4",
      title: "Database Schema",
      description:
        "Complete database structure and relationships documentation...",
      status: "published",
      modified: "1 week ago",
      author: "Sarah Wilson",
    },
    {
      id: "5",
      title: "Testing Procedures",
      description:
        "Quality assurance testing protocols and automated test procedures...",
      status: "draft",
      modified: "2 weeks ago",
      author: "Tom Brown",
    },
    {
      id: "6",
      title: "Release Notes v2.1",
      description:
        "Latest features, bug fixes, and improvements in version 2.1...",
      status: "published",
      modified: "3 weeks ago",
      author: "Lisa Davis",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRepoStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "syncing":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const stats = {
    total: documents.length,
    published: documents.filter((d) => d.status === "published").length,
    inProgress: documents.filter(
      (d) => d.status === "draft" || d.status === "review"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold">Document Manager</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-900 font-medium">
              Documents
            </Link>
            <Link to="/projects" className="text-gray-600 hover:text-gray-900">
              Projects
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-gray-900">
              Settings
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <span className="font-medium">Sarah Chen</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Git Repositories
            </h3>
            <div className="space-y-2">
              {repositories.map((repo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{repo.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getRepoStatusColor(
                        repo.status
                      )}`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              <Plus className="w-4 h-4 mr-2" />
              Connect Repository
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Recent Documents
              </h1>

              <Link to="/editor/1">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleCreate}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Document
                </Button>
              </Link>
            </div>
          </div>

          {/* Document Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-lg">{doc.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-2">
                    {doc.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Modified {doc.modified}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-gray-600">Total Documents</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.published}</p>
                    <p className="text-sm text-gray-600">Published</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.inProgress}</p>
                    <p className="text-sm text-gray-600">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
