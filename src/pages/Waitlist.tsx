
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlowButton } from "@/components/ui/glow-button";
import { BlurCard, BlurCardContent, BlurCardHeader, BlurCardTitle } from "@/components/ui/blur-card";
import { 
  UserPlus, 
  Clock, 
  Users, 
  Plus,
  QrCode,
  Share,
  ListFilter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { createWaitlist, getBusinessWaitlists, getWaitlistEntries, updateWaitlistEntry, removeFromWaitlist, addToWaitlist } from "@/lib/waitlistService";
import { createNotification } from "@/lib/notificationService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WaitlistCard } from "@/components/dashboard/WaitlistCard";
import QRCode from "react-qr-code";
import { WaitlistActions } from "@/components/restaurant/WaitlistActions";
