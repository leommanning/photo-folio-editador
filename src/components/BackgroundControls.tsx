import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BackgroundControlsProps {
  onRemoveBackground: () => void;
  onChangeBackground: (file: File) => void;
}

const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  onRemoveBackground,
  onChangeBackground,
}) => {
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChangeBackground(file);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Background</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={onRemoveBackground}
        >
          Remove Background
        </Button>
        <Button
          variant="outline"
          onClick={() => backgroundInputRef.current?.click()}
        >
          Change Background
        </Button>
        <input
          ref={backgroundInputRef}
          type="file"
          accept="image/*"
          onChange={handleBackgroundUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default BackgroundControls;