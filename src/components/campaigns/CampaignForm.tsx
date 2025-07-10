import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCreateCampaign } from "@/hooks/useSupabase";

interface CampaignFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CampaignForm({ onSuccess, onCancel }: CampaignFormProps) {
  const { toast } = useToast();
  const createCampaign = useCreateCampaign();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    target_audience: "",
    channels: [] as string[],
    status: "draft"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const channelOptions = [
    { value: "email", label: "Email" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "sms", label: "SMS" }
  ];

  const handleChannelChange = (channel: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        channels: [...formData.channels, channel]
      });
    } else {
      setFormData({
        ...formData,
        channels: formData.channels.filter(c => c !== channel)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createCampaign.mutateAsync(formData);
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully.",
      });
      
      onSuccess?.();
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        target_audience: "",
        channels: [],
        status: "draft"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
        <CardDescription>
          Set up a new outreach campaign across multiple channels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Q1 SaaS Outreach"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the goals and strategy for this campaign..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_audience">Target Audience</Label>
            <Input
              id="target_audience"
              value={formData.target_audience}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
              placeholder="SaaS founders, Marketing VPs, etc."
            />
          </div>

          <div className="space-y-3">
            <Label>Channels *</Label>
            <div className="grid grid-cols-2 gap-3">
              {channelOptions.map((channel) => (
                <div key={channel.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={channel.value}
                    checked={formData.channels.includes(channel.value)}
                    onCheckedChange={(checked) => 
                      handleChannelChange(channel.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={channel.value} className="text-sm font-normal">
                    {channel.label}
                  </Label>
                </div>
              ))}
            </div>
            {formData.channels.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Select at least one channel for your campaign
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting || formData.channels.length === 0}
            >
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}