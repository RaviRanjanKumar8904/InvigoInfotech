import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertTriangle, Video } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { StudyMaterial } from '../types';

export default function VideoPlayerView({ setCurrentTab }: { setCurrentTab: (tab: string) => void }) {
  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (!id) {
        setError('No video ID provided in the URL.');
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'studyMaterials', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMaterial({ id: docSnap.id, ...docSnap.data() } as StudyMaterial);
        } else {
          setError('Video not found in the database.');
        }
      } catch (err) {
        setError('Failed to load video from server.');
        console.error(err);
      }
      setLoading(false);
    };
    fetchVideo();
  }, []);

  const handleBack = () => {
    window.history.pushState({}, '', '/nexus');
    setCurrentTab('nexus');
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4 animate-fade-in">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-bold text-sm">Loading Media Player...</p>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4 text-center animate-fade-in">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
        <p className="text-slate-800 font-bold text-lg">{error}</p>
        <button onClick={handleBack} className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-200 pb-6">
        <button onClick={handleBack} className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-all cursor-pointer shadow-sm shrink-0 self-start sm:self-center">
          <ArrowLeft className="h-5 w-5 text-slate-700" />
        </button>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {material.title}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-2 mt-1.5 font-semibold uppercase tracking-wider">
            <Video className="h-4 w-4 text-blue-600" /> Embedded Learning Material
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-sm border border-slate-200">
        <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-inner">
          {material.type === 'video_embed' && material.embedCode ? (
            <div 
              className="w-full h-full flex items-center justify-center [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 [&>iframe]:max-w-full"
              dangerouslySetInnerHTML={{ __html: material.embedCode }}
            />
          ) : (
            <video src={material.url} controls autoPlay className="w-full h-full object-contain" />
          )}
        </div>
        {material.description && (
          <div className="mt-6 px-2 sm:px-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{material.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
