import assert from 'node:assert';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { verifyTelegramSecret, processTelegramUpdate, parseNameAndContact } from '../src/lib/telegram';

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

  describe('parseNameAndContact', () => {
    it('splits a name from an email', () => {
      assert.deepStrictEqual(parseNameAndContact('John Doe, john@example.com'), { name: 'John Doe', contact: 'john@example.com' });
    });
    it('splits a name from a phone number', () => {
      assert.deepStrictEqual(parseNameAndContact('Abebe Kebede 0911 223 344'), { name: 'Abebe Kebede', contact: '0911 223 344' });
    });
    it('keeps a name-only message as the name', () => {
      assert.deepStrictEqual(parseNameAndContact('Sara'), { name: 'Sara', contact: '' });
    });
  });
});
