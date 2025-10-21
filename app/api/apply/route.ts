import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, dateOfBirth, country, city, zipCode, reasons, about, instagram, linkedin, smsUpdates, phoneNumber } = body

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

    // Check if Supabase is configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'

    if (!isSupabaseConfigured) {
      // Return success response without database operations
      console.log(`Application submitted for ${email} (Supabase not configured yet)`)
      return NextResponse.json({
        success: true,
        waitlistCount: 103, // Default waitlist count
        message: 'Application submitted successfully (database not configured yet)'
      })
    }

    // Check if email already exists
    const { data: existingApplication } = await supabaseAdmin
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
    const { data, error } = await supabaseAdmin
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
          phone_number: phoneNumber || null
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      )
    }

    // Get current application count for waitlist
    const { count } = await supabaseAdmin
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
