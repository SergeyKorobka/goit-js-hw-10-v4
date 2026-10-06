import { PREP_TIME } from './js/menu.js';

const form = document.querySelector('.form');
const orderLog = document.querySelector('.order-log');

const makeOrder = (delay, shouldResolve) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
};

const addOrderRow = drink => {
  const row = document.createElement('li');
  row.classList.add('row-pending');
  row.textContent = `⏳ ${drink} · у роботі…`;
  orderLog.append(row);
  return row;
};

form.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const drink = formData.get('drink');
  const state = formData.get('state');

  const delay = PREP_TIME[drink];
  const shouldResolve = state === 'fulfilled';

  const row = addOrderRow(drink);

  makeOrder(delay, shouldResolve)
    .then(prepTime => {
      row.className = 'row-ok';
      row.textContent = `✅ ${drink} · готове · ${prepTime} ms`;
    })
    .catch(prepTime => {
      row.className = 'row-err';
      row.textContent = `❌ ${drink} · скасовано · ${prepTime} ms`;
    })
    .finally(() => {
      const finishTime = new Date().toLocaleTimeString('uk-UA');
      row.textContent += ` · ${finishTime}`;
    });
});
