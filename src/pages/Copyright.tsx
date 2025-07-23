import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Scale, 
  Eye, 
  Download,
  Mail,
  ExternalLink,
  Copyright as CopyrightIcon,
  Gavel,
  Users,
  Clock
} from "lucide-react";

const Copyright = () => {
  const copyrightInfo = {
    owner: "Cuong Lam Kim Huynh",
    year: "2024",
    projectName: "AI Agent System",
    lastUpdated: "January 22, 2024"
  };

  const intellectualPropertyItems = [
    { type: "Source Code", description: "All source code, algorithms, and implementation logic", status: "Protected" },
    { type: "UI/UX Design", description: "User interface design, layouts, and user experience patterns", status: "Protected" },
    { type: "Documentation", description: "Technical documentation, user guides, and API specifications", status: "Protected" },
    { type: "AI Models", description: "Trained models, neural network architectures, and training data", status: "Protected" },
    { type: "Brand Assets", description: "Logos, trademarks, and brand identity elements", status: "Protected" }
  ];

  const violations = [
    {
      id: "1",
      type: "Code Copying",
      description: "Unauthorized reproduction of source code without permission",
      severity: "High",
      action: "Cease and Desist",
      reportedDate: "2024-01-20"
    },
    {
      id: "2", 
      type: "Design Infringement",
      description: "Copying of user interface design elements and layouts",
      severity: "Medium",
      action: "DMCA Notice",
      reportedDate: "2024-01-18"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Copyright & Intellectual Property</h1>
            <p className="text-muted-foreground">
              Legal protection and infringement management for AI Agent System
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Notice
            </Button>
            <Button>
              <Mail className="h-4 w-4 mr-2" />
              Report Infringement
            </Button>
          </div>
        </div>

        {/* Copyright Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CopyrightIcon className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">© {copyrightInfo.year}</p>
                  <p className="text-sm text-muted-foreground">Copyright Year</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-lg font-bold">{copyrightInfo.owner}</p>
                  <p className="text-sm text-muted-foreground">Copyright Owner</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{intellectualPropertyItems.length}</p>
                  <p className="text-sm text-muted-foreground">Protected Assets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{violations.length}</p>
                  <p className="text-sm text-muted-foreground">Active Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="notice" className="space-y-6">
          <TabsList>
            <TabsTrigger value="notice">Copyright Notice</TabsTrigger>
            <TabsTrigger value="protected">Protected Content</TabsTrigger>
            <TabsTrigger value="violations">Infringement Cases</TabsTrigger>
            <TabsTrigger value="policy">Legal Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="notice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CopyrightIcon className="h-5 w-5" />
                  Official Copyright Notice
                </CardTitle>
                <CardDescription>
                  Legal copyright declaration for {copyrightInfo.projectName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Copyright Notice</h3>
                    <p className="text-lg">
                      © {copyrightInfo.year} <strong>{copyrightInfo.owner}</strong>. All rights reserved.
                    </p>
                    <div className="space-y-2">
                      <p>
                        This {copyrightInfo.projectName} and all associated materials, including but not limited to:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Source code and software algorithms</li>
                        <li>User interface designs and layouts</li>
                        <li>Documentation and technical specifications</li>
                        <li>AI models and training methodologies</li>
                        <li>Database schemas and data structures</li>
                        <li>Brand assets and visual identity elements</li>
                      </ul>
                      <p className="mt-4">
                        are the exclusive property of <strong>{copyrightInfo.owner}</strong> and are protected under 
                        international copyright laws and treaties.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Rights Reserved
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Reproduction rights</li>
                      <li>• Distribution rights</li>
                      <li>• Modification rights</li>
                      <li>• Commercial use rights</li>
                      <li>• Public display rights</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Legal Information
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Copyright Owner:</strong> {copyrightInfo.owner}</p>
                      <p><strong>Registration Year:</strong> {copyrightInfo.year}</p>
                      <p><strong>Last Updated:</strong> {copyrightInfo.lastUpdated}</p>
                      <p><strong>Jurisdiction:</strong> International</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="protected" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Protected Intellectual Property</CardTitle>
                <CardDescription>
                  Complete inventory of copyrighted materials and assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intellectualPropertyItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.type}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="default">
                          {item.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="violations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Copyright Infringement Cases</CardTitle>
                    <CardDescription>
                      Active and resolved copyright violation reports
                    </CardDescription>
                  </div>
                  <Button>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report New Violation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {violations.map((violation) => (
                    <div key={violation.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{violation.type}</h4>
                            <Badge className={getSeverityColor(violation.severity)}>
                              {violation.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {violation.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Reported: {violation.reportedDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Gavel className="h-3 w-3" />
                              Action: {violation.action}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Send Notice
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Legal Policy & Terms</CardTitle>
                <CardDescription>
                  Copyright policies and legal guidelines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Copyright Infringement Policy</h4>
                    <p className="text-sm text-muted-foreground">
                      {copyrightInfo.owner} takes copyright infringement seriously. Unauthorized use of any 
                      copyrighted materials is strictly prohibited and will result in legal action.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">DMCA Compliance</h4>
                    <p className="text-sm text-muted-foreground">
                      We comply with the Digital Millennium Copyright Act (DMCA) and respond promptly to 
                      valid takedown notices. All reported violations are investigated within 24-48 hours.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Fair Use Guidelines</h4>
                    <p className="text-sm text-muted-foreground">
                      Limited use for educational, research, or review purposes may be permitted under fair use 
                      doctrine. Commercial use requires explicit written permission from {copyrightInfo.owner}.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <p className="text-sm text-muted-foreground">
                      For licensing inquiries, permission requests, or to report copyright infringement, 
                      please contact our legal department through the official channels provided.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Copyright;