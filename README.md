# OCLTA Application Portal

A premium, minimalist application portal for the OCLTA network and community. Built with Next.js, TypeScript, and Supabase.

## Features

- **Multi-step Application Form**: Clean, step-by-step form with validation
- **Premium Design**: Inspired by OCLTA's minimalist aesthetic and Soho House's exclusive feel
- **Supabase Integration**: Secure data storage with proper validation
- **Waitlist Counter**: Dynamic waitlist position tracking
- **Responsive Design**: Optimized for all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom OCLTA theme
- **Database**: Supabase
- **Font**: JetBrains Mono
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup

Run the SQL schema in your Supabase project:

```sql
-- See supabase-schema.sql for the complete schema
```

### 4. Development

```bash
npm run dev
```

Visit `http://localhost:3000/join` to see the application form.

## Application Flow

1. **Personal Details**: First name, last name, email, date of birth
2. **Interests**: Select from Blitzes, Networking, Health & Wellness, Creative
3. **About**: Tell us more about yourself (long text input)
4. **Success**: Confirmation with waitlist position

## Design Philosophy

The design combines:
- **OCLTA's Minimalist Aesthetic**: Clean typography, monochromatic palette, generous whitespace
- **Soho House's Exclusive Feel**: Premium form design, sophisticated interactions
- **JetBrains Mono Font**: Technical, monospace feel that matches OCLTA's brand
- **Responsive Layout**: Works seamlessly across all devices

## Deployment

The application is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## File Structure

```
app/
├── globals.css          # Global styles and Tailwind config
├── layout.tsx            # Root layout
├── page.tsx            # Home page (redirects to /join)
├── join/
│   ├── page.tsx        # Main application form
│   └── success/
│       └── page.tsx    # Success page with waitlist count
└── api/
    └── apply/
        └── route.ts    # API endpoint for form submission

lib/
└── supabase.ts         # Supabase client configuration

supabase-schema.sql     # Database schema
```

## Customization

- **Colors**: Update `tailwind.config.js` to modify the color palette
- **Fonts**: Change the font family in `globals.css`
- **Form Fields**: Modify the form structure in `app/join/page.tsx`
- **Styling**: Update component classes in `globals.css`
