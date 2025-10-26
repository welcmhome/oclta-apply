'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface FormData {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  country: string
  city: string
  zipCode: string
  reasons: string[]
  about: string
  profilePhoto: File | null
  instagram: string
  linkedin: string
  smsUpdates: boolean
  phoneNumber: string
}

const REASONS = [
  'Blitzes',
  'Networking', 
  'Health & Wellness',
  'Creative'
]

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium', 'Ireland', 'Portugal', 'Greece', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'New Zealand', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay', 'Costa Rica', 'Panama', 'India', 'China', 'Thailand', 'Malaysia', 'Philippines', 'Indonesia', 'Vietnam', 'Taiwan', 'Israel', 'United Arab Emirates', 'Saudi Arabia', 'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Tunisia', 'Turkey', 'Russia', 'Ukraine', 'Belarus', 'Kazakhstan', 'Uzbekistan', 'Azerbaijan', 'Georgia', 'Armenia'
]

const STEPS = [
  'Personal Details',
  'Location',
  'Why Join',
  'Verify'
]

export default function JoinPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    country: '',
    city: '',
    zipCode: '',
    reasons: [],
    about: '',
    profilePhoto: null,
    instagram: '',
    linkedin: '',
    smsUpdates: false,
    phoneNumber: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for the cool effect
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500) // 1.5 seconds loading

    return () => clearTimeout(timer)
  }, [])

  // Clear any auto-filled dates on mount (Safari fix)
  useEffect(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    // If Safari auto-filled with today's date, clear it
    if (formData.dateOfBirth === todayStr) {
      setFormData(prev => ({ ...prev, dateOfBirth: '' }))
    }
  }, [])

  const updateFormData = (field: keyof FormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateDateOfBirth = (dateStr: string) => {
    if (!dateStr) return false
    
    const date = new Date(dateStr)
    const now = new Date()
    
    // Check if date is valid
    if (isNaN(date.getTime())) return false
    
    // Check if date is in the future (allow today's date for Safari compatibility)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    if (date >= tomorrow) return false
    
    // Check if age is realistic (13-120 years old)
    const age = now.getFullYear() - date.getFullYear()
    const monthDiff = now.getMonth() - date.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
      return age - 1 >= 13 && age - 1 <= 120
    }
    
    return age >= 13 && age <= 120
  }

  const toggleReason = (reason: string) => {
    setFormData(prev => ({
      ...prev,
      reasons: prev.reasons.includes(reason)
        ? prev.reasons.filter(r => r !== reason)
        : [...prev.reasons, reason]
    }))
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }))
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      // Validate current step before proceeding
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    console.log('=== handleSubmit called ===')
    console.log('Form data:', formData)
    console.log('Can proceed:', canProceed())
    setIsSubmitting(true)
    try {
      const submitData = new FormData()
      submitData.append('firstName', formData.firstName)
      submitData.append('lastName', formData.lastName)
      submitData.append('email', formData.email)
      submitData.append('dateOfBirth', formData.dateOfBirth)
      submitData.append('country', formData.country)
      submitData.append('city', formData.city)
      submitData.append('zipCode', formData.zipCode)
      submitData.append('reasons', JSON.stringify(formData.reasons))
      submitData.append('about', formData.about)
      submitData.append('instagram', formData.instagram)
      submitData.append('linkedin', formData.linkedin)
      submitData.append('smsUpdates', formData.smsUpdates.toString())
      submitData.append('phoneNumber', formData.phoneNumber)
      if (formData.profilePhoto) {
        submitData.append('profilePhoto', formData.profilePhoto)
      }

      const response = await fetch('/api/apply', {
        method: 'POST',
        body: submitData,
      })

      if (response.ok) {
        const result = await response.json()
        // Show loading for a moment before redirecting
        setTimeout(() => {
          window.location.href = `/join/success?count=${result.waitlistCount}`
        }, 1500) // 1.5 seconds loading
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('There was an error submitting your application. Please try again.')
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="w-full space-y-6">
            <div>
              <label className="form-label">First Name</label>
              <input
                type="text"
                className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                placeholder="Enter your first name"
                required
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                placeholder="Enter your last name"
                required
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="Enter your email address"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className={`form-input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                value={formData.dateOfBirth}
                onChange={(e) => {
                  console.log('Date onChange:', e.target.value)
                  updateFormData('dateOfBirth', e.target.value)
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLInputElement
                  console.log('Date onBlur:', target.value)
                  if (target.value !== formData.dateOfBirth) {
                    updateFormData('dateOfBirth', target.value)
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement
                  console.log('Date onInput:', target.value)
                  updateFormData('dateOfBirth', target.value)
                }}
                required
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
            </div>
          </div>
        )
      
      case 1:
        return (
          <div className="w-full space-y-6">
            <div>
              <label className="form-label">Country / Region</label>
              <select
                className={`form-input ${errors.country ? 'border-red-500' : ''}`}
                value={formData.country}
                onChange={(e) => updateFormData('country', e.target.value)}
                required
              >
                <option value="">Select your country or region</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>
            <div>
              <label className="form-label">City</label>
              <input
                type="text"
                className={`form-input ${errors.city ? 'border-red-500' : ''}`}
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                placeholder="Enter your city"
                required
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="form-label">ZIP / Postal Code</label>
              <input
                type="text"
                className={`form-input ${errors.zipCode ? 'border-red-500' : ''}`}
                value={formData.zipCode}
                onChange={(e) => updateFormData('zipCode', e.target.value)}
                placeholder="Enter your ZIP or postal code"
                required
              />
              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="w-full space-y-6">
            <div>
              <label className="form-label">Why do you want to join OCLTA?</label>
              <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
              <div className="space-y-0">
                {REASONS.map((reason) => (
                  <div key={reason} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={reason}
                      className="checkbox-input"
                      checked={formData.reasons.includes(reason)}
                      onChange={() => toggleReason(reason)}
                    />
                    <label htmlFor={reason} className="text-sm font-medium cursor-pointer">
                      {reason}
                    </label>
                  </div>
                ))}
              </div>
              {errors.reasons && <p className="text-red-500 text-sm mt-1">{errors.reasons}</p>}
            </div>
            <div>
              <label className="form-label">Tell us more about yourself (optional)</label>
              <textarea
                className="form-input min-h-[130px] resize-none"
                value={formData.about}
                onChange={(e) => updateFormData('about', e.target.value)}
                placeholder="Share your background, interests, and what you hope to gain from OCLTA..."
              />
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="w-full space-y-6">
            {/* Profile Photo Upload */}
            <div>
              <label className="form-label">Profile Photo (Optional)</label>
              <p className="text-sm text-gray-600 mb-4">
                Completing this optional step helps us pre-verify members for future Blitz travel or in-person events, ensuring you're cleared for access when we launch.
              </p>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById('profile-photo-upload')?.click()}
                onDrop={(e) => {
                  e.preventDefault()
                  const files = e.dataTransfer.files
                  if (files.length > 0) {
                    const file = files[0]
                    if (file) {
                      // Directly update formData to avoid TypeScript issues
                      setFormData(prev => ({ ...prev, profilePhoto: file }))
                    }
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="profile-photo-upload"
                />
                {formData.profilePhoto ? (
                  <div>
                    <p className="text-sm text-oclta-black">Photo selected: {formData.profilePhoto.name}</p>
                    <span className="text-sm text-gray-500 underline mt-2">Change photo</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">Drag and drop your photo here, or click to browse</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <label className="form-label">Social Media (Optional)</label>
              <p className="text-sm text-gray-600 mb-4">Connect your social profiles to help us learn more about you.</p>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Instagram</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.instagram}
                     onChange={(e) => {
                       let value = e.target.value
                       // Auto-add @ if user starts typing without it
                       if (value && !value.startsWith('@')) {
                         value = '@' + value
                       }
                       updateFormData('instagram', value)
                     }}
                    placeholder="@yourusername"
                  />
                </div>
                <div>
                  <label className="form-label">Other</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.linkedin}
                    onChange={(e) => updateFormData('linkedin', e.target.value)}
                    placeholder="Twitter, TikTok, YouTube, etc."
                  />
                </div>
              </div>
            </div>

            {/* Text Message Updates */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="sms-toggle" className="form-label cursor-pointer">Text Message Updates (Optional)</label>
                  <p className="text-xs text-gray-600">Stay informed about OCLTA news and events via SMS.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="sms-toggle"
                    className="sr-only peer"
                    checked={formData.smsUpdates}
                    onChange={(e) => updateFormData('smsUpdates', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-oclta-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-oclta-black"></div>
                </label>
              </div>
              {formData.smsUpdates && (
                <div className="mt-4">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                  <p className="text-xs text-gray-500 mt-2">You can unsubscribe at any time by messaging STOP.</p>
                </div>
              )}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  const validateCurrentStep = () => {
    const newErrors: {[key: string]: string} = {}
    
    switch (currentStep) {
      case 0:
        if (!formData.firstName) newErrors.firstName = 'First name is required'
        if (!formData.lastName) newErrors.lastName = 'Last name is required'
        if (!formData.email) {
          newErrors.email = 'Email is required'
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address'
        }
        if (!formData.dateOfBirth) {
          newErrors.dateOfBirth = 'Date of birth is required'
        } else if (!validateDateOfBirth(formData.dateOfBirth)) {
          newErrors.dateOfBirth = 'Please enter a valid date of birth'
        }
        break
      case 1:
        if (!formData.country) newErrors.country = 'Country is required'
        if (!formData.city) newErrors.city = 'City is required'
        if (!formData.zipCode) newErrors.zipCode = 'ZIP/Postal code is required'
        break
      case 2:
        if (formData.reasons.length === 0) newErrors.reasons = 'Please select at least one reason'
        break
      case 3:
        return true // Verify step is optional
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const canProceed = () => {
    console.log('=== canProceed called ===')
    console.log('Current step:', currentStep)
    console.log('Form data:', formData)
    
    switch (currentStep) {
      case 0:
        const isValid = formData.firstName && formData.lastName && formData.email && formData.dateOfBirth && validateEmail(formData.email) && validateDateOfBirth(formData.dateOfBirth)
        // Debug logging for all browsers
        console.log('Debug - canProceed step 0:', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
          emailValid: validateEmail(formData.email),
          dateValid: validateDateOfBirth(formData.dateOfBirth),
          isValid
        })
        return isValid
      case 1:
        const step1Valid = formData.country && formData.city && formData.zipCode
        console.log('Debug - canProceed step 1:', {
          country: formData.country,
          city: formData.city,
          zipCode: formData.zipCode,
          isValid: step1Valid
        })
        return step1Valid
      case 2:
        const step2Valid = formData.reasons.length > 0
        console.log('Debug - canProceed step 2:', {
          reasons: formData.reasons,
          length: formData.reasons.length,
          isValid: step2Valid
        })
        return step2Valid
      case 3:
        console.log('Debug - canProceed step 3: always true')
        return true // Verify step is optional
      default:
        return false
    }
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-oclta-white flex flex-col items-center justify-center">
        {/* OCLTA Title */}
        <div className="loading-title text-oclta-black mb-8">
          OCLTA
        </div>
        
        {/* Loading Animation */}
        <div className="flex flex-col items-center space-y-6">
          {/* Animated dots */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  // Submission loading screen
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-oclta-white flex flex-col items-center justify-center">
        {/* OCLTA Title */}
        <div className="loading-title text-oclta-black mb-8">
          OCLTA
        </div>
        
        {/* Loading Animation */}
        <div className="flex flex-col items-center space-y-6">
          {/* Animated dots */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-oclta-white flex flex-col">
      {/* Back Arrow - Top Left */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
        <a 
          href="https://group.oclta.com/login" 
          className="text-oclta-black hover:text-gray-600 transition-colors"
          style={{ 
            fontFamily: 'monospace',
            fontSize: '32px',
            lineHeight: '1',
            imageRendering: 'pixelated',
            textRendering: 'optimizeSpeed',
            fontSmooth: 'never',
            WebkitFontSmoothing: 'none'
          }}
        >
          ←
        </a>
      </div>

      {/* OCLTA Logo - Top Right */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-8">
        <a 
          href="https://oclta.com" 
          className="oclta-title text-oclta-black hover:text-gray-600 transition-colors"
        >
          OCLTA
        </a>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pt-20 sm:pt-16 flex-1">
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          <h1 className="text-xl font-medium mb-6">Request Access</h1>
          
          {/* Mobile Step Navigation */}
          <div className="flex justify-start items-center space-x-2 mb-8 ml-0">
            {STEPS.map((step, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-oclta-black border-oclta-black text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div 
                    className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                      index < currentStep ? 'bg-oclta-black' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div className="flex">
            {/* Left Side - Progress Circles with Connecting Lines */}
            <div className="flex flex-col items-center mr-8 mt-20">
              {STEPS.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                      index <= currentStep 
                        ? 'bg-oclta-black border-oclta-black text-white' 
                        : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div 
                      className={`w-0.5 h-10 my-2 transition-all duration-300 ${
                        index < currentStep ? 'bg-oclta-black' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Right Side - Form Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-medium mb-8">Request Access</h1>
              
              {/* Horizontal Step Navigation */}
              <div className="flex space-x-8 mb-8">
                {STEPS.map((step, index) => (
                  <div key={index} className="flex flex-col items-center min-w-0 flex-shrink-0">
                    <span className={`text-sm font-medium whitespace-nowrap ${index === currentStep ? 'text-oclta-black' : 'text-gray-500'}`}>
                      {step}
                    </span>
                    <div className={`h-0.5 w-full mt-1 ${index === currentStep ? 'bg-oclta-black' : 'bg-transparent'}`}></div>
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <div className="mb-6">
                {renderStepContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Form Content */}
        <div className="block sm:hidden">
          <div className="w-full max-w-full mb-8">
            <div className="w-full max-w-full">
              {renderStepContent()}
            </div>
          </div>
          
          {/* Mobile Navigation Buttons */}
          <div className="w-full flex flex-col gap-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-500 hover:text-oclta-black disabled:opacity-50 disabled:cursor-not-allowed w-full py-3"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden sm:block">
          <div className="flex flex-row justify-between gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center justify-center sm:justify-start space-x-2 text-sm font-medium text-gray-500 hover:text-oclta-black disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Powered by OCLTA - Bottom */}
      <div className="flex justify-center py-4">
        <span className="text-[8px] text-gray-500 font-mono">Powered by OCLTA</span>
      </div>
    </div>
  )
}
