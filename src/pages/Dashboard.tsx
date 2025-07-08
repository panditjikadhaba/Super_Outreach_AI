import { StatsCard } from "@/components/dashboard/StatsCard";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Mail, 
  TrendingUp, 
  Calendar,
  Plus,
  BarChart3,
  FileText,
  MessageSquare
} from "lucide-react";

const mockStats = [
  {
    title: "Total Leads",
    value: "12,847",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    description: "vs last month"
  },
  {
    title: "Emails Sent",
    value: "4,329",
    change: "+8%",
    changeType: "positive" as const,
    icon: Mail,
    description: "this month"
  },
  {
    title: "Reply Rate",
    value: "23.4%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "average"
  },
  {
    title: "Meetings Booked",
    value: "156",
    change: "+15%",
    changeType: "positive" as const,
    icon: Calendar,
    description: "this month"
  }
];

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
  }
];

const recentActivity = [
  {
    type: "reply",
    content: "Sarah Johnson replied to 'SaaS Founder Outreach Q1'",
    time: "2 minutes ago",
    icon: MessageSquare,
    color: "text-accent"
  },
  {
    type: "open",
    content: "Email opened by Michael Chen - 'Tech Executive Follow-up'",
    time: "5 minutes ago", 
    icon: Mail,
    color: "text-primary"
  },
  {
    type: "campaign",
    content: "Campaign 'Product Manager Series' was paused",
    time: "1 hour ago",
    icon: BarChart3,
    color: "text-muted-foreground"
  },
  {
    type: "lead",
    content: "125 new leads imported from 'enterprise_contacts.csv'",
    time: "2 hours ago",
    icon: Users,
    color: "text-accent"
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your outreach campaigns.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Campaigns</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {mockCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`mt-1 ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.content}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Import Leads
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Create Email Template
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                LinkedIn Sequence
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}