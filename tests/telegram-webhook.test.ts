import assert from 'node:assert';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { verifyTelegramSecret, processTelegramUpdate, isAdminUser } from '../src/lib/telegram';

describe('Telegram Webhook & Core Logic', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('verifyTelegramSecret', () => {
    it('returns true when secret token matches expected value', () => {
      const isValid = verifyTelegramSecret('secret-token-123', 'secret-token-123');
      assert.strictEqual(isValid, true);
    });

    it('returns false when secret token is wrong or mismatched length', () => {
      assert.strictEqual(verifyTelegramSecret('wrong-secret', 'secret-token-123'), false);
      assert.strictEqual(verifyTelegramSecret('short', 'longer-secret'), false);
    });

    it('returns false when secret or header is missing or null', () => {
      assert.strictEqual(verifyTelegramSecret(null, 'secret'), false);
      assert.strictEqual(verifyTelegramSecret(undefined, 'secret'), false);
      assert.strictEqual(verifyTelegramSecret('secret', undefined), false);
    });
  });

  describe('isAdminUser', () => {
    it('returns true for user ID listed in TELEGRAM_ADMIN_IDS', () => {
      process.env.TELEGRAM_ADMIN_IDS = '12345678, 87654321';
      assert.strictEqual(isAdminUser(12345678), true);
      assert.strictEqual(isAdminUser(87654321), true);
    });

    it('returns false for user ID not listed or missing TELEGRAM_ADMIN_IDS', () => {
      process.env.TELEGRAM_ADMIN_IDS = '12345678';
      assert.strictEqual(isAdminUser(99999999), false);
      delete process.env.TELEGRAM_ADMIN_IDS;
      assert.strictEqual(isAdminUser(12345678), false);
    });
  });

  describe('processTelegramUpdate', () => {
    it('returns 400 for invalid or malformed update payloads', async () => {
      // @ts-expect-error invalid update object
      const result = await processTelegramUpdate({});
      assert.strictEqual(result.status, 400);
      assert.strictEqual(result.body, 'Invalid update payload');
    });

    it('returns 200 for unsupported message/chat types safely', async () => {
      const result = await processTelegramUpdate({
        update_id: 9999999,
        message: {
          message_id: 1,
          date: 12345678,
          chat: { id: -100123456, type: 'supergroup' },
          text: '/start',
        },
      });
      assert.strictEqual(result.status, 200);
    });
  });
});
