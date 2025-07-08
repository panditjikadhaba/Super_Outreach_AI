import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Upload,
  Search, 
  Filter,
  Download,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Building,
  User,
  Globe
} from "lucide-react";

const mockLeads = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@techstartup.com",
    company: "TechStartup Inc",
    title: "VP of Marketing",
    industry: "SaaS",
    location: "San Francisco, CA",
    status: "contacted",
    lastContact: "2024-01-15",
    source: "LinkedIn",
    phone: "+1 (555) 123-4567"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@enterprise.io",
    company: "Enterprise Solutions",
    title: "Chief Technology Officer", 
    industry: "Enterprise Software",
    location: "New York, NY",
    status: "replied",
    lastContact: "2024-01-14",
    source: "Apollo",
    phone: "+1 (555) 987-6543"
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    email: "emma@growthco.com",
    company: "GrowthCo",
    title: "Head of Sales",
    industry: "Marketing Tech",
    location: "Austin, TX", 
    status: "opened",
    lastContact: "2024-01-13",
    source: "CSV Import",
    phone: "+1 (555) 456-7890"
  },
  {
    id: "4",
    name: "David Park",
    email: "david@innovation.ai",
    company: "Innovation AI",
    title: "Founder & CEO",
    industry: "AI/ML",
    location: "Seattle, WA",
    status: "new",
    lastContact: null,
    source: "Referral",
    phone: "+1 (555) 321-0987"
  }
];

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800", 
  opened: "bg-green-100 text-green-800",
  replied: "bg-purple-100 text-purple-800",
  meeting: "bg-emerald-100 text-emerald-800",
  closed: "bg-gray-100 text-gray-800"
};

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: string) => {
    if (status === "all") return mockLeads.length;
    return mockLeads.filter(lead => lead.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Manage your lead database and track outreach progress
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Leads</span>
            </div>
            <p className="text-2xl font-bold mt-2">12,847</p>
            <p className="text-xs text-accent">+234 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Contacted</span>
            </div>
            <p className="text-2xl font-bold mt-2">4,329</p>
            <p className="text-xs text-primary">33.7% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Replied</span>
            </div>
            <p className="text-2xl font-bold mt-2">1,024</p>
            <p className="text-xs text-accent">23.6% reply rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Companies</span>
            </div>
            <p className="text-2xl font-bold mt-2">3,456</p>
            <p className="text-xs text-muted-foreground">Unique</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lead Status Tabs */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">
            All ({getStatusCount("all")})
          </TabsTrigger>
          <TabsTrigger value="new">
            New ({getStatusCount("new")})
          </TabsTrigger>
          <TabsTrigger value="contacted">
            Contacted ({getStatusCount("contacted")})
          </TabsTrigger>
          <TabsTrigger value="opened">
            Opened ({getStatusCount("opened")})
          </TabsTrigger>
          <TabsTrigger value="replied">
            Replied ({getStatusCount("replied")})
          </TabsTrigger>
          <TabsTrigger value="meeting">
            Meeting ({getStatusCount("meeting")})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({getStatusCount("closed")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Leads Database</CardTitle>
              <CardDescription>
                {filteredLeads.length} leads found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.company}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Globe className="w-3 h-3 mr-1" />
                            {lead.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{lead.title}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}