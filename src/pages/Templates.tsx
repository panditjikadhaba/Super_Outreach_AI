import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter,
  Edit,
  Copy,
  Trash2,
  Mail,
  MessageSquare,
  FileText,
  Wand2,
  Eye,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const mockTemplates = [
  {
    id: "1",
    name: "Cold Email - SaaS Founders",
    channel: "email",
    message_type: "cold_outreach",
    tone: "professional",
    subject_template: "Quick question about {{company}}'s growth strategy",
    content_template: "Hi {{name}},\n\nI noticed {{company}} has been growing rapidly in the {{industry}} space. I'm curious - what's your biggest challenge when it comes to scaling your customer acquisition?\n\nI've helped similar companies like [Company A] and [Company B] increase their conversion rates by 40%+ through strategic optimization.\n\nWould you be open to a brief 15-minute call this week to discuss how this might apply to {{company}}?\n\nBest regards,\n[Your Name]",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "LinkedIn Connection Request",
    channel: "linkedin",
    message_type: "cold_outreach",
    tone: "friendly",
    subject_template: null,
    content_template: "Hi {{name}}, I'd love to connect! I saw your work at {{company}} and would enjoy learning more about your experience in {{industry}}.",
    created_at: "2024-01-14T14:20:00Z",
    updated_at: "2024-01-14T14:20:00Z"
  },
  {
    id: "3",
    name: "Follow-up Email - No Response",
    channel: "email",
    message_type: "follow_up",
    tone: "direct",
    subject_template: "Re: {{previous_subject}}",
    content_template: "Hi {{name}},\n\nI wanted to follow up on my previous email about helping {{company}} with [specific benefit].\n\nI understand you're busy, so I'll keep this brief. Would a quick 10-minute call work better for you?\n\nIf this isn't a priority right now, just let me know and I'll circle back in a few months.\n\nThanks,\n[Your Name]",
    created_at: "2024-01-13T09:15:00Z",
    updated_at: "2024-01-13T09:15:00Z"
  },
  {
    id: "4",
    name: "Meeting Request - Warm Lead",
    channel: "email",
    message_type: "meeting_request",
    tone: "professional",
    subject_template: "Meeting request - {{company}} growth discussion",
    content_template: "Hi {{name}},\n\nThanks for your interest in learning more about how we can help {{company}}.\n\nI'd love to schedule a brief call to:\n- Understand your current challenges\n- Share relevant case studies\n- Discuss potential solutions\n\nI have availability:\n- [Time slot 1]\n- [Time slot 2]\n- [Time slot 3]\n\nWhich works best for you?\n\nLooking forward to our conversation!\n\n[Your Name]",
    created_at: "2024-01-12T16:45:00Z",
    updated_at: "2024-01-12T16:45:00Z"
  },
  {
    id: "5",
    name: "Thank You - Post Meeting",
    channel: "email",
    message_type: "thank_you",
    tone: "friendly",
    subject_template: "Thanks for the great conversation, {{name}}!",
    content_template: "Hi {{name}},\n\nThank you for taking the time to speak with me today about {{company}}'s goals.\n\nAs promised, I'm attaching:\n- [Resource 1]\n- [Resource 2]\n- Next steps document\n\nI'll follow up early next week with the proposal we discussed.\n\nHave a great rest of your week!\n\n[Your Name]",
    created_at: "2024-01-11T11:30:00Z",
    updated_at: "2024-01-11T11:30:00Z"
  }
];

const channelOptions = [
  { value: "email", label: "Email", icon: Mail },
  { value: "linkedin", label: "LinkedIn", icon: MessageSquare },
  { value: "facebook", label: "Facebook", icon: MessageSquare },
  { value: "instagram", label: "Instagram", icon: MessageSquare },
  { value: "sms", label: "SMS", icon: MessageSquare }
];

const messageTypeOptions = [
  { value: "cold_outreach", label: "Cold Outreach" },
  { value: "follow_up", label: "Follow-up" },
  { value: "meeting_request", label: "Meeting Request" },
  { value: "thank_you", label: "Thank You" }
];

const toneOptions = [
  { value: "professional", label: "Professional", color: "bg-blue-100 text-blue-800" },
  { value: "friendly", label: "Friendly", color: "bg-green-100 text-green-800" },
  { value: "direct", label: "Direct", color: "bg-orange-100 text-orange-800" },
  { value: "humorous", label: "Humorous", color: "bg-purple-100 text-purple-800" }
];

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    channel: "",
    message_type: "",
    tone: "professional",
    subject_template: "",
    content_template: ""
  });

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content_template.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = selectedChannel === "all" || template.channel === selectedChannel;
    const matchesType = selectedType === "all" || template.message_type === selectedType;
    
    return matchesSearch && matchesChannel && matchesType;
  });

  const getChannelIcon = (channel: string) => {
    const channelOption = channelOptions.find(opt => opt.value === channel);
    return channelOption ? channelOption.icon : Mail;
  };

  const getToneColor = (tone: string) => {
    const toneOption = toneOptions.find(opt => opt.value === tone);
    return toneOption ? toneOption.color : "bg-gray-100 text-gray-800";
  };

  const handleCreateTemplate = () => {
    // Here you would typically call your API to create the template
    toast({
      title: "Template Created",
      description: `Template "${formData.name}" has been created successfully.`,
    });
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditTemplate = () => {
    // Here you would typically call your API to update the template
    toast({
      title: "Template Updated",
      description: `Template "${formData.name}" has been updated successfully.`,
    });
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteTemplate = (template: any) => {
    // Here you would typically call your API to delete the template
    toast({
      title: "Template Deleted",
      description: `Template "${template.name}" has been deleted.`,
      variant: "destructive",
    });
  };

  const handleDuplicateTemplate = (template: any) => {
    setFormData({
      name: `${template.name} (Copy)`,
      channel: template.channel,
      message_type: template.message_type,
      tone: template.tone,
      subject_template: template.subject_template || "",
      content_template: template.content_template
    });
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      channel: "",
      message_type: "",
      tone: "professional",
      subject_template: "",
      content_template: ""
    });
  };

  const openEditDialog = (template: any) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      channel: template.channel,
      message_type: template.message_type,
      tone: template.tone,
      subject_template: template.subject_template || "",
      content_template: template.content_template
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Message Templates</h1>
          <p className="text-muted-foreground">
            Create and manage reusable message templates for your outreach campaigns
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Wand2 className="w-4 h-4 mr-2" />
            AI Generate
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a reusable message template for your outreach campaigns.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Cold Email - SaaS Founders"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="channel">Channel</Label>
                    <Select value={formData.channel} onValueChange={(value) => setFormData({...formData, channel: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        {channelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <option.icon className="w-4 h-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="message_type">Message Type</Label>
                    <Select value={formData.message_type} onValueChange={(value) => setFormData({...formData, message_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {messageTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <Badge className={option.color}>{option.label}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.channel === "email" && (
                  <div className="space-y-2">
                    <Label htmlFor="subject_template">Subject Template</Label>
                    <Input
                      id="subject_template"
                      value={formData.subject_template}
                      onChange={(e) => setFormData({...formData, subject_template: e.target.value})}
                      placeholder="e.g., Quick question about {{company}}'s growth"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="content_template">Message Template</Label>
                  <Textarea
                    id="content_template"
                    value={formData.content_template}
                    onChange={(e) => setFormData({...formData, content_template: e.target.value})}
                    placeholder="Use {{name}}, {{company}}, {{title}}, {{industry}} for personalization..."
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use variables like {{name}}, {{company}}, {{title}}, {{industry}} for personalization
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    Create Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Templates</span>
            </div>
            <p className="text-2xl font-bold mt-2">{mockTemplates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Email Templates</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {mockTemplates.filter(t => t.channel === 'email').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Social Templates</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {mockTemplates.filter(t => t.channel !== 'email').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Wand2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">AI Generated</span>
            </div>
            <p className="text-2xl font-bold mt-2">12</p>
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
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                {channelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {messageTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const ChannelIcon = getChannelIcon(template.channel);
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1">
                        <ChannelIcon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground capitalize">
                          {template.channel}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {template.message_type.replace('_', ' ')}
                      </Badge>
                      <Badge className={getToneColor(template.tone)}>
                        {template.tone}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setPreviewTemplate(template)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(template)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteTemplate(template)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {template.subject_template && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                    <p className="text-sm font-medium truncate">{template.subject_template}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Content Preview:</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {template.content_template}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    Updated {new Date(template.updated_at).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setPreviewTemplate(template)}>
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>No templates found</CardTitle>
            <CardDescription>
              {searchTerm 
                ? `No templates match your search criteria`
                : `Create your first message template to get started`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update your message template.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Template Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-channel">Channel</Label>
                <Select value={formData.channel} onValueChange={(value) => setFormData({...formData, channel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {channelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <option.icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-message_type">Message Type</Label>
                <Select value={formData.message_type} onValueChange={(value) => setFormData({...formData, message_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tone">Tone</Label>
                <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <Badge className={option.color}>{option.label}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formData.channel === "email" && (
              <div className="space-y-2">
                <Label htmlFor="edit-subject_template">Subject Template</Label>
                <Input
                  id="edit-subject_template"
                  value={formData.subject_template}
                  onChange={(e) => setFormData({...formData, subject_template: e.target.value})}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-content_template">Message Template</Label>
              <Textarea
                id="edit-content_template"
                value={formData.content_template}
                onChange={(e) => setFormData({...formData, content_template: e.target.value})}
                rows={8}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditTemplate}>
                Update Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            <DialogDescription>
              Template preview with sample data
            </DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                <Badge className={getToneColor(previewTemplate.tone)}>
                  {previewTemplate.tone}
                </Badge>
                <Badge variant="outline">
                  {previewTemplate.message_type.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  {previewTemplate.channel}
                </Badge>
              </div>
              
              {previewTemplate.subject_template && (
                <div>
                  <Label className="text-sm font-medium">Subject:</Label>
                  <div className="mt-1 p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      {previewTemplate.subject_template
                        .replace(/\{\{name\}\}/g, "John Smith")
                        .replace(/\{\{company\}\}/g, "TechCorp Inc")
                        .replace(/\{\{title\}\}/g, "VP of Marketing")
                        .replace(/\{\{industry\}\}/g, "SaaS")
                      }
                    </p>
                  </div>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Message:</Label>
                <div className="mt-1 p-3 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">
                    {previewTemplate.content_template
                      .replace(/\{\{name\}\}/g, "John Smith")
                      .replace(/\{\{company\}\}/g, "TechCorp Inc")
                      .replace(/\{\{title\}\}/g, "VP of Marketing")
                      .replace(/\{\{industry\}\}/g, "SaaS")
                    }
                  </pre>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}