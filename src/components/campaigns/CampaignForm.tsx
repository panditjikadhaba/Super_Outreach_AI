import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";
import { useCreateCampaign } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

interface CampaignFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const channelOptions = [
  { value: "email", label: "Email" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "sms", label: "SMS" }
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" }
];

export function CampaignForm({ onSuccess, onCancel }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "draft",
    target_audience: "",
    channels: [] as string[]
  });

  const createCampaign = useCreateCampaign();
  const { toast } = useToast();

  const handleChannelChange = (channel: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        channels: [...prev.channels, channel]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        channels: prev.channels.filter(c => c !== channel)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Campaign name is required.",
        variant: "destructive",
      });
      return;
    }

    if (formData.channels.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one channel.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCampaign.mutateAsync(formData);
      toast({
        title: "Campaign Created",
        description: `Campaign "${formData.name}" has been created successfully.`,
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
        <CardDescription>
          Set up a new outreach campaign to manage your leads and messages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., SaaS Founder Outreach Q1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your campaign goals and strategy..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_audience">Target Audience</Label>
            <Input
              id="target_audience"
              value={formData.target_audience}
              onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
              placeholder="e.g., SaaS founders with 10-50 employees"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Channels *</Label>
            <div className="grid grid-cols-2 gap-3">
              {channelOptions.map((channel) => (
                <div key={channel.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={channel.value}
                    checked={formData.channels.includes(channel.value)}
                    onCheckedChange={(checked) => handleChannelChange(channel.value, checked as boolean)}
                  />
                  <Label htmlFor={channel.value} className="text-sm font-normal">
                    {channel.label}
                  </Label>
                </div>
              ))}
            </div>
            {formData.channels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.channels.map((channel) => (
                  <Badge key={channel} variant="secondary" className="flex items-center gap-1">
                    {channelOptions.find(c => c.value === channel)?.label}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleChannelChange(channel, false)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={createCampaign.isPending}
            >
              {createCampaign.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}