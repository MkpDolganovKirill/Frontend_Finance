let allExpenses = [];
let shopValue = '';
let moneyValue = 0;

window.onload = async () => {
  const resp = await fetch('http://localhost:8000/allExpenses', {
    method: 'GET'
  })
  let result = await resp.json();
  if (allExpenses) {
    allExpenses = result.data;
    allExpenses.forEach(element => {
      element.isEdit = false;
    });
  };

  saveToSessionStorage();
  render();
};

const render = () => {
  saveToSessionStorage();
  const content = document.getElementById('content-page');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  };
  const moneyTotal = document.createElement('p');
  moneyTotal.className = allExpenses.length ? 'moneyTotal' : 'hidden';

  allExpenses.map((item, index) => {
    const element = document.createElement('div');
    element.id = `expense=${index}`;
    element.className = 'element';
    
    const numberEl = document.createElement('p');
    numberEl.innerText = `${index + 1}.`;

    const company = document.createElement('p');
    company.innerText = item.company;
    company.className = item.isEdit ? 'hidden' : 'shopName';
    company.id = `company=${index}`;

    const inputShopEl = document.createElement('input');
    inputShopEl.value = item.company;
    inputShopEl.className = item.isEdit ? 'inputShopEl' : 'hidden';
    inputShopEl.type = 'text';

    const date = document.createElement('p');
    date.innerText = convertDateToText(item);
    date.className = item.isEdit ? 'hidden' : 'dateElem';
    date.id = `date=${index}`;

    const inputDateEl = document.createElement('input');
    inputDateEl.value = item.date;
    inputDateEl.className = item.isEdit ? 'inputDateEl' : 'hidden';
    inputDateEl.type = 'date';

    const money = document.createElement('p');
    money.innerText = item.money + ' р.';
    money.className = item.isEdit ? 'hidden' : 'numberEl';
    money.id = `money=${index}`;

    const inputMoneyEl = document.createElement('input');
    inputMoneyEl.value = item.money;
    inputMoneyEl.className = item.isEdit ? 'inputMoneyEl' : 'hidden';
    inputMoneyEl.type = 'number';

    const imageForEdit = document.createElement('img');
    imageForEdit.src = 'icons/edit.svg';
    imageForEdit.className = item.isEdit ? 'hidden' : 'images';

    const imageForComplete = document.createElement('img');
    imageForComplete.src = 'icons/accept.svg';
    imageForComplete.className = item.isEdit ? 'images' : 'hidden';

    const imageForCancel = document.createElement('img');
    imageForCancel.src = 'icons/cancel.svg';
    imageForCancel.className = item.isEdit ? 'images' : 'hidden';

    const imageForDelete = document.createElement('img');
    imageForDelete.src = 'icons/delete.svg';
    imageForDelete.className = item.isEdit ? 'hidden' : 'images';

    element.appendChild(numberEl);
    element.appendChild(company);
    element.appendChild(inputShopEl);
    element.appendChild(date);
    element.appendChild(inputDateEl);
    element.appendChild(money);
    element.appendChild(inputMoneyEl);
    element.appendChild(imageForEdit);
    element.appendChild(imageForComplete);
    element.appendChild(imageForCancel);
    element.appendChild(imageForDelete);
    content.appendChild(element);

    moneyValue += item.money;
  });
  moneyTotal.innerText = 'Итого: ' + moneyValue + 'р.';
  content.prepend(moneyTotal);
  moneyValue = 0;
}

const updateShopValue = () => {
  shopValue = document.getElementById('shopInput').value;
};

const updateMoneyValue = () => {
  moneyValue = document.getElementById('moneyInput').value;
};

const convertDateToText = (element) => {
  const dateText = element.date.slice(0, 10).split('-').reverse().join('.');
  return dateText;
};

const saveToSessionStorage = () => {
  sessionStorage.setItem('expenses', JSON.stringify(allExpenses));
};