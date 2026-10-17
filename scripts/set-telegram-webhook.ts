import 'dotenv/config';

async function setWebhook() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mwd-xm8f.vercel.app';
  const webhookUrl = `${baseUrl.replace(/\/$/, '')}/api/telegram/webhook`;

  if (!token) {
    console.error('Error: TELEGRAM_BOT_TOKEN environment variable is not set.');
    process.exit(1);
  }

  if (!secret) {
    console.error('Error: TELEGRAM_WEBHOOK_SECRET environment variable is not set.');
    process.exit(1);
  }

  console.log(`Setting Telegram webhook for bot...`);
  console.log(`Webhook URL: ${webhookUrl}`);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: secret,
        allowed_updates: ['message', 'callback_query'],
      }),
    });

    const data = await res.json();
    if (data.ok) {
      console.log('✅ Webhook successfully set!');
      console.log('Telegram API response:', data);
    } else {
      console.error('❌ Failed to set webhook:', data);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Exception occurred setting webhook:', error);
    process.exit(1);
  }
}

setWebhook();
