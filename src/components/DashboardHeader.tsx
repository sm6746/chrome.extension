import { Search, Filter, Download, RefreshCw, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  totalConnections: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCompany: string;
  onCompanyChange: (company: string) => void;
  companies: string[];
  onRefresh: () => void;
  onClearCache: () => void;
  isLoading?: boolean;
}

export const DashboardHeader = ({
  totalConnections,
  searchQuery,
  onSearchChange,
  selectedCompany,
  onCompanyChange,
  companies,
  onRefresh,
  onClearCache,
  isLoading = false
}: DashboardHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            LinkedIn Connections
          </h1>
          <p className="text-professional-gray">
            Manage and explore your professional network
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {totalConnections} connections
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCache}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border border-border shadow-card">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-professional-gray" />
          <Input
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-professional-gray" />
            <span className="text-sm font-medium text-foreground">Company:</span>
          </div>
          <Select value={selectedCompany} onValueChange={onCompanyChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};