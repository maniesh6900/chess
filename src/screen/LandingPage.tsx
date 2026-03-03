import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

const FLOATING_PIECES = [
  { src: '/k.png', className: 'top-[10%] left-[8%] w-16 opacity-20 animate-float' },
  { src: '/Q copy.png', className: 'top-[15%] right-[12%] w-14 opacity-15 animate-float-delayed' },
  { src: '/n.png', className: 'bottom-[20%] left-[15%] w-12 opacity-15 animate-float-delayed' },
  { src: '/R copy.png', className: 'bottom-[25%] right-[8%] w-14 opacity-20 animate-float' },
  { src: '/b.png', className: 'top-[45%] left-[5%] w-10 opacity-10 animate-float' },
  { src: '/P copy.png', className: 'top-[50%] right-[5%] w-10 opacity-10 animate-float-delayed' },
]

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]" />

      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      {FLOATING_PIECES.map((piece, i) => (
        <img
          key={i}
          src={piece.src}
          alt=""
          draggable={false}
          className={`absolute pointer-events-none select-none ${piece.className}`}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <div className="animate-fade-in-down mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <img src="/K copy.png" alt="Chess" className="w-14 h-14" draggable={false} />
          </div>
        </div>

        <h1 className="animate-fade-in-up opacity-0 font-display text-6xl sm:text-7xl md:text-8xl font-black text-gradient text-center mb-4"
          style={{ animationFillMode: 'forwards', animationDelay: '100ms' }}
        >
          Chess Arena
        </h1>

        <p className="animate-fade-in-up opacity-0 text-slate-400 text-lg sm:text-xl text-center max-w-md mb-2"
          style={{ animationFillMode: 'forwards', animationDelay: '200ms' }}
        >
          Play online or pass-and-play on one device.
        </p>
        <p className="animate-fade-in-up opacity-0 text-slate-600 text-sm text-center mb-10"
          style={{ animationFillMode: 'forwards', animationDelay: '300ms' }}
        >
          Free &bull; No sign-up &bull; Instant start
        </p>

        <div className="animate-fade-in-up opacity-0 flex flex-col items-center gap-4"
          style={{ animationFillMode: 'forwards', animationDelay: '400ms' }}
        >
          <div className="animate-pulse-glow rounded-xl">
            <Button onClick={() => navigate('/game')}>
              &#9823; Play Online
            </Button>
          </div>

          <Button onClick={() => navigate('/game?mode=local')}>
            Play Local (2 players)
          </Button>

          <p className="text-slate-600 text-xs">
            Choose online match or local pass-and-play
          </p>
        </div>

        <div className="animate-fade-in-up opacity-0 flex flex-wrap justify-center gap-3 mt-16"
          style={{ animationFillMode: 'forwards', animationDelay: '600ms' }}
        >
          {['Online Multiplayer', 'Local Pass-and-Play', 'Built with React'].map((label) => (
            <span
              key={label}
              className="glass px-4 py-2 rounded-full text-xs font-medium text-slate-400"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center animate-fade-in opacity-0"
        style={{ animationFillMode: 'forwards', animationDelay: '800ms' }}
      >
        <p className="text-slate-700 text-xs">
          Powered by Chess.js &amp; React
        </p>
      </div>
    </div>
  )
}

export default LandingPage
