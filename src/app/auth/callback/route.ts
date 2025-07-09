import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	// Return the user to an error page with instructions
	return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
}
