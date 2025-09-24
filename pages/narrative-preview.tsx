import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { Footer } from '@/components/Footer';
import { OwnYourNarrative } from '@/components/OwnYourNarrative';
import { OwnYourNarrativeHeader } from '@/components/OwnYourNarrativeHeader';
import { Button } from '@/components/ui/button';
import { Settings, Eye, Layout, Smartphone, Monitor, Tablet } from 'lucide-react';

interface NarrativePreviewProps {
  mode: 'full' | 'component' | 'mobile' | 'desktop';
  showControls: boolean;
}

export default function NarrativePreviewPage({ mode: initialMode, showControls }: NarrativePreviewProps) {
  const [mode, setMode] = useState(initialMode);
  const [controlsVisible, setControlsVisible] = useState(showControls);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Preview Not Available</h1>
          <p className="text-gray-600">This preview is only available in development mode.</p>
        </div>
      </div>
    );
  }

  const renderPreviewControls = () => {
    if (!controlsVisible) return null;

    return (
      <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-4 min-w-[200px]">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4" />
          <span className="font-medium text-sm">Preview Controls</span>
        </div>
        
        <div className="space-y-2">
          <div className="text-xs text-gray-500 mb-2">View Mode</div>
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant={mode === 'full' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('full')}
              className="text-xs"
            >
              <Layout className="w-3 h-3 mr-1" />
              Full
            </Button>
            <Button
              variant={mode === 'component' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('component')}
              className="text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              Component
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-xs text-gray-500">Device Preview</div>
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant={mode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('mobile')}
              className="text-xs"
            >
              <Smartphone className="w-3 h-3 mr-1" />
              Mobile
            </Button>
            <Button
              variant={mode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('desktop')}
              className="text-xs"
            >
              <Monitor className="w-3 h-3 mr-1" />
              Desktop
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/narrative', '_blank')}
              className="text-xs"
            >
              <Tablet className="w-3 h-3 mr-1" />
              Live
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setControlsVisible(false)}
            className="text-xs w-full"
          >
            Hide Controls
          </Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (mode) {
      case 'full':
        return (
          <div className="min-h-screen bg-background">
            <OwnYourNarrativeHeader variant="blur" />
            <div className="pt-16 md:pt-20">
              <OwnYourNarrative />
            </div>
            <Footer />
          </div>
        );
      
      case 'component':
        return (
          <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <h2 className="text-lg font-medium text-blue-800 mb-2">Component Preview</h2>
                <p className="text-blue-700 text-sm">
                  Viewing OwnYourNarrative component in isolation for development testing.
                </p>
              </div>
              <OwnYourNarrative />
            </div>
          </div>
        );
      
      case 'mobile':
        return (
          <div className="mx-auto bg-white shadow-2xl border-8 border-gray-800 rounded-[2.5rem] h-[812px] w-[375px] overflow-hidden">
            <div className="h-full overflow-y-auto">
              <OwnYourNarrativeHeader variant="blur" />
              <div className="pt-16">
                <OwnYourNarrative />
              </div>
              <Footer />
            </div>
          </div>
        );
      
      case 'desktop':
        return (
          <div className="mx-auto bg-white shadow-2xl border border-gray-300 rounded-lg overflow-hidden" style={{ width: '1200px', height: '800px' }}>
            <div className="h-full overflow-y-auto">
              <OwnYourNarrativeHeader variant="blur" />
              <div className="pt-16">
                <OwnYourNarrative />
              </div>
              <Footer />
            </div>
          </div>
        );
      
      default:
        return <OwnYourNarrative />;
    }
  };

  return (
    <>
      <NextSeo
        title="Narrative Preview - Development Mode"
        description="Development preview of the narrative section"
        noindex={true}
        nofollow={true}
      />
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Show/Hide Controls Toggle */}
      {!controlsVisible && (
        <button
          onClick={() => setControlsVisible(true)}
          className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      )}

      {renderPreviewControls()}

      <div className={`${mode === 'mobile' || mode === 'desktop' ? 'min-h-screen bg-gray-100 flex items-center justify-center p-8' : ''}`}>
        {renderContent()}
      </div>

      {/* Development Indicator */}
      <div className="fixed bottom-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium z-40">
        DEV PREVIEW
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return {
      notFound: true,
    };
  }

  const mode = (query.mode as string) || 'full';
  const showControls = query.controls !== 'false';

  return {
    props: {
      mode: ['full', 'component', 'mobile', 'desktop'].includes(mode) ? mode : 'full',
      showControls,
    },
  };
};