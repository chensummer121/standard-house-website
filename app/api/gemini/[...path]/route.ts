import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyC3cXDQYEPiERKwoDNcRDy__PtSiN3PiSw';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const url = new URL(request.url);
  const targetPath = '/' + params.path.join('/');
  let targetUrl = GEMINI_BASE + targetPath;
  if (url.search) {
    if (!url.searchParams.has('key')) {
      targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'key=' + GEMINI_API_KEY;
    } else {
      targetUrl += url.search;
    }
  } else {
    targetUrl += '?key=' + GEMINI_API_KEY;
  }

  try {
    const response = await fetch(targetUrl, { method: 'GET' });
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('content-type') || 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const url = new URL(request.url);
  const targetPath = '/' + params.path.join('/');
  let targetUrl = GEMINI_BASE + targetPath;
  if (url.search) {
    if (!url.searchParams.has('key')) {
      targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'key=' + GEMINI_API_KEY;
    } else {
      targetUrl += url.search;
    }
  } else {
    targetUrl += '?key=' + GEMINI_API_KEY;
  }

  try {
    const body = await request.text();
    const response = await fetch(targetUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('content-type') || 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' },
  });
}
