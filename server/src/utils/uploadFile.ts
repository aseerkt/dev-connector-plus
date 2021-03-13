import { FileUpload } from 'graphql-upload';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { randomBytes } from 'crypto';

interface FileUploadResponse {
  Urn?: string;
  isUploaded: boolean;
  error?: string;
}

export const uploadFile = async (
  file: FileUpload
): Promise<FileUploadResponse> => {
  const { filename, mimetype, createReadStream } = await file;

  if (mimetype && !mimetype.includes('image')) {
    throw new Error(`Unsupported file type: ${mimetype.split('/')[0]}`);
  }
  const random = randomBytes(10).toString('hex');
  const fileName = `${random}_${new Date().toISOString()}_${filename}`;
  const destination = `public/images/`;
  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }
  const filePath = destination + fileName;
  const fileUrn = `images/${fileName}`;
  return new Promise((res) =>
    createReadStream()
      .pipe(createWriteStream(filePath))
      .on('drain', () => {
        console.log('file uploading');
      })
      .on('close', () => {
        console.log('file uploaded');
        res({
          Urn: fileUrn,
          isUploaded: true,
        });
      })
      .on('error', (err) => {
        console.error('file upload fail');
        res({
          isUploaded: false,
          error: err.message,
        });
      })
  );
};
