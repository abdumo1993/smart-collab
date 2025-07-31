import { useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Separator } from "@components/ui/separator";
import { Alert, AlertDescription } from "@components/ui/alert";
import {
  ArrowLeft,
  Save,
  Code,
  Bot,
  AlertTriangle,
  CheckCircle,
  Github,
  Eye,
  Settings,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  LucideLink,
  ImageIcon,
  Send,
  Check,
  X,
  Sparkles,
} from "lucide-react";
// import NextLink from "next/link";
import { Link } from "react-router-dom";
import EditorComponent from "@components/ui/EditorComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface AINotification {
  id: string;
  type: "warning" | "success" | "info";
  message: string;
  timestamp: string;
}

interface AISuggestion {
  id: string;
  type: "addition" | "deletion" | "replacement";
  originalText: string;
  suggestedText: string;
  startIndex: number;
  endIndex: number;
  reason: string;
  isActive: boolean;
}

interface TextSegment {
  text: string;
  type: "normal" | "addition" | "deletion" | "replacement";
  suggestionId?: string;
}

export default function EditorPage() {
  const [documentTitle, setDocumentTitle] = useState("Project Documentation");
  const [documentContent, setDocumentContent] = useState(`# Overview

This project provides a comprehensive solution for authentication and user management. The system includes user registration, login, password reset, and profile management features.

## Key Features

- User authentication with JWT tokens
- Password encryption using bcrypt
- Email verification system
- Role-based access control
- Session management

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Run the application`);

  const [aiInput, setAiInput] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const collaborators: Collaborator[] = [
    { id: "1", name: "Sarah Chen", avatar: "SC", isOnline: true },
    { id: "2", name: "Mike Johnson", avatar: "MJ", isOnline: true },
    { id: "3", name: "Lisa Davis", avatar: "LD", isOnline: false },
    { id: "4", name: "Tom Wilson", avatar: "TW", isOnline: true },
  ];

  const [notifications, setNotifications] = useState<AINotification[]>([
    {
      id: "1",
      type: "warning",
      message:
        "Function 'authenticateUser' in auth.js is suggested doc update in line 15",
      timestamp: "2 minutes ago",
    },
    {
      id: "2",
      type: "success",
      message: "Documentation updated successfully",
      timestamp: "5 minutes ago",
    },
  ]);

  const acceptAllSuggestions = () => {};

  const rejectAllSuggestions = () => {};

  const handleAIAssist = async () => {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-600" />
              <span className="font-semibold">CodeSync</span>
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className="ml-2"
              >
                {isConnected
                  ? "Connected to repo/docs-example"
                  : "Disconnected"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map((collaborator) => (
                  <Avatar
                    key={collaborator.id}
                    className="w-8 h-8 border-2 border-white"
                  >
                    <AvatarFallback className="text-xs">
                      {collaborator.avatar}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-gray-600">+2 more</span>
            </div>

            {showAISuggestions && aiSuggestions.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={acceptAllSuggestions}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={rejectAllSuggestions}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject All
                </Button>
              </div>
            )}

            <Button variant="ghost" size="icon">
              <Eye className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Document
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Combined Sidebar */}
        <aside className="w-80 bg-white border-r min-h-screen flex flex-col">
          <Tabs defaultValue="ai" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b bg-transparent p-0">
              <TabsTrigger value="ai" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600">AI Assistant</TabsTrigger>
              <TabsTrigger value="repo" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600">Repository</TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  AI Documentation Assistant
                </h3>
                {showAISuggestions && aiSuggestions.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={acceptAllSuggestions}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={rejectAllSuggestions}
                    >
                      Reject All
                    </Button>
                  </div>
                )}
              </div>

              <Card className="mb-4">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Would you like me to help generate documentation for the new
                    authentication module?
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setAiInput(
                        "improve the authentication documentation with more details and examples"
                      );
                      handleAIAssist();
                    }}
                  >
                    Yes, please help with the auth module documentation
                  </Button>
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">AI Assistant</span>
                    {isProcessingAI && (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    I'll create comprehensive documentation for your
                    authentication module. This will include setup instructions,
                    API endpoints, and usage examples.
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Ask AI to help with documentation"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleAIAssist()}
                      disabled={isProcessingAI}
                    />
                    <Button
                      size="icon"
                      onClick={handleAIAssist}
                      disabled={isProcessingAI}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick suggestion buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        setAiInput("improve this documentation");
                        handleAIAssist();
                      }}
                    >
                      Improve text
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        setAiInput("add code examples");
                        handleAIAssist();
                      }}
                    >
                      Add examples
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        setAiInput("make it more technical");
                        handleAIAssist();
                      }}
                    >
                      More technical
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Alert
                    key={notification.id}
                    className={
                      notification.type === "warning"
                        ? "border-yellow-200 bg-yellow-50"
                        : notification.type === "success"
                        ? "border-green-200 bg-green-50"
                        : "border-blue-200 bg-blue-50"
                    }
                  >
                    <div className="flex items-start gap-2">
                      {notification.type === "warning" && (
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      )}
                      {notification.type === "success" && (
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      )}
                      {notification.type === "info" && (
                        <Bot className="w-4 h-4 text-blue-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <AlertDescription className="text-sm">
                          {notification.message}
                        </AlertDescription>
                        <div className="text-xs text-gray-500 mt-1">
                          {notification.timestamp}
                        </div>
                      </div>
                      {notification.type === "warning" && (
                        <Button size="sm" variant="ghost" className="text-xs">
                          ✕
                        </Button>
                      )}
                      {notification.type === "success" && (
                        <Button size="sm" variant="ghost" className="text-xs">
                          ✓
                        </Button>
                      )}
                    </div>
                  </Alert>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="repo" className="flex-1 overflow-y-auto p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Repository Setup
              </h3>

              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-600">
                      AI Suggestion
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Collaborative document editing with real-time synchronization
                    and GitHub integration.
                  </p>
                  <Button size="sm" className="w-full">
                    Continue
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">or</div>
                <Button variant="outline" className="w-full justify-start">
                  <Github className="w-4 h-4 mr-2" />
                  Browse My Repos
                </Button>
              </div>

              <Separator className="my-6" />

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Connected Repository
                </h4>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <Github className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">docs-example</div>
                        <div className="text-xs text-gray-500">
                          Owner: username
                          <br />
                          Branch: main
                          <br />
                          Last updated: 2 hours ago
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Active Sync</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Main Editor */}
        <main className="flex-1 flex flex-col">
          <div className="bg-white border-b p-4">
            <div className="flex items-center justify-between mb-4">
              <Input
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="text-xl font-semibold border-none p-0 focus-visible:ring-0"
              />
              <div className="flex items-center gap-2">
                <Badge variant="secondary">4 collaborators</Badge>
                {showAISuggestions && (
                  <Badge className="bg-purple-100 text-purple-800">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {aiSuggestions.length} AI suggestions
                  </Badge>
                )}
                <Button variant="ghost" size="icon">
                  <Bot className="w-5 h-5 text-blue-600" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <EditorComponent
              docId="1"
              className="min-h-[500px] p-4 rounded-lg text-base leading-relaxed"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
