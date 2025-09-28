import { Connection } from '@/types/connection';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users } from 'lucide-react';

interface ConnectionCardProps {
  connection: Connection;
}

export const ConnectionCard = ({ connection }: ConnectionCardProps) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const formatConnectionDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="p-6 hover:shadow-card-hover transition-all duration-200 bg-card border-border group cursor-pointer">
      <div className="flex items-start space-x-4">
        {/* Profile Picture */}
        <Avatar className="w-16 h-16 ring-2 ring-border group-hover:ring-linkedin-blue transition-colors duration-200">
          <AvatarImage 
            src={connection.profilePicture} 
            alt={connection.fullName}
            className="object-cover"
          />
          <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold text-lg">
            {getInitials(connection.firstName, connection.lastName)}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-foreground truncate group-hover:text-linkedin-blue transition-colors duration-200">
                {connection.fullName}
              </h3>
              <p className="text-professional-gray text-sm leading-relaxed">
                {connection.headline}
              </p>
            </div>
            {connection.mutualConnections && (
              <Badge variant="secondary" className="ml-2 flex items-center gap-1 text-xs">
                <Users className="w-3 h-3" />
                {connection.mutualConnections}
              </Badge>
            )}
          </div>

          {/* Company Info */}
          <div className="flex items-center space-x-2 mb-3">
            {connection.company.logo ? (
              <img 
                src={connection.company.logo} 
                alt={connection.company.name}
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Building2 className="w-5 h-5 text-professional-gray" />
            )}
            <span className="text-sm font-medium text-foreground">
              {connection.company.name}
            </span>
            {connection.company.industry && (
              <Badge variant="outline" className="text-xs">
                {connection.company.industry}
              </Badge>
            )}
          </div>

          {/* Location & Connection Date */}
          <div className="flex items-center justify-between text-xs text-professional-gray">
            {connection.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{connection.location}</span>
              </div>
            )}
            <span>Connected {formatConnectionDate(connection.connectionDate)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};