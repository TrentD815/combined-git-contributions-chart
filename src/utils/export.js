import { toast } from "react-hot-toast";

const API_URL = "/api/v1/";

export function fetchData(username) {
  return fetch(API_URL + username).then((res) => res.json());
}

export function download(canvas) {
  try {
    const dataUrl = canvas.toDataURL();
    const a = document.createElement("a");
    document.body.insertAdjacentElement("beforeend", a);
    a.download = "contributions.png";
    a.href = dataUrl;
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error(err);
  }
}

export function downloadJSON(data) {
  try {
    const dataString = JSON.stringify(data);
    const dataUrl =
      "data:text/json;charset=utf-8," + encodeURIComponent(dataString);
    const a = document.createElement("a");
    document.body.insertAdjacentElement("beforeend", a);
    a.download = "contributions.json";
    a.href = dataUrl;
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error(err);
  }
}

export async function share(canvas) {
  try {
    canvas.toBlob(async (blob) => {
      navigator
        .share({
          title: "Combined Git Contributions",
          text: "Check out my version control contribution history over time. A free tool by @TrentD815",
          files: [
            new File([blob], "contributions.png", {
              type: blob.type
            })
          ]
        })
        .catch(() => {
          // do nothing
        });
    }, "image/png");
  } catch (err) {
    console.error(err);
  }
}

export async function copyToClipboard(canvas) {
  if ("ClipboardItem" in window) {
    const item = new ClipboardItem({
      "image/png": new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      })
    });
    navigator.clipboard
      .write([item])
      .then(() => toast("🎉 Copied image!"))
      .catch((err) => {
        toast("Sorry, copying image is not supported on this browser");
        console.error("failed to copy");
      });
  } else {
    toast("Sorry, copying image is not supported on this browser");
    console.error("failed to copy");
  }
}

export function cleanUsername(username) {
  return username.replace(/^(http|https):\/\/(?!www\.)github\.com\//, "");
}
