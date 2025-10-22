'use client'

export default function SuccessPage() {

  return (
    <div className="min-h-screen bg-oclta-white flex flex-col">
      {/* Back Arrow */}
      <a 
        href="https://group.oclta.com/login"
        className="absolute top-4 left-8 text-oclta-black hover:text-gray-600 transition-colors"
        style={{ 
          fontFamily: 'monospace',
          fontSize: '18px',
          lineHeight: '1',
          imageRendering: 'pixelated',
          textRendering: 'optimizeSpeed'
        }}
      >
        ←
      </a>

      {/* OCLTA Logo */}
      <a 
        href="https://oclta.com"
        className="absolute top-4 right-8 oclta-title text-oclta-black hover:text-gray-600 transition-colors"
      >
        OCLTA
      </a>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pt-16 flex-1 flex flex-col justify-center">
        {/* Success Message */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-medium mb-4 text-oclta-black">
            You're on the waitlist
          </h1>
          
          <p className="text-sm text-gray-600 mb-12">
            We'll reach out as soon as access is ready.
          </p>

          {/* Action Button */}
          <a
            href="https://oclta.com"
            className="btn-primary inline-block"
          >
            Visit OCLTA
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center py-4">
        <div className="text-[8px] text-gray-500 font-mono">
          Powered by OCLTA
        </div>
      </div>
    </div>
  )
}
