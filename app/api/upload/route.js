import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  // Parse the incoming form data
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
      filename: (name, ext) => `${uuidv4()}${ext}`,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }) => mimetype && mimetype.includes('image'),
    });

    form.parse(request, async (err, fields, files) => {
      if (err) {
        let status = 500;
        let error = 'Internal server error';
        if (err.message.includes('maxFileSize exceeded')) {
          status = 413;
          error = 'File size exceeds 10MB limit';
        } else if (err.message.includes('unexpected file type')) {
          status = 415;
          error = 'Only image files are allowed';
        }
        resolve(new Response(JSON.stringify({ error }), { status, headers: { 'Content-Type': 'application/json' } }));
        return;
      }
      const file = files.image?.[0] || files.image;
      if (!file) {
        resolve(new Response(JSON.stringify({ error: 'No image file provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } }));
        return;
      }
      const webPath = `/uploads/${path.basename(file.filepath || file.path)}`;
      resolve(new Response(JSON.stringify({
        success: true,
        path: webPath,
        filename: path.basename(file.filepath || file.path),
        size: file.size,
        mimetype: file.mimetype
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    });
  });
} 