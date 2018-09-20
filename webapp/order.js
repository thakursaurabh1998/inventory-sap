const api = "https://express-blockchain.cfapps.eu10.hana.ondemand.com/";

const headers = {
  Accept: "application/json"
};

const get = () =>
  fetch(`${api}products`, {
    headers
  })
    .then(res => res.json())
    .catch(err => console.log(err));

const postDistribute = data =>
  fetch(`${api}distribute`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .catch(err => console.log(err));

let storage = window.localStorage;

function buyItem(id) {
	console.log(id);
  return new Promise((resolve, reject) => {
    localStorage.setItem("id", id);
    resolve();
  });
}

const helper = i => {
	console.log(i);
  buyItem(i).then(() => {
    window.open("buynow.html");
  });
};

get().then(results => {
  console.log(results);

  $(document).ready(function() {
    let s = "";
    results.forEach(item => {
      s += `<div class="col s12 m7">\
		    <div class="card horizontal" style="margin-left:15%; padding: 0px; width: 70%;">\
		      <div style="background-image: url('${
            item.imgURL
          }')" class="card-image image"></div>\
		      <div class="card-stacked">\
		        <div class="card-content" style="max-height: 100px">\
		          <p class='product-name'>${item.productName}</p>\
		          <div class="row">\
		          	<div class='col s6 'product-id'>ID: ${item.productId}</div>\
		          	<div class='col s6 product-quantity'>Quanity:${item.quantity}</div>\
		          </div>\
		        </div>\
		        <div class="card-action" style="max-height: 50px; padding-top: 10px">\
		        <div class="row">\
		          <div class="col s6 left-align"><a style="cursor: pointer" onClick="helper(${
                item.productId
              })">BUY NOW</a></div>`;
      if (item.quantity <= 5) {
        s += `<div class="col s6 right-align" style="color:red">${
          item.quantity
        } Stocks left!!</div>`;
      }

      s += `        </div><p class='status_${item.productID}'></p>\
		        </div>\
		      </div>\
		    </div>\
		  </div>`;
    });
    $(".box").html(s);
  });
});
