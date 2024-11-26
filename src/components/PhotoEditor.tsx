import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { applyFilter, rotateImage, addBorder } from "@/utils/imageUtils";
import { toast } from "sonner";

const PhotoEditor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [scaling, setScaling] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(false);
  const [border, setBorder] = useState(false);
  const [text, setText] = useState("");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPreset = (preset: number) => {
    switch (preset) {
      case 1:
        setBrightness(110);
        setSaturation(120);
        setSepia(false);
        break;
      case 2:
        setBrightness(90);
        setSaturation(80);
        setSepia(true);
        break;
      case 3:
        setBrightness(100);
        setSaturation(100);
        setSepia(false);
        break;
    }
    toast.success(`Preset ${preset} applied`);
  };

  const resetAdjustments = () => {
    setScaling(100);
    setRotation(0);
    setBrightness(100);
    setSaturation(100);
    setSepia(false);
    setBorder(false);
    setText("");
    toast.info("All adjustments reset");
  };

  const saveImage = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "edited-photo.png";
      link.href = canvasRef.current.toDataURL();
      link.click();
      toast.success("Image saved successfully!");
    }
  };

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Apply transformations
      ctx.translate(canvas.width/2, canvas.height/2);
      rotateImage(canvas, rotation);
      ctx.scale(scaling/100, scaling/100);
      ctx.translate(-canvas.width/2, -canvas.height/2);
      
      // Apply filters
      applyFilter(canvas, "brightness", brightness);
      applyFilter(canvas, "saturation", saturation);
      if (sepia) applyFilter(canvas, "sepia", 100);
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Add border if enabled
      if (border) {
        addBorder(canvas, 10, "#000000");
      }
      
      // Add text if present
      if (text) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width/2, canvas.height - 30);
      }
      
      ctx.restore();
    };
  }, [image, scaling, rotation, brightness, saturation, sepia, border, text]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Image Preview */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {image ? (
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400">
                  No image uploaded
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-white"
              >
                Upload Image
              </Button>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Adjustments</h3>
              
              <div className="space-y-2">
                <label className="text-sm">Scaling</label>
                <Slider
                  value={[scaling]}
                  onValueChange={(v) => setScaling(v[0])}
                  min={50}
                  max={150}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Rotation</label>
                <Slider
                  value={[rotation]}
                  onValueChange={(v) => setRotation(v[0])}
                  min={-180}
                  max={180}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Brightness</label>
                <Slider
                  value={[brightness]}
                  onValueChange={(v) => setBrightness(v[0])}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Saturation</label>
                <Slider
                  value={[saturation]}
                  onValueChange={(v) => setSaturation(v[0])}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Options</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sepia"
                  checked={sepia}
                  onCheckedChange={(checked) => setSepia(checked as boolean)}
                />
                <label htmlFor="sepia">Sepia</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="border"
                  checked={border}
                  onCheckedChange={(checked) => setBorder(checked as boolean)}
                />
                <label htmlFor="border">Add Border</label>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Add Text</label>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Presets</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    onClick={() => applyPreset(preset)}
                  >
                    Preset {preset}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => toast.info("Background removal coming soon!")}
                >
                  Remove Background
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info("Background change coming soon!")}
                >
                  Change Background
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={resetAdjustments}
                >
                  Reset Adjustments
                </Button>
                <Button
                  className="bg-secondary"
                  onClick={saveImage}
                >
                  Save Image
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;