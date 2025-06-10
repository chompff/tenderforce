import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useOrganizationData } from '@/hooks/useOrganizationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Building2 } from 'lucide-react';

// Tender type definition
interface Tender {
  id: string;
  title: string;
  org_id: string;
  created_at: string;
  created_by: string;
}

// Mock Supabase client (replace with actual Supabase integration)
const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      eq: (column: string, value: string) => ({
        order: (column: string) => Promise.resolve({
          data: [
            { id: '1', title: 'Website Ontwikkeling Project', org_id: value, created_at: '2024-01-15', created_by: 'user1' },
            { id: '2', title: 'Marketing Campagne Q2', org_id: value, created_at: '2024-01-10', created_by: 'user2' },
            { id: '3', title: 'Facility Management Services', org_id: value, created_at: '2024-01-05', created_by: 'user1' },
          ],
          error: null
        })
      })
    }),
    insert: (data: any) => Promise.resolve({
      data: [{ ...data, id: Date.now().toString(), created_at: new Date().toISOString() }],
      error: null
    })
  })
};

const TenderDashboard: React.FC = () => {
  const { user } = useUser();
  const { orgId, orgName, isLoaded, hasOrganization } = useOrganizationData();
  
  // State management
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [newTenderTitle, setNewTenderTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch tenders for the current organization
  const fetchTenders = async () => {
    if (!orgId) return;
    
    setIsLoading(true);
    try {
      // Replace with actual Supabase call:
      // const { data, error } = await supabase
      //   .from('tenders')
      //   .select('*')
      //   .eq('org_id', orgId)
      //   .order('created_at', { ascending: false });
      
      const { data, error } = await mockSupabase
        .from('tenders')
        .select()
        .eq('org_id', orgId)
        .order('created_at');

      if (error) {
        console.error('Error fetching tenders:', error);
        return;
      }

      setTenders(data || []);
    } catch (error) {
      console.error('Error fetching tenders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new tender
  const createTender = async () => {
    if (!newTenderTitle.trim() || !orgId || !user) return;

    setIsCreating(true);
    try {
      // Replace with actual Supabase call:
      // const { data, error } = await supabase
      //   .from('tenders')
      //   .insert([{
      //     title: newTenderTitle.trim(),
      //     org_id: orgId,
      //     created_by: user.id
      //   }]);

      const { data, error } = await mockSupabase
        .from('tenders')
        .insert({
          title: newTenderTitle.trim(),
          org_id: orgId,
          created_by: user.id
        });

      if (error) {
        console.error('Error creating tender:', error);
        return;
      }

      // Add the new tender to the list
      if (data && data[0]) {
        setTenders(prev => [data[0], ...prev]);
      }
      
      // Clear the input
      setNewTenderTitle('');
      
      // Refresh the list
      fetchTenders();
    } catch (error) {
      console.error('Error creating tender:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTender();
  };

  // Fetch tenders when organization loads
  useEffect(() => {
    if (isLoaded && hasOrganization && orgId) {
      fetchTenders();
    }
  }, [isLoaded, hasOrganization, orgId]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  // No organization state
  if (!hasOrganization) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <CardTitle>Geen organisatie gevonden</CardTitle>
          <CardDescription>
            Je moet lid zijn van een organisatie om aanbestedingen te beheren. 
            Maak een nieuwe organisatie aan of vraag om een uitnodiging.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aanbestedingen Dashboard</h1>
          <p className="text-gray-600 mt-1">Organisatie: {orgName}</p>
        </div>
      </div>

      {/* Create New Tender */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nieuwe Aanbesteding
          </CardTitle>
          <CardDescription>
            Maak een nieuwe aanbesteding aan voor je organisatie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              type="text"
              placeholder="Voer de titel van de aanbesteding in..."
              value={newTenderTitle}
              onChange={(e) => setNewTenderTitle(e.target.value)}
              className="flex-1"
              disabled={isCreating}
            />
            <Button 
              type="submit" 
              disabled={!newTenderTitle.trim() || isCreating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Aanmaken...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Aanmaken
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tenders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Aanbestedingen ({tenders.length})
          </CardTitle>
          <CardDescription>
            Alle aanbestedingen voor {orgName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Aanbestedingen laden...</span>
            </div>
          ) : tenders.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Geen aanbestedingen</h3>
              <p className="text-gray-600 mb-4">
                Je organisatie heeft nog geen aanbestedingen. Maak er een aan om te beginnen.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tenders.map((tender) => (
                <div
                  key={tender.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{tender.title}</h3>
                      <p className="text-sm text-gray-600">
                        Aangemaakt op {new Date(tender.created_at).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Bekijken
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenderDashboard; 