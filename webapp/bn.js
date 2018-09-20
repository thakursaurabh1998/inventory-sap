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
		const id = localStorage.getItem('id');
		let s = ''; 
		s += `
	     	<div class="card card-style">\
		    	<div style="background-image: url('${results[id].imgURL}')" class="card-image image">\
		    	</div>\
		    	<hr style="color: black">
		        <div class="card-content">\
		          <p class="title">${results[id].productName}</p>
		          <p class="id">Product Id: ${results[id].productId}</p>\
		        </div>\
		        <div class="row">`

		    if(results[id].quantity<=5) {
		    	s += `<div class="col s6 right-align" style="color:red; font-size: 3vh">${results[id].quantity} Stocks left!!</div>`
		    }

		  	s += `
		      </div>\
		    </div>`
		$(".item").html(s);
	});
});