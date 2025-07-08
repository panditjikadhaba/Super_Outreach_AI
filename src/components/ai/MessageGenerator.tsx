import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wand2, 
  Copy, 
  RefreshCw, 
  Save,
  Mail,
  MessageSquare,
  User,
  Building,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageGeneratorProps {
  leadData?: {
    name: string;
    company: string;
    title: string;
    industry: string;
  };
}

export function MessageGenerator({ leadData }: MessageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState("professional");
  const [messageType, setMessageType] = useState("email");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const { toast } = useToast();

  const tones = [
    { value: "professional", label: "Professional", color: "bg-blue-100 text-blue-800" },
    { value: "friendly", label: "Friendly", color: "bg-green-100 text-green-800" },
    { value: "direct", label: "Direct", color: "bg-orange-100 text-orange-800" },
    { value: "humorous", label: "Humorous", color: "bg-purple-100 text-purple-800" }
  ];

  const templates = {
    email: [
      {
        name: "Cold Outreach",
        prompt: "Generate a cold email for a {title} at {company} in the {industry} industry. Focus on [value proposition]. Keep it under 100 words."
      },
      {
        name: "Follow-up",
        prompt: "Create a follow-up email for {name} at {company}. Reference previous conversation and provide additional value. Be concise and friendly."
      },
      {
        name: "Meeting Request",
        prompt: "Write an email to {name} requesting a 15-minute discovery call. Highlight the potential benefits for {company}."
      }
    ],
    linkedin: [
      {
        name: "Connection Request",
        prompt: "Create a LinkedIn connection request message for {name}, {title} at {company}. Keep it under 200 characters."
      },
      {
        name: "Direct Message",
        prompt: "Write a LinkedIn DM for {name} at {company}. Focus on providing value and starting a conversation about [topic]."
      }
    ]
  };

  const generateMessage = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual OpenAI API call)
    setTimeout(() => {
      const mockMessage = messageType === "email" 
        ? `Subject: Quick question about ${leadData?.company}'s growth strategy

Hi ${leadData?.name},

I hope this email finds you well. I came across ${leadData?.company} and was impressed by your recent expansion in the ${leadData?.industry} space.

I work with similar companies to help streamline their outreach processes and boost conversion rates by 40-60%. Given your role as ${leadData?.title}, I thought you might be interested in a brief conversation about how we could potentially help ${leadData?.company} scale more efficiently.

Would you be open to a quick 15-minute call this week to discuss?

Best regards,
[Your Name]`
        : `Hi ${leadData?.name},

I noticed your impressive work at ${leadData?.company} in the ${leadData?.industry} space. Would love to connect and share some insights that might help with your current growth initiatives.

Best,
[Your Name]`;

      setGeneratedMessage(mockMessage);
      setIsGenerating(false);
      
      toast({
        title: "Message Generated!",
        description: "Your AI-powered message is ready to use.",
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard.",
    });
  };

  const saveTemplate = () => {
    toast({
      title: "Template Saved!",
      description: "Your message has been saved to templates.",
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wand2 className="w-5 h-5" />
          <span>AI Message Generator</span>
        </CardTitle>
        <CardDescription>
          Generate personalized outreach messages using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={messageType} onValueChange={setMessageType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>LinkedIn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={messageType} className="space-y-6">
            {/* Lead Information */}
            {leadData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Lead Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{leadData.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{leadData.company}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{leadData.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{leadData.industry}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Message Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Message Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((toneOption) => (
                      <SelectItem key={toneOption.value} value={toneOption.value}>
                        <div className="flex items-center space-x-2">
                          <Badge className={toneOption.color}>{toneOption.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Quick Templates</Label>
                <Select onValueChange={(value) => setCustomPrompt(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates[messageType as keyof typeof templates].map((template, index) => (
                      <SelectItem key={index} value={template.prompt}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Custom Instructions (Optional)</Label>
              <Textarea
                id="prompt"
                placeholder="Add specific instructions for the AI (e.g., mention a specific product, include a case study, etc.)"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generateMessage} 
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate {messageType === "email" ? "Email" : "LinkedIn Message"}
                </>
              )}
            </Button>

            {/* Generated Message */}
            {generatedMessage && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Generated Message</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={saveTemplate}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Template
                    </Button>
                    <Button variant="outline" size="sm" onClick={generateMessage}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{generatedMessage}</pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}