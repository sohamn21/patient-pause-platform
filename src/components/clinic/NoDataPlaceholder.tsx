
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, LucideIcon } from 'lucide-react';

interface NoDataPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onAction: () => void;
}

const NoDataPlaceholder = ({
  icon: Icon,
  title,
  description,
  buttonText,
  onAction
}: NoDataPlaceholderProps) => {
  return (
    <div className="text-center py-8">
      <Icon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button onClick={onAction}>
        <PlusCircle className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
};

export default NoDataPlaceholder;
