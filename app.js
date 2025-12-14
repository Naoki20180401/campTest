const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function openTab(key) {
  tabs.forEach(btn => {
    const active = btn.dataset.tab === key;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });

  panels.forEach(p => {
    const active = p.dataset.panel === key;
    p.classList.toggle("is-active", active);
  });

  // 画面上部がヘッダーで隠れないように少しスクロール
  const panel = document.querySelector(`[data-panel="${key}"]`);
  if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

tabs.forEach(btn => {
  btn.addEventListener("click", () => openTab(btn.dataset.tab));
});

document.querySelectorAll("[data-jump]").forEach(el => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    openTab(el.dataset.jump);
  });
});

// ===== Contact Form =====
const form = document.getElementById("contactForm");
const toast = document.getElementById("toast");
const hint = document.getElementById("formHint");

// ★ここをあなたのサーバレスAPIのURLに変更します（後述）
const API_ENDPOINT = "https://YOUR-VERCEL-PROJECT.vercel.app/api/contact";

function showToast(message, ok = true) {
  toast.textContent = message;
  toast.classList.toggle("is-show", true);
  toast.classList.toggle("ok", ok);
  toast.classList.toggle("ng", !ok);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  toast.classList.remove("is-show");

  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());

  // 簡易バリデーション
  if (!payload.name || !payload.email || !payload.message) {
    showToast("必須項目が未入力です。", false);
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = "送信中…";

  try {
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || "送信に失敗しました。");
    }

    form.reset();
    showToast("送信ありがとうございます。お礼メールを送信しました。", true);
  } catch (err) {
    showToast(err.message || "送信に失敗しました。時間を置いて再度お試しください。", false);
  } finally {
    btn.disabled = false;
    btn.textContent = "送信する";
    hint.textContent = "※ 送信内容は暗号化（HTTPS）で送られます。";
  }
});
