import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('Form submission received')
    const formData = await request.formData()
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const dateOfBirth = formData.get('dateOfBirth') as string
    const country = formData.get('country') as string
    const city = formData.get('city') as string
    const zipCode = formData.get('zipCode') as string
    const reasons = JSON.parse(formData.get('reasons') as string)
    const about = formData.get('about') as string
    const instagram = formData.get('instagram') as string
    const linkedin = formData.get('linkedin') as string
    const smsUpdates = formData.get('smsUpdates') === 'true'
    const phoneNumber = formData.get('phoneNumber') as string
    const profilePhoto = formData.get('profilePhoto') as File | null

    // Validate required fields
    if (!firstName || !lastName || !email || !dateOfBirth || !country || !city || !zipCode || !reasons || reasons.length === 0) {
      return NextResponse.json(
        { error: 'All required fields must be completed' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Supabase is now configured with real credentials

    // Upload profile photo if provided
    let photoUrl = null
    if (profilePhoto && profilePhoto.size > 0) {
      const fileExt = profilePhoto.name.split('.').pop()
      const fileName = `${email}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('profile-photos')
        .upload(fileName, profilePhoto)
      
      if (uploadError) {
        console.error('Photo upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload profile photo' },
          { status: 500 }
        )
      }
      
      photoUrl = uploadData.path
    }

    // Check if email already exists
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('email')
      .eq('email', email)
      .single()

    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      )
    }

    // Insert new application
    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          date_of_birth: dateOfBirth,
          country,
          city,
          zip_code: zipCode,
          interests: reasons,
          about: about || null,
          instagram: instagram || null,
          linkedin: linkedin || null,
          sms_updates: smsUpdates || false,
          phone_number: phoneNumber || null,
          profile_photo_url: photoUrl
        }
      ])
      .select()

    if (error) {
      console.error('Supabase database error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: 'Failed to submit application', details: error.message },
        { status: 500 }
      )
    }

    // Get current application count for waitlist
    const { count } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })

    // Calculate waitlist count (starting at 103 + current count)
    const waitlistCount = 103 + (count || 0)

    // TODO: Send confirmation email
    // For now, we'll just log it
    console.log(`Application submitted for ${email}. Waitlist position: ${waitlistCount}`)

    return NextResponse.json({
      success: true,
      waitlistCount,
      message: 'Application submitted successfully'
    })

  } catch (error) {
    console.error('Application submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
