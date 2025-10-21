'use client'

import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const waitlistCount = searchParams.get('count') || '103'

  return (
    <div className="min-h-screen bg-oclta-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold">OCLTA</div>
            <div className="text-sm text-gray-500">JOIN ( )</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="w-16 h-16 text-oclta-black mx-auto" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-semibold mb-6">You're on the waitlist</h1>
          
          <div className="space-y-6 text-left max-w-md mx-auto">
            <p className="text-lg">
              We'll reach out as soon as access is ready.
            </p>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                We'll review your application and get back to you soon. 
                In the meantime, you can learn more about OCLTA at{' '}
                <a 
                  href="https://oclta.com" 
                  className="text-oclta-black underline hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  oclta.com
                </a>
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-12">
            <a
              href="https://oclta.com"
              className="btn-primary inline-block"
            >
              Visit OCLTA
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
