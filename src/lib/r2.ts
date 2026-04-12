import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// ─── Error ────────────────────────────────────────────────────────────────────

export class R2Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'R2Error';
  }
}

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(level: string, msg: string, extra?: Record<string, unknown>): void {
  console.error(JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }));
}

// ─── Singleton client ─────────────────────────────────────────────────────────

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (_client) return _client;

  const accessKeyId     = process.env['R2_ACCESS_KEY_ID'];
  const secretAccessKey = process.env['R2_SECRET_ACCESS_KEY'];
  const endpoint        = process.env['R2_ENDPOINT'];

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    throw new R2Error('R2 credentials missing: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_ENDPOINT are required.');
  }

  _client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  return _client;
}

// Reset singleton (for testing only)
export function _resetClient(): void {
  _client = null;
}

// ─── Bucket name ──────────────────────────────────────────────────────────────

function getBucket(): string {
  const bucket = process.env['R2_BUCKET_NAME'];
  if (!bucket) {
    throw new R2Error('R2_BUCKET_NAME is not set.');
  }
  return bucket;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function uploadJSON(key: string, data: unknown): Promise<void> {
  const client = getClient();
  const bucket = getBucket();

  log('info', 'R2 upload start', { key, bucket });

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(data, null, 2),
      ContentType: 'application/json',
    }),
  );

  log('info', 'R2 upload complete', { key });
}

export async function downloadJSON<T>(key: string): Promise<T> {
  const client = getClient();
  const bucket = getBucket();

  log('info', 'R2 download start', { key, bucket });

  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  const body = await response.Body?.transformToString('utf-8');
  if (!body) {
    throw new R2Error(`R2 download returned empty body for key: ${key}`);
  }

  log('info', 'R2 download complete', { key });

  return JSON.parse(body) as T;
}
