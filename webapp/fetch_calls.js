const api = "https://express-blockchain.cfapps.eu10.hana.ondemand.com/";

const headers = {
  Accept: "application/json"
};

export const get = () => 
	fetch(`${api}products`, {
		method: "GET",
		headers: {
			...headers,
			"Content-Type": "application/json"
		}
	})
	.then(res => res.json())
	.catch(err => console.log(err))


export const postDistribute = data =>
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