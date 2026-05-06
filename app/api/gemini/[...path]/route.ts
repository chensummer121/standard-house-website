import { NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAz-cq4aTnOAIQ3weQVZXG1Kpq66s9tYw4';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com';

function buildTargetUrl(request: NextRequest, path: string[]): string {
  const url = new URL(request.url);
  const targetPath = '/' + path.join('/');
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
  return targetUrl;
}

function isSseRequest(url: string): boolean {
  return url.includes('alt=sse') || url.includes('streamGenerateContent');
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const targetUrl = buildTargetUrl(request, params.path);
  try {
    if (isSseRequest(targetUrl)) {
      const response = await fetch(targetUrl, { method: 'GET' });
      if (!response.ok) {
        const data = await response.text();
        return new Response(data, { status: response.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
      return new Response(response.body, { status: response.status, headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' } });
    }
    const response = await fetch(targetUrl, { method: 'GET' });
    const data = await response.text();
    return new Response(data, { status: response.status, headers: { 'Content-Type': response.headers.get('content-type') || 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const targetUrl = buildTargetUrl(request, params.path);
  try {
    const body = await request.text();
    if (isSseRequest(targetUrl)) {
      const response = await fetch(targetUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      if (!response.ok) {
        const data = await response.text();
        return new Response(data, { status: response.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
      return new Response(response.body, { status: response.status, headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' } });
    }
    const response = await fetch(targetUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    const data = await response.text();
    return new Response(data, { status: response.status, headers: { 'Content-Type': response.headers.get('content-type') || 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-goog-api-key' },
  });
}
