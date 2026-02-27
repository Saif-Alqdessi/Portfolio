export function BackgroundBlobs() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
      aria-hidden="true"
    >
      {/* Primary cyan glow — top center */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[-8%] w-[900px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Secondary cyan — top-left edge */}
      <div
        className="absolute top-[-10%] left-[-12%] w-[600px] h-[600px] rounded-full animate-blob"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animationDelay: '0s',
        }}
      />

      {/* Purple glow — bottom-right */}
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full animate-blob"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)',
          filter: 'blur(80px)',
          animationDelay: '-5s',
        }}
      />

      {/* Mid-page accent — center left */}
      <div
        className="absolute top-[45%] left-[-5%] w-[400px] h-[400px] rounded-full animate-blob"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animationDelay: '-9s',
        }}
      />

      {/* Subtle purple mid — center right */}
      <div
        className="absolute top-[35%] right-[-8%] w-[450px] h-[450px] rounded-full animate-blob"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animationDelay: '-13s',
        }}
      />

      {/* Bottom vignette for depth */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[30vh]"
        style={{
          background: 'linear-gradient(to top, rgba(2,6,23,0.60) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
