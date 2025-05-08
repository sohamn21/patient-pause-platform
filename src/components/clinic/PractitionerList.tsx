
import React from 'react';
import { Practitioner } from '@/types/clinic';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface PractitionerListProps {
  practitioners: Practitioner[];
  onEdit: (practitioner: Practitioner) => void;
  onDelete: (practitioner: Practitioner) => void;
}

const PractitionerList = ({ practitioners, onEdit, onDelete }: PractitionerListProps) => {
  const renderAvailabilityBadges = (practitioner: Practitioner) => {
    if (!practitioner.availability) return <span className="text-muted-foreground">No availability set</span>;
    
    return (
      <div className="flex flex-wrap gap-1">
        {Object.keys(practitioner.availability).map(day => (
          <Badge key={day} variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {day.substring(0, 3)}
          </Badge>
        ))}
      </div>
    );
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Specialization</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {practitioners.map((practitioner) => (
          <TableRow key={practitioner.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(practitioner.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{practitioner.name}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>{practitioner.specialization || 'General'}</TableCell>
            <TableCell>{renderAvailabilityBadges(practitioner)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(practitioner)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(practitioner)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PractitionerList;
