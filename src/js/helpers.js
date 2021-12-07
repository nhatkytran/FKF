import { TIMEOUT_SEC } from "./config.js";
import icons from 'url:../img/icons.svg'; // Parcel 2.x you need to add 'url:

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    }) : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
}

export const prevPage = function (page) {
  return `
    <button class="btn--inline pagination__btn--prev" data-goto=${page - 1}>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${page - 1}</span>
    </button>
  `;
}

export const nextPage = function (page) {
  return `
    <button class="btn--inline pagination__btn--next" data-goto=${page + 1}>
      <span>Page ${page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
  `;
}