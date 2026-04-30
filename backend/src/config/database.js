const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

const supabaseKey = env.supabaseServiceKey || env.supabaseAnonKey;

let supabase = null;
if (env.supabaseUrl && supabaseKey) {
	supabase = createClient(env.supabaseUrl, supabaseKey, { auth: { persistSession: false } });
}

const testConnection = async () => {
	if (!env.supabaseUrl || !supabaseKey) {
		console.log('✅ Skipping automatic table creation');
		return;
	}
	console.log('✅ Supabase client initialized');
};

module.exports = { supabase, testConnection };
