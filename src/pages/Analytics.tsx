import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown,
  Mail, 
  MessageSquare, 
  Users, 
  Calendar,
  Download,
  Filter,
  BarChart3
} from "lucide-react";

const performanceData = [
  {
    metric: "Open Rate",
    value: "24.7%",
    change: "+2.3%",
    trend: "up",
    description: "vs last month"
  },
  {
    metric: "Reply Rate", 
    value: "7.2%",
    change: "+0.8%",
    trend: "up",
    description: "vs last month"
  },
  {
    metric: "Click Rate",
    value: "3.1%",
    change: "-0.4%",
    trend: "down", 
    description: "vs last month"
  },
  {
    metric: "Meeting Rate",
    value: "1.8%",
    change: "+0.3%",
    trend: "up",
    description: "vs last month"
  }
];

const channelPerformance = [
  {
    channel: "Email",
    sent: 4329,
    opened: 1069,
    replied: 312,
    openRate: 24.7,
    replyRate: 7.2
  },
  {
    channel: "LinkedIn",
    sent: 2156,
    opened: 589,
    replied: 167,
    openRate: 27.3,
    replyRate: 7.7
  }
];

const topCampaigns = [
  {
    name: "SaaS Founder Outreach Q1",
    sent: 890,
    opened: 234,
    replied: 67,
    openRate: 26.3,
    replyRate: 7.5,
    meetings: 12
  },
  {
    name: "Tech Executive Follow-up",
    sent: 1456,
    opened: 387,
    replied: 89,
    openRate: 26.6,
    replyRate: 6.1,
    meetings: 8
  },
  {
    name: "Product Manager Series",
    sent: 345,
    opened: 78,
    replied: 23,
    openRate: 22.6,
    replyRate: 6.7,
    meetings: 3
  }
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track performance and optimize your outreach campaigns
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceData.map((data, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{data.metric}</p>
                  <p className="text-2xl font-bold">{data.value}</p>
                </div>
                <div className={`p-2 rounded-full ${
                  data.trend === "up" ? "bg-accent/10" : "bg-destructive/10"
                }`}>
                  {data.trend === "up" ? (
                    <TrendingUp className={`w-4 h-4 text-accent`} />
                  ) : (
                    <TrendingDown className={`w-4 h-4 text-destructive`} />
                  )}
                </div>
              </div>
              <div className="flex items-center mt-2">
                <Badge variant={data.trend === "up" ? "default" : "destructive"} className="text-xs">
                  {data.change}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">{data.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Channel Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>
                Compare performance across different outreach channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelPerformance.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {channel.channel === "Email" ? (
                          <Mail className="w-5 h-5 text-primary" />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{channel.channel}</p>
                        <p className="text-sm text-muted-foreground">
                          {channel.sent.toLocaleString()} messages sent
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">{channel.openRate}%</p>
                        <p className="text-xs text-muted-foreground">Open Rate</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-accent">{channel.replyRate}%</p>
                        <p className="text-xs text-muted-foreground">Reply Rate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
              <CardDescription>
                Campaigns with the highest engagement rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCampaigns.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.sent} sent • {campaign.replied} replies • {campaign.meetings} meetings
                      </p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-primary">{campaign.openRate}%</p>
                        <p className="text-xs text-muted-foreground">Open</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-accent">{campaign.replyRate}%</p>
                        <p className="text-xs text-muted-foreground">Reply</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>
                Detailed performance metrics for each campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Campaign-specific analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>Channel Analytics</CardTitle>
              <CardDescription>
                Deep dive into email and LinkedIn performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Channel-specific analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Lead Analytics</CardTitle>
              <CardDescription>
                Analyze lead behavior and conversion patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Lead analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}