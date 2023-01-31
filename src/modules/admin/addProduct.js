import { postData, getData, deleteData } from "../api";

export const addProduct = () => {
  const titleInp = document.getElementById("product-title");
  const priceInp = document.getElementById("product-price");
  const nameInp = document.getElementById("product-name");
  const previewInp = document.getElementById("product-image");
  const saveBtn = document.getElementById("product-add-btn");
  const select = document.getElementById("product-category");
  const container = document.getElementById("product-table");

  const productData = {
    title: "",
    name: "",
    price: 0,
    preview: "",
    category: 0
  };

  const render = (data) => {
    container.innerHTML = "";

    data.forEach((item, index) => {
      container.insertAdjacentHTML( 'beforeend', `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${item.title}</td>
            <td>${item.name}</td>
            <td>${item.price} ₽</td>
            <td class="text-end">
                <button type="button" class="btn btn-outline-danger btn-sm" data-product="${item.id}">
                    удалить
                </button>
            </td>
        </tr>
    
        `);
    });
  };
  

  const checkValues = () => {
    if (
        nameInp.value === '' ||
        previewInp.value === '' ||
        titleInp.value === '' ||
        Number(priceInp.value) === 0 ||
        select.value === 'default'
    ) {
        saveBtn.disabled = true;
    } else {
        saveBtn.disabled = false;
    }
  };

  const updateTable = () => {
    getData("/products").then((data) => {
      render(data);
    });
  };

  select.addEventListener('change', () => {
    productData.category = select.value
    const url = select.value !== 'default' ? `/products?category=${select.value}` : `/products`
    console.log(url);

    getData(url).then((data) => {
        render(data);
      });
    
    checkValues()
  })

  nameInp.addEventListener("input", () => {
    productData.name = nameInp.value;
    checkValues();
  });

  titleInp.addEventListener("input", () => {
    productData.title = titleInp.value;
    checkValues();
  });

  priceInp.addEventListener("input", () => {
    productData.price = Number(priceInp.value)
    checkValues();
  });

  previewInp.addEventListener("input", () => {
    const file = previewInp.files[0];

    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    ) {
      const reader = new FileReader();

      reader.onload = () => {
        productData.preview = reader.result;
      };

      reader.onerror = () => {
        productData.preview = "";
        previewInp.value = "";
      };

      reader.readAsDataURL(file);
    } else {
      previewInp.value = "";
    }

    checkValues();
  });

  saveBtn.addEventListener("click", () => {
    console.log(productData);
    postData("/products", {
      method: "POST",
      body: JSON.stringify(productData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
        nameInp.value = ''
        titleInp.value = ''
        priceInp.value = ''
        previewInp.value = ''
        updateTable();
    });
  });



  container.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        const id = event.target.dataset.product 

        deleteData(`/products/${id}`).then((data) => {
            updateTable();
          });
    }
  });

//   Xiaomi Redmi A1+ 2/32GB (голубой)
//   Red Line Ultimate для Xiaomi Redmi 9C (оранжевый)
//   Amazfit GTS 4 mini (черный)

  updateTable()
  checkValues();
};
