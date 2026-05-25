'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCodeStyling from 'qr-code-styling';

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  shortId: string;
}

const getQRCodeConfig = (style: string, url: string, size: number = 300) => {
  const baseConfig = {
    width: size,
    height: size,
    type: "canvas" as const,
    data: url,
    qrOptions: {
      errorCorrectionLevel: "M" as const
    }
  };

  switch (style) {
    case 'classic':
      return {
        ...baseConfig,
        dotsOptions: {
          color: "#ea580c",
          type: "square" as const
        },
        backgroundOptions: {
          color: "#ffffff"
        },
        cornersSquareOptions: {
          color: "#ea580c",
          type: "square" as const
        },
        cornersDotOptions: {
          color: "#ea580c",
          type: "square" as const
        }
      };

    case 'rounded':
      return {
        ...baseConfig,
        dotsOptions: {
          color: "#ea580c",
          type: "rounded" as const
        },
        backgroundOptions: {
          color: "#ffffff"
        },
        cornersSquareOptions: {
          color: "#ea580c",
          type: "extra-rounded" as const
        },
        cornersDotOptions: {
          color: "#ffffff",
          type: "dot" as const
        }
      };

    case 'gradient':
      return {
        ...baseConfig,
        dotsOptions: {
          type: "rounded" as const,
          gradient: {
            type: "linear" as const,
            rotation: 45,
            colorStops: [
              { offset: 0, color: "#f97316" },
              { offset: 1, color: "#ea580c" }
            ]
          }
        },
        backgroundOptions: {
          color: "#ffffff"
        },
        cornersSquareOptions: {
          type: "extra-rounded" as const,
          gradient: {
            type: "linear" as const,
            rotation: 0,
            colorStops: [
              { offset: 0, color: "#f97316" },
              { offset: 1, color: "#dc2626" }
            ]
          }
        },
        cornersDotOptions: {
          color: "#ffffff",
          type: "dot" as const
        }
      };

    case 'minimal':
      return {
        ...baseConfig,
        dotsOptions: {
          color: "#000000",
          type: "square" as const
        },
        backgroundOptions: {
          color: "#ffffff"
        },
        cornersSquareOptions: {
          color: "#000000",
          type: "square" as const
        },
        cornersDotOptions: {
          color: "#000000",
          type: "square" as const
        }
      };

    case 'dots':
      return {
        ...baseConfig,
        dotsOptions: {
          color: "#ea580c",
          type: "dots" as const
        },
        backgroundOptions: {
          color: "#ffffff"
        },
        cornersSquareOptions: {
          color: "#ea580c",
          type: "extra-rounded" as const
        },
        cornersDotOptions: {
          color: "#ea580c",
          type: "dot" as const
        }
      };

    default:
      return {
        ...baseConfig,
        dotsOptions: {
          color: "#ea580c",
          type: "square" as const
        },
        backgroundOptions: {
          color: "#ffffff"
        },
        cornersSquareOptions: {
          color: "#ea580c",
          type: "square" as const
        },
        cornersDotOptions: {
          color: "#ea580c",
          type: "square" as const
        }
      };
  }
};

export function QRCodeDialog({ open, onOpenChange, url, shortId }: QRCodeDialogProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [style, setStyle] = useState<string>('classic');
  const [size, setSize] = useState<number>(300);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      generateQRCode();
    }
  }, [open, style, size]);

  const generateQRCode = async () => {
    try {
      setGenerating(true);
      const qrCode = new QRCodeStyling(getQRCodeConfig(style, url, size));
      
      const buffer = await qrCode.getRawData('png');
      if (!buffer) return;

      // Convert to blob
      let blob: Blob;
      if (buffer instanceof Blob) {
        blob = buffer;
      } else {
        const arrayBuffer = buffer instanceof ArrayBuffer ? buffer : await new Response(buffer as any).arrayBuffer();
        blob = new Blob([arrayBuffer], { type: 'image/png' });
      }
      
      // Convert blob to base64 data URL for proper display
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrDataUrl(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('QR Code generation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `orangeurl-${shortId}.png`;
    link.click();
    toast({
      title: 'Downloaded',
      description: 'QR code has been downloaded',
      variant: 'success',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    });
  };

  const handleCopy = async () => {
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);

      toast({
        title: 'Copied',
        description: 'QR code has been copied to clipboard',
        variant: 'success',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy QR code',
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Customize QR Code</DialogTitle>
          <DialogDescription>
            Choose a style and download or copy your QR code
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Style Options */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select
                value={size.toString()}
                onValueChange={(value) => setSize(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">Small (200px)</SelectItem>
                  <SelectItem value="300">Medium (300px)</SelectItem>
                  <SelectItem value="400">Large (400px)</SelectItem>
                  <SelectItem value="500">X-Large (500px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="flex items-center justify-center p-6 bg-muted/50 rounded-lg min-h-[300px]">
            {generating ? (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </div>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="max-w-full h-auto"
                style={{ maxHeight: '400px' }}
              />
            ) : (
              <div className="text-muted-foreground">No preview</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleDownload}
              disabled={!qrDataUrl || generating}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleCopy}
              disabled={!qrDataUrl || generating}
              variant="outline"
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}