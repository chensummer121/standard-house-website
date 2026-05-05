import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyC3cXDQYEPiERKwoDNcRDy__PtSiN3PiSw';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  // 构建目标URL：/api/gemini/v1beta/... -> https://generativelanguage.googleapis.com/v1beta/...
  let targetPath = url.pathname.replace(/^\/api\/gemini/, '');
  if (url.search) {
    targetPath += url.search;
  }
  // 如果没有query参数中的key，添加API key
  if (!url.searchParams.has('key')) {
    targetPath += (targetPath.includes('?') ? '&' : '?') + 'key=' + GEMINI_API_KEY;
  }
  const targetUrl = GEMINI_BASE + targetPath;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  let targetPath = url.pathname.replace(/^\/api\/gemini/, '');
  if (url.search) {
    targetPath += url.search;
  }
  if (!url.searchParams.has('key')) {
    targetPath += (targetPath.includes('?') ? '&' : '?') + 'key=' + GEMINI_API_KEY;
  }
  const targetUrl = GEMINI_BASE + targetPath;

  try {
    const body = await request.text();
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
