import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';

import { asyncHandler } from '@wellness/utils';

import { logger } from '../lib/logger';
import { cloudinaryService } from '../services/cloudinary.service';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  '/upload',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  upload.single('file') as any,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    let fileSource: string;
    let fileBuffer: Buffer | null = null;
    let fileMime = 'image/jpeg';
    const body = req.body as Record<string, unknown> | undefined;
    const folder = typeof body?.folder === 'string' ? body.folder : 'wellness_catalog';

    if (req.file) {
      fileMime = req.file.mimetype || 'image/jpeg';
      fileBuffer = req.file.buffer;
      const base64 = fileBuffer.toString('base64');
      fileSource = `data:${fileMime};base64,${base64}`;
    } else if (typeof body?.file === 'string' && body.file.trim().length > 0) {
      fileSource = body.file.trim();
      if (fileSource.startsWith('data:')) {
        const matches = fileSource.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches[1] && matches[2]) {
          fileMime = matches[1];
          fileBuffer = Buffer.from(matches[2], 'base64');
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        error: { message: 'No file provided in form-data field "file" or body field "file"' },
      });
    }

    try {
      const url = await cloudinaryService.uploadImage(fileSource, folder);
      return res.json({
        success: true,
        url,
      });
    } catch (err) {
      logger.warn({ err }, 'Cloudinary upload failed or timed out, using local storage fallback');
      if (fileBuffer) {
        try {
          const uploadsDir = path.resolve(process.cwd(), 'uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          const ext = fileMime.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
          const filename = `img_${String(Date.now())}_${crypto.randomBytes(6).toString('hex')}.${ext}`;
          fs.writeFileSync(path.join(uploadsDir, filename), fileBuffer);
          const host = req.get('host') || 'localhost:5000';
          const url = `${req.protocol}://${host}/uploads/${filename}`;
          return res.json({
            success: true,
            url,
          });
        } catch (localErr) {
          logger.error({ err: localErr }, 'Local storage upload fallback error');
        }
      }

      logger.error({ err }, 'Cloudinary upload route error and fallback unavailable');
      return res.status(400).json({
        success: false,
        error: { message: err instanceof Error ? err.message : 'Failed to upload image' },
      });
    }
  }),
);

export default router;
