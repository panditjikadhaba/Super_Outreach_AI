import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  MoreHorizontal, 
  Users, 
  Mail, 
  MessageSquare,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    status: "active" | "paused" | "completed" | "draft";
    leads: number;
    sent: number;
    opens: number;
    replies: number;
    openRate: number;
    replyRate: number;
    channels: string[];
    createdAt: string;
  };
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent text-white";
      case "paused":
        return "bg-muted text-muted-foreground";
      case "completed":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "active" ? (
      <Pause className="w-4 h-4" />
    ) : (
      <Play className="w-4 h-4" />
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{campaign.name}</CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
              <div className="flex items-center space-x-1">
                {campaign.channels.includes("email") && (
                  <Mail className="w-3 h-3 text-muted-foreground" />
                )}
                {campaign.channels.includes("linkedin") && (
                  <MessageSquare className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round((campaign.sent / campaign.leads) * 100)}%</span>
          </div>
          <Progress value={(campaign.sent / campaign.leads) * 100} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Leads</span>
            </div>
            <p className="text-xl font-semibold">{campaign.leads.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sent</span>
            </div>
            <p className="text-xl font-semibold">{campaign.sent.toLocaleString()}</p>
          </div>
        </div>

        {/* Performance */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{campaign.openRate}%</p>
            <p className="text-xs text-muted-foreground">Open Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{campaign.replyRate}%</p>
            <p className="text-xs text-muted-foreground">Reply Rate</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            {getStatusIcon(campaign.status)}
            <span className="ml-2">
              {campaign.status === "active" ? "Pause" : "Start"}
            </span>
          </Button>
          <Button size="sm" variant="ghost">
            <TrendingUp className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}