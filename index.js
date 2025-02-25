const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = "https://phwwnnhjpdginvqlgjiv.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
