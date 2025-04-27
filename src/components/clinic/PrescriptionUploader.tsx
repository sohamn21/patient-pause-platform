
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PrescriptionUploaderProps {
  appointmentId: string;
  patientId: string;
  onUploadComplete?: (prescriptionUrl: string) => void;
}

export function PrescriptionUploader({ appointmentId, patientId, onUploadComplete }: PrescriptionUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type (PDF, images)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or image file (JPG, PNG)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Missing file",
        description: "Please select a prescription file to upload",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${patientId}_${appointmentId}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `prescriptions/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('medical')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('medical')
        .getPublicUrl(filePath);
      
      const prescriptionUrl = publicUrlData.publicUrl;
      
      // Update the appointment with the prescription URL
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          prescription_url: prescriptionUrl,
          prescription_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', appointmentId);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Prescription uploaded",
        description: "The prescription has been successfully uploaded",
      });
      
      if (onUploadComplete) {
        onUploadComplete(prescriptionUrl);
      }
      
    } catch (error: any) {
      console.error('Error uploading prescription:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload prescription",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Prescription</CardTitle>
        <CardDescription>
          Upload a prescription document for the patient after the appointment
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prescription-file">Prescription Document</Label>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                id="prescription-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="cursor-pointer"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                PDF or images up to 5MB
              </p>
            </div>
          </div>
          
          {file && (
            <div className="flex items-center space-x-2">
              <div className="w-full h-2 bg-secondary overflow-hidden rounded-full">
                <div 
                  className="h-2 bg-primary rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="prescription-notes">Notes (Optional)</Label>
            <Textarea
              id="prescription-notes"
              placeholder="Enter any additional notes about the prescription..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={!file || isUploading} className="flex items-center gap-2">
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>
                <FileUp className="h-4 w-4" />
                Upload Prescription
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default PrescriptionUploader;
