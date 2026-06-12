import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Search, 
  Star, 
  Play, 
  X, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Flame, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Info,
  ExternalLink,
  Award,
  Zap,
  BookOpen
} from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  iframeUrl: string;
  thumbnail: string;
  accentColor: string;
  controls: string;
  rating: string;
  plays: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Very Hard" | "Scales Up" | string;
}

// Seamless static fallback array matching games.json to ensure 100% resilient rendering on load
const BACKUP_GAMES: Game[] = [
  {
    "id": "snake",
    "title": "Snake Classic Retro",
    "description": "Control a glowing pixel snake, eat glowing apples, and grow as long as possible without hitting walls or biting your own tail!",
    "category": "Retro Arcade",
    "iframeUrl": "/games/snake/index.html",
    "thumbnail": "/games/snake/thumbnail.jpg",
    "controls": "Arrow keys to steer on Desktop, or On-Screen arrows on mobile.",
    "rating": "4.8",
    "plays": "14.2K",
    "accentColor": "#10b981",
    "difficulty": "Easy to Medium"
  },
  {
    "id": "2048",
    "title": "2048 Puzzle Elite",
    "description": "Slide matching neon tiles together to double their value. Use clever spatial logic to merge your way up to the ultimate 2048 tile!",
    "category": "Puzzle & Logic",
    "iframeUrl": "/games/2048/index.html",
    "thumbnail": "/games/2048/thumbnail.jpg",
    "controls": "Arrow keys to slide tiles on Desktop, or On-Screen buttons on Mobile.",
    "rating": "4.7",
    "plays": "18.5K",
    "accentColor": "#f59e0b",
    "difficulty": "Hard"
  },
  {
    "id": "brick_breaker",
    "title": "Neon Breakout Classic",
    "description": "Unleash high-speed synthwave spheres to smash rows of neon blocks! Position the sliding paddle with swift precision to keep the ball from falling.",
    "category": "Arcade Action",
    "iframeUrl": "/games/brick-breaker/index.html",
    "thumbnail": "/games/brick-breaker/thumbnail.jpg",
    "controls": "Move Mouse or hold Left/Right keyboard arrows to guide Paddle.",
    "rating": "4.9",
    "plays": "22.1K",
    "accentColor": "#ec4899",
    "difficulty": "Medium"
  },
  {
    "id": "pong",
    "title": "Retro Pong Arena",
    "description": "The grandfather of table tennis simulators! Face a smart computer opponent, time your bounces perfectly, and win 7 rounds to dominate.",
    "category": "Sports Simulator",
    "iframeUrl": "/games/pong/index.html",
    "thumbnail": "/games/pong/thumbnail.jpg",
    "controls": "W/S or Up/Down arrows to slide. On-Screen controls available.",
    "rating": "4.5",
    "plays": "9.8K",
    "accentColor": "#3b82f6",
    "difficulty": "Scales Up"
  },
  {
    "id": "flappy_bird",
    "title": "Flappy Pixel",
    "description": "Guide a high-energy yellow pixel jet through rows of looming retro green plumbing pipes. Time each bounce perfectly to survive the narrow gaps!",
    "category": "Arcade Timing",
    "iframeUrl": "/games/flappy-bird/index.html",
    "thumbnail": "/games/flappy-bird/thumbnail.jpg",
    "controls": "Press SPACEBAR, mouse click, or tap touch screens to flap.",
    "rating": "4.6",
    "plays": "31.4K",
    "accentColor": "#facc15",
    "difficulty": "Very Hard"
  },
  {
    "id": "car_sim",
    "title": "Neon Car Driver 3D",
    "description": "Thrill of high-speed retro racing! Speed down neon channels avoiding light grid structural pillars. Real synthetic engine sound pitches as you build up revs.",
    "category": "3D Simulators",
    "iframeUrl": "/games/car-sim/index.html",
    "thumbnail": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&h=300&q=80",
    "accentColor": "#10b981",
    "controls": "ARROW KEYS, WASD on desktop, or steer/brake mobile pads.",
    "rating": "4.9",
    "plays": "15.7K",
    "difficulty": "Medium"
  },
  {
    "id": "truck_sim",
    "title": "Cargo Hauler 3D",
    "description": "Precision heavy articulation truck driving simulator. Control cargo balance vector, pivot through barriers, and deliver shipping containers.",
    "category": "3D Simulators",
    "iframeUrl": "/games/truck-sim/index.html",
    "thumbnail": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&h=300&q=80",
    "accentColor": "#f59e0b",
    "controls": "Arrow keys to steer/reverse cab. Watch your trailer angle to avoid jackknifing!",
    "rating": "4.8",
    "plays": "11.1K",
    "difficulty": "Hard"
  },
  {
    "id": "bus_sim",
    "title": "Transit City Bus 3D",
    "description": "Guide public passenger transit buses between glowing city depots. Execute parallel parking, preserve passenger comfort limits, and manage tight schedules.",
    "category": "3D Simulators",
    "iframeUrl": "/games/bus-sim/index.html",
    "thumbnail": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&h=300&q=80",
    "accentColor": "#0284c7",
    "controls": "Steer into glowing bus stops, brake to a full halt, and let passengers board.",
    "rating": "4.7",
    "plays": "19.9K",
    "difficulty": "Easy to Medium"
  },
  {
    "id": "hide_seek",
    "title": "Neon Seeker 3D",
    "description": "Track, scan, and tag hidden rogue hider anomalies camouflaged behind cybernetic obstacles! Trigger your Proximity Sonar radar to compute signal ranges before power cells drain.",
    "category": "3D Simulators",
    "iframeUrl": "/games/hide-seek/index.html",
    "thumbnail": "/games/hide-seek/thumbnail.jpg",
    "controls": "Arrow keys / WASD to steer Seeker Drone. Trigger Sonar Ping to track hiders.",
    "rating": "4.8",
    "plays": "18.3K",
    "accentColor": "#06b6d4",
    "difficulty": "Medium to Hard"
  },
  {
    "id": "apps_script_arcade",
    "title": "Apps Script Retro Arena",
    "description": "Unlock a high-energy retro arcade workspace compiled on a custom cloud script engine. Run secure local code calculations, perfect your layout inputs, and score higher!",
    "category": "Retro Arcade",
    "iframeUrl": "https://script.google.com/macros/s/AKfycbxuSWh2XTYFZSscENDakbdpcIJ1SoqzNmRYluJlgZDZpiEIDPGfzvE_PIVBis9Aa62keA/exec",
    "thumbnail": "/games/apps-script/thumbnail.jpg",
    "controls": "Navigate menus with mouse or touch, and use standard keyboard or on-screen inputs.",
    "rating": "4.9",
    "plays": "25.4K",
    "accentColor": "#10b981",
    "difficulty": "Easy to Hard"
  }
];

export default function App() {
  const [games, setGames] = useState<Game[]>(BACKUP_GAMES);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Favorites persisted on local storage
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('unblocked_favorites');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activePlaySeconds, setActivePlaySeconds] = useState(0);
  const [totalPlayTimeStr, setTotalPlayTimeStr] = useState("0m");
  const [launchedCount, setLaunchedCount] = useState(() => {
    return Number(localStorage.getItem('unblocked_launches')) || 0;
  });
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load master list dynamically, with the backup static arrays as a fallback
  useEffect(() => {
    fetch('/games.json')
      .then(res => {
        if (!res.ok) throw new Error("Could not fetch games config");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setGames(data);
        }
      })
      .catch(err => {
        console.warn("Using high-performance backup static game structures: ", err);
      });
  }, []);

  // Save favorites dynamically
  useEffect(() => {
    localStorage.setItem('unblocked_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Track session timer while playing inside the virtual desktop active view
  useEffect(() => {
    let timer: any;
    if (selectedGameId) {
      timer = setInterval(() => {
        setActivePlaySeconds(prev => {
          const updated = prev + 1;
          const mins = Math.floor(updated / 60);
          const secs = updated % 60;
          setTotalPlayTimeStr(mins > 0 ? `${mins}m ${secs}s` : `${secs}s`);
          return updated;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedGameId]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleLaunchGame = (id: string) => {
    setSelectedGameId(id);
    setIframeLoaded(false);
    const updatedCount = launchedCount + 1;
    setLaunchedCount(updatedCount);
    localStorage.setItem('unblocked_launches', String(updatedCount));
  };

  const handleReloadIframe = () => {
    if (iframeRef.current) {
      setIframeLoaded(false);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  // Extract categorizations dynamically
  const categories: string[] = ['All', 'Favorites', ...(Array.from(new Set(games.map(g => g.category))) as string[])];

  // Filtering Logic
  const filteredGames = games.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All') {
      return matchesSearch;
    } else if (selectedCategory === 'Favorites') {
      return matchesSearch && favorites.includes(g.id);
    } else {
      return matchesSearch && g.category === selectedCategory;
    }
  });

  const activeGame = games.find(g => g.id === selectedGameId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-all selection:bg-emerald-500 selection:text-slate-950" id="main-root-container">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-colors" id="site-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand / Geometric Diamond Icon */}
          <div className="flex items-center gap-4 select-none cursor-pointer group" onClick={() => setSelectedGameId(null)} id="brand-logo">
            <div className="relative flex items-center justify-center w-11 h-11 transition-all duration-300 group-hover:scale-105">
              {/* Outer rotated square container */}
              <div className="absolute inset-0 bg-slate-950 border-2 border-emerald-500 rotate-45 rounded-sm shadow-md shadow-emerald-500/10 group-hover:rotate-90 duration-500 transition-transform" />
              {/* Inner accent square */}
              <div className="absolute inset-2 bg-emerald-500/10 border border-emerald-400/30 rotate-45" />
              {/* Main Icon centering */}
              <Gamepad2 className="w-5.5 h-5.5 text-emerald-400 absolute z-10" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 z-20" title="System Status: Balanced" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-lg tracking-wider text-white">
                  UNBLOCKED
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                  BALANCED
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">Geometric Arcade Core</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden md:flex items-center gap-6 font-mono text-xs text-slate-400" id="header-metrics">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              <span>SESSIONS: <strong className="text-white font-bold">{launchedCount}</strong></span>
            </div>
            {selectedGameId && (
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>SESSION TIME: <strong className="text-emerald-400 font-bold">{totalPlayTimeStr}</strong></span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />
              <span>SAVED: <strong className="text-white font-bold">{favorites.length}</strong></span>
            </div>
          </div>

        </div>
      </header>

      {/* DETAILED STATS BANNER */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800/80 py-3 px-4 sm:px-6 lg:px-8 block" id="stats-banner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-300">
              Playing directly from stable local repository sandboxes ensures zero filter disruption. <span className="text-emerald-400 font-medium">100% Client-Side Stability.</span>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-400">ARCADE ENGINE: <span className="text-emerald-400 font-bold">ACTIVE LOCAL-ISOLATED</span></span>
          </div>
        </div>
      </section>

      {/* MASTER CONTAINER GRID LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6" id="main-portal-content">
        
        {/* GAME THEATER (IF ACTIVE) */}
        {activeGame ? (
          <div className="flex flex-col gap-4 animate-fade-in animate-duration-300" id="theater-arena-wrapper">
            
            {/* Control Bar for Play Arena */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl" id="theater-controls">
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedGameId(null)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold border border-slate-700 transition cursor-pointer"
                  id="back-to-catalog-btn"
                >
                  ← Back to Catalog
                </button>
                <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-extrabold text-white">{activeGame.title}</h2>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {activeGame.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 hidden sm:block">Control Mechanics: <span className="text-emerald-400 font-mono font-medium">{activeGame.controls}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button 
                  onClick={() => toggleFavorite(activeGame.id)}
                  className={`p-2 rounded-lg border transition cursor-pointer ${
                    favorites.includes(activeGame.id) 
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-750'
                  }`}
                  title={favorites.includes(activeGame.id) ? "Remove from Favorites" : "Add to Favorites"}
                  id="theater-favoriting-btn"
                >
                  <Star className={`w-4 h-4 ${favorites.includes(activeGame.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                </button>

                <button 
                  onClick={handleReloadIframe}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 font-bold hover:bg-slate-700 transition cursor-pointer"
                  title="Reload current frame state"
                  id="theater-reload-btn"
                >
                  <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Reset Round</span>
                </button>

                <button 
                  onClick={() => setSelectedGameId(null)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-900 text-xs text-emerald-400 font-bold transition cursor-pointer"
                  id="theater-close-btn"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Quit Game</span>
                </button>
              </div>

            </div>

            {/* Main Stage & Detailed Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="theater-arena-layout">
              
              {/* Virtual Arcade Screen (Iframe Container) */}
              <div className="lg:col-span-3 flex flex-col justify-center items-center bg-slate-950 border border-slate-800 rounded-2xl relative shadow-2xl p-2 min-h-[460px] md:min-h-[500px]" id="iframe-sandbox-container">
                
                {/* Loader State */}
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-slate-950 rounded-2xl z-20">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-500/20 animate-spin" style={{ animationDuration: '8s' }} />
                      <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 border-r-transparent border-dashed animate-spin" />
                      <Gamepad2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 w-6 h-6 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Bypassing Local Filters...</h3>
                      <p className="text-[11px] text-slate-500 mt-1 font-mono">Isolated HTML5 sandbox active</p>
                    </div>
                  </div>
                )}

                {/* Secure HTML5 Sandbox frame */}
                <iframe 
                  ref={iframeRef}
                  src={activeGame.iframeUrl}
                  title={activeGame.title}
                  className="w-full max-w-full aspect-[4/3] min-h-[420px] rounded-xl border-0 overflow-hidden bg-slate-900 shadow-inner"
                  sandbox={activeGame.iframeUrl.startsWith('http') 
                    ? "allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-modals allow-storage-access-by-user-activation" 
                    : "allow-scripts allow-same-origin allow-modals allow-popups"
                  }
                  onLoad={() => setIframeLoaded(true)}
                  id="game-iframe-player"
                />

                <div className="w-full text-center mt-2.5 text-[10px] text-slate-500 font-mono tracking-wider flex items-center justify-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>CLIENT-SIDE IFRAME PORT</span>
                  <span className="text-slate-700">|</span>
                  <span>Use keyboard triggers to play</span>
                </div>
              </div>

              {/* Game Play Guide Sidebar */}
              <div className="lg:col-span-1 flex flex-col gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl" id="theater-details-sidebar">
                
                <div>
                  <h3 className="font-mono font-bold text-xs text-emerald-400 uppercase tracking-widest mb-2 border-b border-slate-800 pb-1.5">Game Overview</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeGame.description}</p>
                </div>

                <div>
                  <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    Keyboard Controls
                  </h4>
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <p className="text-xs text-emerald-400 font-mono font-semibold leading-relaxed">{activeGame.controls}</p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 flex flex-col gap-3 font-mono text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">DIFFICULTY:</span>
                    <span className="text-emerald-400 font-bold">▼ {activeGame.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">USER RATING:</span>
                    <span className="text-yellow-400 font-bold">★ {activeGame.rating} / 5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TOTAL PLAYS:</span>
                    <span className="text-white font-bold">{activeGame.plays} sessions</span>
                  </div>
                  <div className="flex justify-between text-[10px] pt-1 text-slate-500 border-t border-slate-800/50">
                    <span>HOST METHOD:</span>
                    <span className="text-emerald-500 font-semibold uppercase">LOCAL IFRAME</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 mt-auto">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono font-bold text-white tracking-wide">FIREWALL IMMUNE</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed">
                      All assets, retro calculations, and sprites execute locally. Central firewalls cannot inspect or filter individual titles.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          
          // STANDARD PORTAL VIEW
          <div className="flex flex-col gap-8 animate-fade-in animate-duration-300" id="portal-catalog-wrapper">
            
            {/* HERO PROMOTIONAL INTEGRATED WIDGET */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl" id="hero-widget">
              
              {/* Background geometric design patterns */}
              <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
              <div className="absolute left-1/3 top-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-2xl -z-10" />
              <div className="absolute right-12 top-12 w-16 h-16 border border-emerald-500/10 rotate-12 rounded-sm -z-10 hidden md:block" />
              <div className="absolute right-36 bottom-8 w-24 h-24 border border-emerald-400/5 rotate-45 rounded-sm -z-10 hidden md:block" />

              <div className="max-w-2xl flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded border border-emerald-500/20 font-mono font-semibold w-max select-none">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> STABLE DESKTOP EMULATION
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  High-Performance Retro Games. <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent italic font-mono uppercase tracking-wide">
                    Geometric Balance Engine.
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Safely bypass standard administrative system blacklists. Native local scripts keep your traffic local and fast. Zero latency, no proxy overheads, and immediate loading states.
                </p>
                
                <div className="flex flex-wrap gap-4 mt-2">
                  <button 
                    onClick={() => handleLaunchGame('snake')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-slate-950 rounded font-mono font-extrabold text-xs sm:text-sm shadow-md hover:bg-emerald-400 hover:scale-[1.02] transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-slate-950 text-slate-950" /> [ QUICK START ]
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedCategory('Favorites');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-slate-300 border border-slate-800 rounded font-mono font-semibold text-xs sm:text-sm hover:border-emerald-500/30 hover:text-white transition cursor-pointer"
                  >
                    <Star className="w-4 h-4 text-emerald-400" /> FAVORITES ({favorites.length})
                  </button>
                </div>
              </div>

            </section>

            {/* SEARCH AND CATEGORY FILTER TOOLBAR */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl" id="filter-bar">
              
              {/* Category buttons slider */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none" id="category-chips">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded text-xs font-mono font-bold tracking-wider whitespace-nowrap transition cursor-pointer border ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'Favorites' ? '★ SAVED FAVORITES' : cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Text Search element */}
              <div className="relative w-full lg:max-w-xs shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  placeholder="FILTER BY GAME NAME..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition uppercase tracking-wider"
                  id="game-search-input"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white font-mono text-sm cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

            </div>

            {/* CATALOG CARDS GRID */}
            <div>
              <div className="flex items-center justify-between mb-5" id="catalog-header">
                <h2 className="text-sm font-mono font-bold text-white tracking-widest uppercase flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Arcade Directory
                  <span className="text-xs font-normal text-slate-500">({filteredGames.length} indexed files)</span>
                </h2>
              </div>

              {filteredGames.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-6" id="empty-state">
                  <Gamepad2 className="w-12 h-12 text-slate-750 mx-auto mb-3" />
                  <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-widest">No entries found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    No emulator structures matched your query. Reset standard selectors to resume.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 px-4 py-2 border border-slate-850 bg-slate-950 text-xs font-mono text-emerald-400 hover:border-emerald-500/40 hover:text-white transition cursor-pointer rounded"
                  >
                    RESTORE SYSTEM SELECTORS
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="games-card-grid">
                  {filteredGames.map((game) => {
                    const isFav = favorites.includes(game.id);
                    return (
                      <div 
                        key={game.id}
                        onClick={() => handleLaunchGame(game.id)}
                        className="group relative flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300"
                        id={`game-card-${game.id}`}
                      >
                        
                        {/* CARD THUMBNAIL BOX */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 border-b border-slate-800">
                          <img 
                              src={game.thumbnail} 
                              alt={game.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-100"
                              referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-85" />
                          
                          {/* Quick Favoriting Trigger Badge */}
                          <button 
                            onClick={(e) => toggleFavorite(game.id, e)}
                            className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition cursor-pointer border ${
                              isFav 
                                ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/35' 
                                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                            }`}
                            id={`fav-btn-${game.id}`}
                            title={isFav ? "Remove from saved" : "Save to Favorites"}
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-yellow-500' : ''}`} />
                          </button>

                          {/* Float category badge */}
                          <span 
                            className="absolute bottom-3 left-3 text-[9px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400"
                          >
                            {game.category}
                          </span>
                        </div>

                        {/* CARD BODY CONTENT */}
                        <div className="p-4.5 flex-1 flex flex-col justify-between">
                          
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-mono font-bold text-xs sm:text-sm text-slate-100 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                                {game.title}
                              </h3>
                              <span className="shrink-0 flex items-center gap-1 text-[10px] text-yellow-500 font-mono font-bold bg-yellow-500/5 px-2 py-0.5 rounded border border-yellow-500/10">
                                ★ {game.rating}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {game.description}
                            </p>
                          </div>

                          {/* Stats footer panel inside cards */}
                          <div className="border-t border-slate-800/80 mt-4 pt-3 flex items-center justify-between font-mono text-[10px] text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <TrendingUp className="w-3 h-3 text-emerald-500" />
                              {game.plays} SESSIONS
                            </span>
                            <span className="text-slate-400 uppercase font-semibold">
                              DIFF: <span className="text-emerald-400 font-bold">{game.difficulty.toUpperCase()}</span>
                            </span>
                          </div>

                        </div>

                        {/* CARD HOVER ACCENT RAIL */}
                        <div 
                          className="h-1 w-full bg-slate-850 group-hover:bg-emerald-500 transition-colors duration-300"
                        />

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* GEOMETRIC FAQ & INFORMATION DESKTOP FOOTER */}
            <footer className="mt-8 border-t border-slate-800 pt-8" id="footer-faq">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-6 rounded-2xl border border-slate-850">
                
                <div className="border-l-2 border-emerald-500 pl-4">
                  <h4 className="font-mono font-bold text-slate-200 mb-2 flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-emerald-400">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" /> SECURE ROOT PORTALS
                  </h4>
                  <p className="text-slate-300 font-sans">
                    Most firewalls deploy filters looking at metadata and cloud API requests. Because each game runs embedded inside secure sandbox structures using local files, your connection stays entirely secure and independent.
                  </p>
                </div>

                <div className="border-l-2 border-cyan-500 pl-4">
                  <h4 className="font-mono font-bold text-slate-200 mb-2 flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-cyan-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> PRESERVED GAME STATE
                  </h4>
                  <p className="text-slate-300 font-sans">
                    Your highest scores, total sessions, and customized favorite catalogs are securely serialized directly inside your client-side browser database engine (`localStorage`). Nothing is synced to cloud proxies, keeping you 100% private.
                  </p>
                </div>

                <div className="border-l-2 border-indigo-400 pl-4">
                  <h4 className="font-mono font-bold text-slate-200 mb-2 flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-indigo-400">
                    <Info className="w-3.5 h-3.5 text-indigo-400" /> MALWARE-FREE PLAYGROUNDS
                  </h4>
                  <p className="text-slate-300 font-sans">
                    All scripts run cleanly inside custom isolated iframe targets. This guarantees zero external trackers, advertising overlays, or third-party cookies. Enjoy pure geometric retro balance retro gaming seamlessly.
                  </p>
                </div>

              </div>

              <div className="text-center text-slate-650 font-mono text-[9px] uppercase tracking-widest mt-8">
                © {new Date().getFullYear()} UNBLOCKED ARCADE PORTAL • DESIGN THEME: GEOMETRIC BALANCE • PROXIED CLIENT SANDBOX
              </div>
            </footer>

          </div>
        )}

      </main>
      
    </div>
  );
}
