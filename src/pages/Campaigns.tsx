import { useState } from "react";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter,
  BarChart3,
  Play,
  Pause,
  Archive
} from "lucide-react";

const mockCampaigns = [
  {
    id: "1",
    name: "SaaS Founder Outreach Q1",
    status: "active" as const,
    leads: 1250,
    sent: 890,
    opens: 234,
    replies: 67,
    openRate: 26.3,
    replyRate: 7.5,
    channels: ["email", "linkedin"],
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "Tech Executive Follow-up",
    status: "active" as const,
    leads: 2100,
    sent: 1456,
    opens: 387,
    replies: 89,
    openRate: 26.6,
    replyRate: 6.1,
    channels: ["email"],
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    name: "Product Manager Series",
    status: "paused" as const,
    leads: 856,
    sent: 345,
    opens: 78,
    replies: 23,
    openRate: 22.6,
    replyRate: 6.7,
    channels: ["linkedin"],
    createdAt: "2024-01-08"
  },
  {
    id: "4",
    name: "Enterprise Sales Q4",
    status: "completed" as const,
    leads: 3200,
    sent: 3200,
    opens: 896,
    replies: 234,
    openRate: 28.0,
    replyRate: 7.3,
    channels: ["email", "linkedin"],
    createdAt: "2023-12-01"
  },
  {
    id: "5",
    name: "Startup Pitch Deck",
    status: "draft" as const,
    leads: 0,
    sent: 0,
    opens: 0,
    replies: 0,
    openRate: 0,
    replyRate: 0,
    channels: ["email"],
    createdAt: "2024-01-20"
  }
];

export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filterCampaigns = (status?: string) => {
    let filtered = mockCampaigns;
    
    if (status && status !== "all") {
      filtered = filtered.filter(campaign => campaign.status === status);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(campaign => 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusCount = (status: string) => {
    if (status === "all") return mockCampaigns.length;
    return mockCampaigns.filter(c => c.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and monitor your outreach campaigns
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <span>All</span>
            <Badge variant="secondary">{getStatusCount("all")}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center space-x-2">
            <Play className="w-3 h-3" />
            <span>Active</span>
            <Badge variant="secondary">{getStatusCount("active")}</Badge>
          </TabsTrigger>
          <TabsTrigger value="paused" className="flex items-center space-x-2">
            <Pause className="w-3 h-3" />
            <span>Paused</span>
            <Badge variant="secondary">{getStatusCount("paused")}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-2">
            <Archive className="w-3 h-3" />
            <span>Completed</span>
            <Badge variant="secondary">{getStatusCount("completed")}</Badge>
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center space-x-2">
            <span>Draft</span>
            <Badge variant="secondary">{getStatusCount("draft")}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterCampaigns(activeTab).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          {filterCampaigns(activeTab).length === 0 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>No campaigns found</CardTitle>
                <CardDescription>
                  {searchTerm 
                    ? `No campaigns match "${searchTerm}"`
                    : `No ${activeTab} campaigns yet`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}