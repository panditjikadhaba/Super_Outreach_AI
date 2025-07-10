import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCampaigns } from "@/hooks/useSupabase";
import { 
  Plus, 
  Search, 
  Filter,
  BarChart3,
  Play,
  Pause,
  Archive
} from "lucide-react";

export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { data: campaigns = [], isLoading } = useCampaigns();

  // Transform campaigns data to match expected format
  const transformedCampaigns = campaigns.map((campaign: any) => ({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    leads: 0, // You'll need to calculate this from leads table
    sent: 0, // You'll need to calculate this from messages table
    opens: 0, // You'll need to calculate this from messages table
    replies: 0, // You'll need to calculate this from messages table
    openRate: 0, // Calculated field
    replyRate: 0, // Calculated field
    channels: campaign.channels || [],
    createdAt: campaign.created_at
  }));

  const filterCampaigns = (status?: string) => {
    let filtered = transformedCampaigns;
    
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
    if (status === "all") return campaigns?.length || 0;
    return transformedCampaigns.filter(c => c.status === status).length;
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <CampaignForm 
                onSuccess={() => setIsCreateDialogOpen(false)}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
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