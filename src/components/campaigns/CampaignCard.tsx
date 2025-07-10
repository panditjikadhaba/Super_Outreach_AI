import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  MoreVertical, 
  Users, 
  Mail, 
  Eye, 
  MessageSquare,
  BarChart3
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
    status: string;
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      default: return null;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{campaign.name}</CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <Badge className={getStatusColor(campaign.status)}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(campaign.status)}
                  <span>{campaign.status}</span>
                </div>
              </Badge>
              <span className="text-sm">Created {formatDate(campaign.createdAt)}</span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Play className="w-4 h-4 mr-2" />
                {campaign.status === 'active' ? 'Pause' : 'Start'} Campaign
              </DropdownMenuItem>
              <DropdownMenuItem>
                Edit Campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Channels */}
        <div className="flex flex-wrap gap-1">
          {campaign.channels.map((channel) => (
            <Badge key={channel} variant="outline" className="text-xs">
              {channel}
            </Badge>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Leads</span>
            </div>
            <p className="text-xl font-bold">{campaign.leads}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sent</span>
            </div>
            <p className="text-xl font-bold">{campaign.sent}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Opens</span>
            </div>
            <p className="text-xl font-bold">{campaign.opens}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Replies</span>
            </div>
            <p className="text-xl font-bold">{campaign.replies}</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3 pt-2 border-t">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Open Rate</span>
              <span>{campaign.openRate}%</span>
            </div>
            <Progress value={campaign.openRate} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Reply Rate</span>
              <span>{campaign.replyRate}%</span>
            </div>
            <Progress value={campaign.replyRate} className="h-2" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button size="sm" className="flex-1">
            {campaign.status === 'active' ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}