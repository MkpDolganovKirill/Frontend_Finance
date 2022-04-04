let allExpenses = [];
let shopValue = '';
let moneyInput = null;
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

  render();
};


const onClickButton = async () => {
  if (shopValue.trim() && moneyInput) {
    const newDate = new Date();
    allExpenses.push({
      company: shopValue.trim(),
      date: newDate,
      money: moneyInput,
      isEdit: false
    });

    await fetch('http://localhost:8000/createNewExpense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        company: shopValue.trim(),
        date: newDate,
        money: moneyInput
      })
    });
    
    const respon = await fetch('http://localhost:8000/allExpenses', {
      method: 'GET'
    })

    shopValue = '';
    moneyInput = null;
    const inputCompany = document.getElementById('shopInput');
    const inputMoney = document.getElementById('moneyInput');
    inputCompany.value = '';
    inputMoney.value = '';

    const result = await respon.json();
    allExpensesOld = [...allExpenses];
    allExpenses = result.data;
    if (allExpenses) {
      allExpenses.map((element, index) => {
        element.isEdit = allExpensesOld[index].isEdit;
      });
    };
  } else {
    alert("Вы не можете добавить запись с пустыми значениями!");
  };

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

    const company = document.createElement('p');
    company.innerText = `${index + 1}. ` + item.company;
    company.className = item.isEdit ? 'hidden' : 'shopName';
    company.id = `company=${index}`;

    const inputShopEl = document.createElement('input');
    inputShopEl.value = item.company;
    inputShopEl.className = item.isEdit ? 'inputShopEl' : 'hidden';
    inputShopEl.type = 'text';

    const rightContainerCase = document.createElement('div');
    rightContainerCase.className = 'rightContainerCase';

    const date = document.createElement('p');
    date.innerText = convertDateToText(item);
    date.className = item.isEdit ? 'hidden' : 'dateElem';
    date.id = `date=${index}`;

    const inputDateEl = document.createElement('input');
    inputDateEl.className = item.isEdit ? 'inputDateEl' : 'hidden';
    inputDateEl.type = 'date';
    inputDateEl.value = convertToDate(item);

    const money = document.createElement('p');
    money.innerText = item.money + 'р.';
    money.className = item.isEdit ? 'hidden' : 'numberEl';
    money.id = `money=${index}`;

    const inputMoneyEl = document.createElement('input');
    inputMoneyEl.value = item.money;
    inputMoneyEl.className = item.isEdit ? 'inputMoneyEl' : 'hidden';
    inputMoneyEl.type = 'number';

    const imageCase = document.createElement('div');
    imageCase.className = 'imageCase';

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

    imageForDelete.onclick = () => {
      deleteElement(index);
    };

    imageForEdit.onclick = () => {
      editingElement(index);
    };

    imageForCancel.onclick = () => {
      editingElement(index);
    };

    imageForComplete.onclick = () => {
      saveEditFromInput(index, inputShopEl, inputDateEl, inputMoneyEl);
    };

    element.appendChild(company);
    element.appendChild(inputShopEl);
    rightContainerCase.appendChild(date);
    rightContainerCase.appendChild(inputDateEl);
    rightContainerCase.appendChild(money);
    rightContainerCase.appendChild(inputMoneyEl);
    imageCase.appendChild(imageForEdit);
    imageCase.appendChild(imageForComplete);
    imageCase.appendChild(imageForCancel);
    imageCase.appendChild(imageForDelete);
    rightContainerCase.appendChild(imageCase);
    element.appendChild(rightContainerCase);
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
  moneyInput = document.getElementById('moneyInput').value;
};

const convertDateToText = (element) => {
  const dateText = element.date.slice(0, 10).split('-').reverse().join('.');
  return dateText;
};

const convertToDate = (element) => {
  const dateText = element.date.slice(0, 10);
  return dateText;
};

const deleteElement = async (index) => {
  const answer = confirm('Вы уверены, что хотите удалить запись?');
  if (!answer) return;
  await fetch(`http://localhost:8000/deleteExistsExpens?id=${allExpenses[index]._id}`, {
    method: 'DELETE'
  });
  allExpenses.splice(index, 1);
  render();
};

const saveEditFromInput = async (index, inputShopEl, inputDateEl, inputMoneyEl) => {
  if (inputShopEl.value.trim() && inputDateEl.value && inputMoneyEl.value) {
    const resp = await fetch(`http://localhost:8000/editExpense`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        id: allExpenses[index]._id,
        company: inputShopEl.value.trim(),
        date: inputDateEl.value,
        money: inputMoneyEl.value
      })
    });

    allExpenses[index].company = inputShopEl.value.trim();
    allExpenses[index].money = Number(inputMoneyEl.value);
    allExpenses[index].date = inputDateEl.value;

    allExpenses[index].isEdit = !allExpenses[index].isEdit;
  } else {
    deleteElement(index);
  };
  render();
};

const editingElement = (index) => {
  allExpenses[index].isEdit = !allExpenses[index].isEdit;
  render();
};

const saveToSessionStorage = () => {
  sessionStorage.setItem('expenses', JSON.stringify(allExpenses));
};