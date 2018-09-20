const api = "https://express-blockchain.cfapps.eu10.hana.ondemand.com/";

const headers = {
  Accept: "application/json"
};

const get = () => 
	fetch(`${api}products`, {
		headers,
	})
	.then(res => res.json())
	.catch(err => console.log(err))


const update = data =>
  fetch(`${api}order`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
.then(res => res.json())
.catch(err => console.log(err));

function formSubmission() {
	console.log("ghjk");
	const first_name = $('#first_name').val();
	const last_name =  $('#last_name').val();
	const email =  $('#email').val();
	const contact = $('#contact').val();
	const address = $('#address').val()+','+$('#city').val()+','+ $('#state').val()+','+$('#pincode').val();
	const customerName = first_name + ' ' + last_name;
	const productId = parseInt(localStorage.getItem('id'));
	const obj = {
		customerName,
		address,
		productId,
		email,
		contact,
	}
	update(obj).then((res) => console.log(res));
}

get().then((results) => {	
	$(document).ready(function() {
		const id = parseInt(localStorage.getItem('id'));
		const obj = results.filter((res)=>res.productId===id)[0];
		
		let s = ''; 
		s += `
	     	<div class="card card-style">\
		    	<div style="background-image: url('${obj.imgURL}')" class="card-image image">\
		    	</div>\
		    	<hr style="color: black">
		        <div class="card-content">\
		          <p class="title">${obj.productName}</p>
		          <p class="id">Product Id: ${obj.productId}</p>\
		        </div>\
		        <div class="row">`

		    if(obj.quantity<=5) {
		    	s += `<div class="col s6 right-align" style="color:red; font-size: 3vh">${obj.quantity} Stocks left!!</div>`
		    }

		  	s += `
		      </div>\
		    </div>`
		$(".item").html(s);
	});
});