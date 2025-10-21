-- Create applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  date_of_birth DATE NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  interests TEXT[] NOT NULL,
  about TEXT,
  instagram VARCHAR(255),
  linkedin VARCHAR(255),
  sms_updates BOOLEAN DEFAULT FALSE,
  phone_number VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_applications_email ON applications(email);

-- Create index on created_at for sorting
CREATE INDEX idx_applications_created_at ON applications(created_at);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for applications)
CREATE POLICY "Allow public to insert applications" ON applications
  FOR INSERT WITH CHECK (true);

-- Create policy to allow service role to read all applications
CREATE POLICY "Allow service role to read applications" ON applications
  FOR SELECT USING (auth.role() = 'service_role');
