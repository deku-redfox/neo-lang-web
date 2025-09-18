import { startAction } from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const result = await startAction()
    if (result) {
        return NextResponse.redirect(new URL('/me', request.url))

    } else {
        return NextResponse.redirect(new URL('/', request.url))
    }
}