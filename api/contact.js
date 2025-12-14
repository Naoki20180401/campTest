export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, company = "", size = "", message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 環境変数（Vercelに設定）
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const ADMIN_TO = process.env.ADMIN_TO_EMAIL; // 自分の受信先
    const FROM = process.env.FROM_EMAIL;         // 例: "IT相談窓口 <no-reply@yourdomain.com>"

    if (!RESEND_API_KEY || !ADMIN_TO || !FROM) {
      return res.status(500).json({ error: "Server env is not configured" });
    }

    // Resend API
    const send = async (payload) => {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.message || "Resend send failed");
      return j;
    };

    // 1) 管理者へ通知メール
    await send({
      from: FROM,
      to: [ADMIN_TO],
      subject: `【IT相談窓口】新規お問い合わせ：${name} 様`,
      text:
`新規問い合わせが届きました。

【お名前】${name}
【メール】${email}
【会社名】${company}
【従業員規模】${size}

【相談内容】
${message}
`,
    });

    // 2) 入力者へお礼メール（自動返信）
    await send({
      from: FROM,
      to: [email],
      subject: "【IT相談窓口】お問い合わせありがとうございます",
      text:
`${name} 様

お問い合わせありがとうございます。内容を確認のうえ、担当よりご連絡いたします。

--- 送信内容 ---
会社名：${company}
従業員規模：${size}

相談内容：
${message}
----------------

※本メールは自動送信です。
`,
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Internal Server Error" });
  }
}
