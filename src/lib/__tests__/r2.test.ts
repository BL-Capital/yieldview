import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Mock S3 ──────────────────────────────────────────────────────────────────

const mockSend = vi.fn();

vi.mock('@aws-sdk/client-s3', () => {
  function MockS3Client() { return { send: mockSend }; }
  MockS3Client.prototype = {};
  function MockPutObjectCommand(this: Record<string, unknown>, input: Record<string, unknown>) { Object.assign(this, input); }
  function MockGetObjectCommand(this: Record<string, unknown>, input: Record<string, unknown>) { Object.assign(this, input); }
  return {
    S3Client: MockS3Client,
    PutObjectCommand: MockPutObjectCommand,
    GetObjectCommand: MockGetObjectCommand,
  };
});

import { uploadJSON, downloadJSON, R2Error, _resetClient } from '../r2';

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  process.env['R2_ACCESS_KEY_ID'] = 'test-key-id';
  process.env['R2_SECRET_ACCESS_KEY'] = 'test-secret';
  process.env['R2_ENDPOINT'] = 'https://test.r2.cloudflarestorage.com';
  process.env['R2_BUCKET_NAME'] = 'test-bucket';
  _resetClient();
  vi.clearAllMocks();
});

afterEach(() => {
  delete process.env['R2_ACCESS_KEY_ID'];
  delete process.env['R2_SECRET_ACCESS_KEY'];
  delete process.env['R2_ENDPOINT'];
  delete process.env['R2_BUCKET_NAME'];
  _resetClient();
});

// ─── uploadJSON ───────────────────────────────────────────────────────────────

describe('uploadJSON', () => {
  it('uploads JSON data with correct key and content type', async () => {
    mockSend.mockResolvedValueOnce({});

    await uploadJSON('latest.json', { hello: 'world' });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const cmd = mockSend.mock.calls[0][0];
    expect(cmd.Bucket).toBe('test-bucket');
    expect(cmd.Key).toBe('latest.json');
    expect(cmd.ContentType).toBe('application/json');
    expect(cmd.Body).toContain('"hello"');
  });

  it('throws R2Error when credentials are missing', async () => {
    delete process.env['R2_ACCESS_KEY_ID'];
    _resetClient();

    await expect(uploadJSON('test.json', {})).rejects.toThrow(R2Error);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('throws R2Error when bucket name is missing', async () => {
    delete process.env['R2_BUCKET_NAME'];

    await expect(uploadJSON('test.json', {})).rejects.toThrow(R2Error);
  });
});

// ─── downloadJSON ─────────────────────────────────────────────────────────────

describe('downloadJSON', () => {
  it('downloads and parses JSON data', async () => {
    mockSend.mockResolvedValueOnce({
      Body: { transformToString: async () => '{"kpis":[]}' },
    });

    const result = await downloadJSON<{ kpis: unknown[] }>('latest.json');

    expect(result.kpis).toEqual([]);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('throws R2Error on empty body', async () => {
    mockSend.mockResolvedValue({ Body: null });

    await expect(downloadJSON('test.json')).rejects.toThrow(R2Error);
  });

  it('throws R2Error when credentials are missing', async () => {
    delete process.env['R2_SECRET_ACCESS_KEY'];
    _resetClient();

    await expect(downloadJSON('test.json')).rejects.toThrow(R2Error);
  });
});
