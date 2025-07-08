import { useState } from "react";
import { MessageGenerator } from "@/components/ai/MessageGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Inbox, 
  Send, 
  Reply, 
  Search,
  Filter,
  Wand2,
  Mail,
  MessageSquare,
  Calendar,
  User,
  Building,
  Clock,
  Star,
  Archive,
  Trash2
} from "lucide-react";

const mockMessages = [
  {
    id: "1",
    from: "sarah@techstartup.com",
    name: "Sarah Johnson",
    company: "TechStartup Inc",
    subject: "Re: Partnership Opportunity",
    preview: "Thanks for reaching out! I'd love to learn more about how this could help our team...",
    timestamp: "2024-01-15T14:30:00",
    type: "reply",
    status: "positive",
    campaign: "SaaS Founder Outreach Q1",
    channel: "email"
  },
  {
    id: "2",
    from: "m.chen@enterprise.io",
    name: "Michael Chen",
    company: "Enterprise Solutions",
    subject: "Meeting Request",
    preview: "I'm interested in scheduling a call to discuss your solution. Are you available next week?",
    timestamp: "2024-01-15T11:15:00",
    type: "reply",
    status: "meeting",
    campaign: "Tech Executive Follow-up",
    channel: "email"
  },
  {
    id: "3",
    from: "linkedin",
    name: "Emma Rodriguez",
    company: "GrowthCo",
    subject: "LinkedIn Connection Accepted",
    preview: "Hi! Thanks for connecting. I saw your message about growth strategies...",
    timestamp: "2024-01-15T09:45:00",
    type: "linkedin",
    status: "positive",
    campaign: "Product Manager Series",
    channel: "linkedin"
  },
  {
    id: "4",
    from: "bounce@mailer.com",
    name: "David Park",
    company: "Innovation AI",
    subject: "Email Bounced",
    preview: "The email address david@oldcompany.com is no longer valid...",
    timestamp: "2024-01-14T16:20:00",
    type: "bounce",
    status: "bounce",
    campaign: "AI Startup Outreach",
    channel: "email"
  }
];

const statusColors = {
  positive: "bg-green-100 text-green-800",
  meeting: "bg-blue-100 text-blue-800",
  neutral: "bg-yellow-100 text-yellow-800",
  negative: "bg-red-100 text-red-800",
  bounce: "bg-gray-100 text-gray-800"
};

export default function Messages() {
  const [selectedTab, setSelectedTab] = useState("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(mockMessages[0]);
  const [showGenerator, setShowGenerator] = useState(false);

  const filteredMessages = mockMessages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "reply":
        return <Reply className="w-4 h-4 text-green-600" />;
      case "linkedin":
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "bounce":
        return <Mail className="w-4 h-4 text-red-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Messages & Replies</h1>
          <p className="text-muted-foreground">
            Manage conversations and generate AI-powered responses
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </Button>
          <Button onClick={() => setShowGenerator(!showGenerator)}>
            <Wand2 className="w-4 h-4 mr-2" />
            AI Generator
          </Button>
        </div>
      </div>

      {/* AI Message Generator */}
      {showGenerator && (
        <MessageGenerator 
          leadData={{
            name: selectedMessage.name,
            company: selectedMessage.company,
            title: "VP of Marketing",
            industry: "SaaS"
          }}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Inbox className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Messages</span>
            </div>
            <p className="text-2xl font-bold mt-2">127</p>
            <p className="text-xs text-accent">+12 today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Reply className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Replies</span>
            </div>
            <p className="text-2xl font-bold mt-2">34</p>
            <p className="text-xs text-green-600">+8 today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Meetings</span>
            </div>
            <p className="text-2xl font-bold mt-2">12</p>
            <p className="text-xs text-blue-600">+3 today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Reply Rate</span>
            </div>
            <p className="text-2xl font-bold mt-2">26.8%</p>
            <p className="text-xs text-accent">+2.1% vs last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Inbox</CardTitle>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedMessage.id === message.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getMessageIcon(message.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{message.name}</p>
                          <Badge className={statusColors[message.status as keyof typeof statusColors]}>
                            {message.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{message.company}</p>
                        <p className="text-sm font-medium mt-1 truncate">{message.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{message.preview}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {message.channel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedMessage.subject}</CardTitle>
                  <CardDescription>
                    From {selectedMessage.name} at {selectedMessage.company}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Message Info */}
              <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{selectedMessage.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{selectedMessage.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(selectedMessage.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="prose prose-sm max-w-none">
                <p>{selectedMessage.preview}</p>
                <p>This would contain the full message content...</p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2 pt-4 border-t">
                <Button>
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </Button>
                <Button variant="outline">
                  <Wand2 className="w-4 h-4 mr-2" />
                  AI Reply
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}