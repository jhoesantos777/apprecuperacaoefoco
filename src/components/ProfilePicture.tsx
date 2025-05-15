import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfilePictureProps {
  avatarUrl?: string | null;
  userId: string;
  userName?: string | null;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onImageUpdated?: (url: string) => void;
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-24 w-24"
};

export const ProfilePicture = ({ 
  avatarUrl, 
  userId, 
  userName, 
  size = "md", 
  editable = false,
  onImageUpdated 
}: ProfilePictureProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Create profiles-pictures bucket if it doesn't exist (safety measure)
      const { error: bucketError } = await supabase.storage
        .createBucket('profile-pictures', { public: true })
        .catch(() => ({ error: null })); // Ignore if bucket already exists
      
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onImageUpdated?.(publicUrl);
      
      toast("Foto atualizada com sucesso!");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast("Não foi possível atualizar sua foto de perfil.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className={`border-2 border-white ${sizeClasses[size]}`}>
        <AvatarImage src={avatarUrl || ''} alt={userName || 'Profile'} />
        <AvatarFallback>
          {userName?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      {editable && (
        <div className="absolute -bottom-2 -right-2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full h-8 w-8 p-0"
            disabled={isUploading}
          >
            <label className="cursor-pointer w-full h-full flex items-center justify-center">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </Button>
        </div>
      )}
    </div>
  );
};
