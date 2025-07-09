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
  MoreHorizontal,
  Loader2,
  Send
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  useTemplates, 
  useCreateTemplate, 
  useUpdateTemplate, 
  useDeleteTemplate,
  useLeads,
  useCreateMessage
} from "@/hooks/useSupabase";
import { MessageGenerator } from "@/components/ai/MessageGenerator";

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
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isUseTemplateOpen, setIsUseTemplateOpen] = useState(false);
  const { toast } = useToast();

  // Database hooks
  const { data: templates = [], isLoading } = useTemplates();
  const { data: leads = [] } = useLeads();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();
  const createMessage = useCreateMessage();

  const [formData, setFormData] = useState({
    name: "",
    channel: "",
    message_type: "",
    tone: "professional",
    subject_template: "",
    content_template: ""
  });

  const filteredTemplates = templates.filter((template: any) => {
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

  const handleCreateTemplate = async () => {
    if (!formData.name || !formData.channel || !formData.message_type || !formData.content_template) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTemplate.mutateAsync(formData);
      toast({
        title: "Template Created",
        description: `Template "${formData.name}" has been created successfully.`,
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        ...formData
      });
      toast({
        title: "Template Updated",
        description: `Template "${formData.name}" has been updated successfully.`,
      });
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (template: any) => {
    try {
      await deleteTemplate.mutateAsync(template.id);
      toast({
        title: "Template Deleted",
        description: `Template "${template.name}" has been deleted.`,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      });
    }
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

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsUseTemplateOpen(true);
  };

  const handleSendMessage = async (leadId: string) => {
    if (!selectedTemplate || !leadId) return;

    const lead = leads.find((l: any) => l.id === leadId);
    if (!lead) return;

    try {
      // Replace template variables with lead data
      const personalizedSubject = selectedTemplate.subject_template
        ?.replace(/\{\{name\}\}/g, lead.name || '')
        .replace(/\{\{company\}\}/g, lead.company || '')
        .replace(/\{\{title\}\}/g, lead.title || '')
        .replace(/\{\{industry\}\}/g, lead.industry || '');

      const personalizedContent = selectedTemplate.content_template
        .replace(/\{\{name\}\}/g, lead.name || '')
        .replace(/\{\{company\}\}/g, lead.company || '')
        .replace(/\{\{title\}\}/g, lead.title || '')
        .replace(/\{\{industry\}\}/g, lead.industry || '');

      await createMessage.mutateAsync({
        lead_id: leadId,
        campaign_id: lead.campaign_id,
        channel: selectedTemplate.channel,
        message_type: 'outbound',
        subject: personalizedSubject,
        content: personalizedContent,
        status: 'draft',
        ai_generated: false
      });

      toast({
        title: "Message Created",
        description: `Message created for ${lead.name} using template "${selectedTemplate.name}".`,
      });
      setIsUseTemplateOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create message. Please try again.",
        variant: "destructive",
      });
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

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
          <Button variant="outline" onClick={() => setIsAIGeneratorOpen(true)}>
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
                    <Label htmlFor="name">Template Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Cold Email - SaaS Founders"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="channel">Channel *</Label>
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
                    <Label htmlFor="message_type">Message Type *</Label>
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
                  <Label htmlFor="content_template">Message Template *</Label>
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
                  <Button 
                    onClick={handleCreateTemplate}
                    disabled={createTemplate.isPending}
                  >
                    {createTemplate.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Template"
                    )}
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
            <p className="text-2xl font-bold mt-2">{templates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Email Templates</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {templates.filter((t: any) => t.channel === 'email').length}
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
              {templates.filter((t: any) => t.channel !== 'email').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Wand2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Active Leads</span>
            </div>
            <p className="text-2xl font-bold mt-2">{leads.length}</p>
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
        {filteredTemplates.map((template: any) => {
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
                      <DropdownMenuItem onClick={() => handleUseTemplate(template)}>
                        <Send className="w-4 h-4 mr-2" />
                        Use Template
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
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" onClick={() => setPreviewTemplate(template)}>
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" onClick={() => handleUseTemplate(template)}>
                      <Send className="w-3 h-3 mr-1" />
                      Use
                    </Button>
                  </div>
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
              <Button 
                onClick={handleEditTemplate}
                disabled={updateTemplate.isPending}
              >
                {updateTemplate.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Template"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Use Template Dialog */}
      <Dialog open={isUseTemplateOpen} onOpenChange={setIsUseTemplateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Use Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Select a lead to send this message to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto space-y-2">
              {leads.map((lead: any) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.company} • {lead.title}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendMessage(lead.id);
                    }}
                    disabled={createMessage.isPending}
                  >
                    {createMessage.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Create Message
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
            {leads.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No leads available. Create some leads first.</p>
              </div>
            )}
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
                      {(previewTemplate.subject_template || '')
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
                    {(previewTemplate.content_template || '')
                      .replace(/\{\{name\}\}/g, "John Smith")
                      .replace(/\{\{company\}\}/g, "TechCorp Inc")
                      .replace(/\{\{title\}\}/g, "VP of Marketing")
                      .replace(/\{\{industry\}\}/g, "SaaS")
                    }
                  </pre>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setPreviewTemplate(null);
                  handleUseTemplate(previewTemplate);
                }}>
                  <Send className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Generator Dialog */}
      <Dialog open={isAIGeneratorOpen} onOpenChange={setIsAIGeneratorOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI Message Generator</DialogTitle>
            <DialogDescription>
              Generate personalized messages using AI
            </DialogDescription>
          </DialogHeader>
          <MessageGenerator 
            leadData={{
              name: "Sample Lead",
              company: "Sample Company",
              title: "Sample Title",
              industry: "Sample Industry"
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}