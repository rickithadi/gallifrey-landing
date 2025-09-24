import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

/**
 * Development utility component that adds URL-based controls
 * Usage examples:
 * - localhost:3005/?preview=narrative - Shows narrative preview
 * - localhost:3005/?dev=1 - Shows development tools
 * - localhost:3005/?mockNarrative=true - Auto-shows narrative section
 */
export function DevUtils() {
  const router = useRouter();
  const [isDev] = useState(() => process.env.NODE_ENV === 'development');
  
  if (!isDev) return null;

  // URL-based preview controls
  const showNarrativePreview = router.query.preview === 'narrative' || 
                               router.query.mockNarrative === 'true' ||
                               router.query.narrative === 'true';
  
  const showDevTools = router.query.dev === '1' || router.query.debug === 'true';

  return (
    <>
      {/* URL-based narrative preview */}
      {showNarrativePreview && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-500 p-4 mb-8">
          <div className="flex items-start">
            <div className="ml-3">
              <h3 className="text-lg font-medium text-purple-800">
                🎭 Narrative Section Preview Active
              </h3>
              <div className="mt-2 text-sm text-purple-700">
                <p>You&apos;re viewing the narrative section inline. Remove <code className="bg-purple-200 px-1 rounded">?preview=narrative</code> from URL to disable.</p>
                <div className="mt-2 flex gap-2">
                  <a 
                    href="/narrative" 
                    target="_blank"
                    className="inline-flex items-center px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                  >
                    View Full Narrative Page
                  </a>
                  <a 
                    href="/narrative-preview" 
                    target="_blank"
                    className="inline-flex items-center px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                  >
                    Advanced Preview
                  </a>
                  <Link 
                    href="/" 
                    className="inline-flex items-center px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                  >
                    Disable Preview
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Development tools panel */}
      {showDevTools && (
        <div className="fixed top-4 left-4 z-50 bg-black text-white p-4 rounded-lg shadow-lg max-w-sm">
          <h4 className="font-medium mb-3">🔧 Dev Tools</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
            <div><strong>Route:</strong> {router.asPath}</div>
            <div className="pt-2 border-t border-gray-600">
              <strong>Quick Links:</strong>
              <div className="mt-1 space-y-1">
                <div>
                  <Link href="/?preview=narrative" className="text-blue-300 hover:underline">Preview Narrative</Link>
                </div>
                <div>
                  <Link href="/narrative-preview" className="text-blue-300 hover:underline">Advanced Preview</Link>
                </div>
                <div>
                  <a href="/narrative" target="_blank" className="text-blue-300 hover:underline">Live Narrative</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}