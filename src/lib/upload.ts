import { mkdir, writeFile, unlink } from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');
}

export async function saveUploadedImage(file: File, subDir: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const originalName = sanitizeFileName(file.name || 'image');
  const ext = path.extname(originalName) || '.png';
  const baseName = path.basename(originalName, ext) || 'image';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}${ext}`;

  const relativeDir = path.join('assets', 'upload', subDir);
  const absoluteDir = path.join(PUBLIC_DIR, relativeDir);
  await mkdir(absoluteDir, { recursive: true });

  const absoluteFilePath = path.join(absoluteDir, fileName);
  await writeFile(absoluteFilePath, buffer);

  return `/${path.join(relativeDir, fileName).replace(/\\/g, '/')}`;
}

export async function deleteUploadedImageIfLocal(imagePath?: string): Promise<void> {
  if (!imagePath || !imagePath.startsWith('/assets/upload/')) return;

  const absoluteFilePath = path.join(PUBLIC_DIR, imagePath.replace(/^\//, ''));
  try {
    await unlink(absoluteFilePath);
  } catch {
    // Ignore missing files to keep update/delete operations resilient.
  }
}
