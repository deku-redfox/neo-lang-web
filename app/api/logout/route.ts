import { logoutAction } from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const result = await logoutAction()
    if (result) {
        return NextResponse.redirect(new URL('/', request.url))
    }
}