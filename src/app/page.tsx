'use client';

import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {getShlAssessments, ShlAssessment} from '@/services/shl';
import {useEffect} from 'react';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import { Info } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');
  const [assessments, setAssessments] = useState<ShlAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assessments.length === 0 && !loading) {
      setLoading(true);
      setError(null);
      getAssessments('Software Engineer').then(ret => {
        setAssessments(ret);
      }).catch(err => {
        setError(err.message);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, []);

  const getAssessments = async (input: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = await getShlAssessments(input);
      setAssessments(results);
    } catch (e: any) {
      setError(e.message);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
    return assessments;
  };

  const handleSearch = async () => {
    if (query) {
      await getAssessments(query);
    }
  };

  const handleUrlSearch = async () => {
    if (url) {
      // TODO: Implement URL handling logic here
      await getAssessments(url);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AssessAI Advisor</h1>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <Input
          type="text"
          placeholder="Enter job description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <Input
          type="url"
          placeholder="Enter job description URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={handleUrlSearch} disabled={loading}>
          {loading ? 'Loading...' : 'Search by URL'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {assessments.length > 0 ? (
        <Table>
          <TableCaption>Top 10 Assessment Recommendations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Assessment Name</TableHead>
              <TableHead>Remote Testing Support</TableHead>
              <TableHead>Adaptive/IRT Support</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Test Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((assessment, index) => (
              <TableRow key={index}>
                <TableCell>
                  <a
                    href={assessment.assessmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {assessment.assessmentName}
                  </a>
                </TableCell>
                <TableCell>{assessment.remoteTestingSupport}</TableCell>
                <TableCell>{assessment.adaptiveIrtSupport}</TableCell>
                <TableCell>{assessment.duration}</TableCell>
                <TableCell>{assessment.testType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        !loading && !error && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Assessments Found</AlertTitle>
            <AlertDescription>
              No assessments were found for the given query. Please try a
              different search.
            </AlertDescription>
          </Alert>
        )
      )}
    </div>
  );
}
