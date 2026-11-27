const inquiryForm = document.querySelector(".contact-form");
const displayedCode = document.querySelector("#verification-code");
const answer = document.querySelector("#verification-answer");
const refreshButton = document.querySelector("#verification-refresh");
const status = document.querySelector("#verification-status");
const submitButton = inquiryForm.querySelector('button[type="submit"]');
let code = "";

function updateVerification() {
  const entered = answer.value;
  const verified = code !== "" && entered === code;
  submitButton.disabled = !verified;
  answer.setCustomValidity(verified ? "" : "請輸入畫面上的驗證碼。");
  status.textContent = verified
    ? "驗證通過，可以提交。"
    : entered.length === 6
      ? "驗證碼不符，請重新輸入。"
      : "完成驗證後即可提交。";
  return verified;
}

function renewCode() {
  const number = crypto.getRandomValues(new Uint32Array(1))[0] % 900000 + 100000;
  const candidate = String(number);
  code = candidate === code ? String(number === 999999 ? 100000 : number + 1) : candidate;
  displayedCode.value = code;
  answer.value = "";
  updateVerification();
}

answer.addEventListener("input", updateVerification);
refreshButton.addEventListener("click", () => {
  renewCode();
  answer.focus();
});
inquiryForm.addEventListener("submit", event => {
  if (!updateVerification()) event.preventDefault();
});
inquiryForm.addEventListener("reset", () => queueMicrotask(renewCode));
window.addEventListener("pageshow", event => {
  if (event.persisted) renewCode();
});
renewCode();
