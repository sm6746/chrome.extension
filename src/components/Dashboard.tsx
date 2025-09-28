import { useState, useEffect, useMemo } from 'react';
import { Connection } from '@/types/connection';
import { mockConnections } from '@/data/mockConnections';
import { DashboardHeader } from './DashboardHeader';
import { ConnectionCard } from './ConnectionCard';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { useToast } from '@/hooks/use-toast';

// Chrome extension API types
declare global {
  interface Window {
    chrome?: {
      runtime: {
        sendMessage: (message: any, callback?: (response: any) => void) => void;
        onMessage: {
          addListener: (callback: (message: any, sender: any, sendResponse: any) => void) => void;
        };
      };
    };
  }
}

export const Dashboard = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const { toast } = useToast();

  // Load connections from Chrome extension or fallback to mock data
  const loadConnections = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if we're running in a Chrome extension
      if (window.chrome && window.chrome.runtime) {
        await loadConnectionsFromExtension();
      } else {
        // Fallback to mock data for development
        await loadMockConnections();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Error loading connections",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadConnectionsFromExtension = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!window.chrome?.runtime) {
        reject(new Error('Chrome extension API not available'));
        return;
      }

      window.chrome.runtime.sendMessage(
        { action: 'getConnections' },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }

          if (response.success) {
            setConnections(response.connections);
            toast({
              title: "Connections loaded",
              description: `Successfully loaded ${response.connections.length} connections${response.fromCache ? ' (from cache)' : ''}`,
            });
            resolve();
          } else {
            reject(new Error(response.error || 'Failed to load connections'));
          }
        }
      );
    });
  };

  const loadMockConnections = async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate potential error (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Failed to fetch connections from LinkedIn API');
    }
    
    setConnections(mockConnections);
    toast({
      title: "Connections loaded (Mock Data)",
      description: `Successfully loaded ${mockConnections.length} connections`,
    });
  };

  // Load connections on component mount
  useEffect(() => {
    loadConnections();
  }, []);

  // Get unique companies for filter
  const companies = useMemo(() => {
    const uniqueCompanies = [...new Set(connections.map(conn => conn.company.name))];
    return uniqueCompanies.sort();
  }, [connections]);

  // Filter connections based on search and company filter
  const filteredConnections = useMemo(() => {
    return connections.filter(connection => {
      const matchesSearch = searchQuery === '' || 
        connection.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.headline.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCompany = selectedCompany === 'all' || 
        connection.company.name === selectedCompany;
      
      return matchesSearch && matchesCompany;
    });
  }, [connections, searchQuery, selectedCompany]);

  const handleRefresh = () => {
    loadConnections();
  };

  const handleClearCache = async () => {
    try {
      if (window.chrome?.runtime) {
        await new Promise<void>((resolve, reject) => {
          window.chrome.runtime.sendMessage(
            { action: 'clearCache' },
            (response) => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
              }
              
              if (response.success) {
                toast({
                  title: "Cache cleared",
                  description: "All cached data has been cleared",
                });
                resolve();
              } else {
                reject(new Error(response.error || 'Failed to clear cache'));
              }
            }
          );
        });
      } else {
        toast({
          title: "Cache cleared",
          description: "Cache cleared (development mode)",
        });
      }
    } catch (error) {
      toast({
        title: "Error clearing cache",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error && connections.length === 0) {
    return (
      <div className="bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                LinkedIn Connections
              </h1>
              <p className="text-professional-gray">
                Manage and explore your professional network
              </p>
            </div>
            <ErrorState message={error} onRetry={handleRefresh} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <DashboardHeader
          totalConnections={connections.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCompany={selectedCompany}
          onCompanyChange={setSelectedCompany}
          companies={companies}
          onRefresh={handleRefresh}
          onClearCache={handleClearCache}
          isLoading={isLoading}
        />

        {filteredConnections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-professional-gray text-lg">
              No connections found matching your criteria.
            </p>
            {(searchQuery || selectedCompany !== 'all') && (
              <p className="text-professional-gray text-sm mt-2">
                Try adjusting your search or filter settings.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};