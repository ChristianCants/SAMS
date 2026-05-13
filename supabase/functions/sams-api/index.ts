import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase Client using Edge Runtime environment variables
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Parse incoming request JSON
    const { action, payload } = await req.json()

    let result = {}

    // Route actions to database queries
    switch (action) {
      
      case 'get_dashboard_stats': {
        // Fetch real data from the database
        const { count: studentCount } = await supabaseClient
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'Student')
          
        const { count: teacherCount } = await supabaseClient
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'Teacher')

        const { count: classCount } = await supabaseClient
          .from('classes')
          .select('*', { count: 'exact', head: true })
          
        result = { 
          totalStudents: studentCount || 0,
          totalTeachers: teacherCount || 0,
          totalClasses: classCount || 0,
          attendanceRate: "92%" // This requires complex joining, mocking for now until full schema is populated
        }
        break
      }
      
      case 'record_attendance': {
        const { class_id, student_id, status, date } = payload
        const { data, error } = await supabaseClient
          .from('attendance_records')
          .insert([{ class_id, student_id, status, date }])
          .select()
          
        if (error) throw error
        result = data
        break
      }
      
      default:
        throw new Error(`Unknown action provided to SAMS Edge Function: ${action}`)
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
    
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
