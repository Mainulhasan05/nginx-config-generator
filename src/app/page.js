"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateNginxConfig } from "@/lib/generate-config";
import { useState } from "react";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [port, setPort] = useState("80");
  const [config, setConfig] = useState("");

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!domain) return;

    const generatedConfig = generateNginxConfig(domain, port);
    setConfig(generatedConfig);
  };

  const handleDownload = () => {
    if (!config) return;

    const blob = new Blob([config], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${domain}.conf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Nginx Config Generator</h1>
      <p className="text-center text-red-500 dark:text-gray-400 mb-8">Generate Nginx configuration files for your domain.</p>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Domain Settings</CardTitle>
            <CardDescription>Enter your domain and port to generate an Nginx configuration file.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <Input id="domain" placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" placeholder="80" value={port} onChange={(e) => setPort(e.target.value)} type="number" required />
              </div>

              <Button type="submit" className="w-full cursor-pointer">
                Generate Config
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Configuration</CardTitle>
            <CardDescription>Edit the configuration if needed and download the file.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea className="min-h-[400px] font-mono text-sm" placeholder="Your Nginx configuration will appear here..." value={config} onChange={(e) => setConfig(e.target.value)} />
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownload} disabled={!config} className="w-full">
              Download {domain ? `${domain}.conf` : "Config"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
