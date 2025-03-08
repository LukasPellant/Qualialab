// src/app/api/videos/route.ts
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const directoryPath = path.join(process.cwd(), 'public', 'records');
    const files = await fs.readdir(directoryPath);
    const videoFiles = files.filter(file => file.endsWith('.mp4')); // JEN MP4
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    return NextResponse.json({ videoFiles }, { headers });
  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json({ error: 'Failed to read directory' }, { status: 500 });
  }
}