import { useState } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Code } from 'lucide-react';
import { Button } from './ui/button';
import { OwnYourNarrative } from './OwnYourNarrative';

interface NarrativePreviewProps {
  showByDefault?: boolean;
}

export function NarrativePreview({ showByDefault = false }: NarrativePreviewProps) {
  const router = useRouter();
  const [isDevelopmentMode] = useState(() => {
    // Only show in development environment
    return process.env.NODE_ENV === 'development';
  });

  // Check URL parameters for auto-show
  const shouldShowByURL = router.query.preview === 'narrative' || 
                         router.query.mockNarrative === 'true' ||
                         router.query.narrative === 'true';
  
  const [isVisible, setIsVisible] = useState(showByDefault || shouldShowByURL);

  // Don't render anything in production
  if (!isDevelopmentMode) {
    return null;
  }

  return (
    <>
      {/* Development Preview Toggle - Fixed position */}
      <div className="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-2">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-xs"
        >
          <Code className="w-3 h-3" />
          {isVisible ? (
            <>
              <EyeOff className="w-3 h-3" />
              Hide Narrative
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              Preview Narrative
            </>
          )}
        </Button>
      </div>

      {/* Narrative Section Preview */}
      {isVisible && (
        <div className="relative">
          {/* Development Banner */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Development Preview:</strong> Narrative section (normally at narrative.gallifrey.consulting)
                </p>
              </div>
            </div>
          </div>

          {/* Actual Narrative Component */}
          <div className="narrative-preview-container">
            <OwnYourNarrative />
          </div>

          {/* Development Footer */}
          <div className="bg-gray-100 border border-gray-200 p-4 mt-8 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              End of Narrative Preview • Visit{' '}
              <a 
                href="/narrative" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                /narrative
              </a>
              {' '}for full experience
            </p>
          </div>
        </div>
      )}
    </>
  );
}