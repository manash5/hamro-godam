import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Disable default bodyParser
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Configure formidable
  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    filename: (name, ext) => `${uuidv4()}${ext}`, // Generate unique filename
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
    filter: ({ mimetype }) => {
      // Only allow image files
      return mimetype && mimetype.includes('image');
    }
  });

  try {
    const [_, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.image?.[0]; // Assuming your file input is named "image"
    if (!file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Get the web-accessible path
    const webPath = `/uploads/${path.basename(file.filepath)}`;

    return res.status(200).json({ 
      success: true,
      path: webPath,
      filename: path.basename(file.filepath),
      size: file.size,
      mimetype: file.mimetype
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.message.includes('maxFileSize exceeded')) {
      return res.status(413).json({ error: 'File size exceeds 10MB limit' });
    }
    
    if (error.message.includes('unexpected file type')) {
      return res.status(415).json({ error: 'Only image files are allowed' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}