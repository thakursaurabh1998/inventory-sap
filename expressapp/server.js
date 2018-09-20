const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const { Products, Orders } = require("./models/models");
const { Block, Blockchain } = require("./blockchain");

const writeJSON = chain => {
  fs.writeFileSync("chain.json", JSON.stringify(chain));
};

const parseJSON = () => {
  try {
    return JSON.parse(fs.readFileSync("chain.json"));
  } catch (error) {
    return [];
  }
};

let blockchain = new Blockchain();

if (blockchain.chain.length === 1) {
  const localFileSystem = parseJSON();
  localFileSystem.chain.splice(0, 1);
  localFileSystem.chain.forEach(e => {
    blockchain.addBlock(new Block(e.index, e.timestamp, e.data));
  });
}

let app = express();

app.use((req, res, next) => {
  const now = new Date().toString();

  console.log(`${now} ${req.method} ${req.url}`);
  next();
});

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/order/:id", (req, res) => {
  let id = req.params.id;
  Orders.findOne({_id: id})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

app.get("/products", (req, res) => {
  Products.find()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

app.post("/newitem", (req, res) => {
  const index = blockchain.chain[blockchain.chain.length - 1].index + 1;
  let { productId, productName } = req.body.data;
  let quantity = 1;
  let flag = 0;
  for (let p = blockchain.chain.length - 1; p >= 0; p--) {
    if (blockchain.chain[p].data.productId === productId) {
      quantity += blockchain.chain[p].data.quantity;
      console.log("PRODUCT" + productId);
      flag = 1;
      if (!productName) {
        productName = blockchain.chain[p].data.productName;
      }
      break;
    }
  }

  if (flag) {
    Products.findOneAndUpdate(
      { productId },
      {
        $inc: {
          quantity: 1
        }
      },
      {
        new: true
      }
    ).then(data => console.log(data.quantity));
  } else {
    const newproduct = new Products({
      productId,
      productName,
      quantity: 1
    });
    console.log(quantity+"QUANT");
    newproduct
      .save()
      .then(i => {
        console.log(i);
      })
      .catch(err => console.log(err));
  }

  data = {
    task: "added",
    productId,
    productName,
    quantity
  };

  const newBlock = new Block(index, new Date().getTime(), data);

  blockchain.addBlock(newBlock);

  writeJSON(blockchain);

  res.status(201).send(newBlock);
});

app.post("/removeitem", (req, res) => {
  const index = blockchain.chain[blockchain.chain.length - 1].index + 1;

  let { productId } = req.body.data;
  let productName;

  let quantity;

  for (let p = blockchain.chain.length - 1; p >= 0; p--) {
    if (blockchain.chain[p].data.productId === productId) {
      quantity = blockchain.chain[p].data.quantity - 1;
      productName = blockchain.chain[p].data.productName;
      break;
    }
  }

  let deliveredTo;

  Orders.findOne({ productId }).then(data => {
    deliveredTo = data._id;
  });

  data = {
    task: "removed",
    productId,
    productName,
    quantity,
    deliveredTo
  };

  const newBlock = new Block(index, new Date().getTime(), data);

  blockchain.addBlock(newBlock);

  writeJSON(blockchain);
  res.status(200).send(newBlock);
});

app.post("/delivered", (req, res) => {
  Orders.findOneAndUpdate(
    {_id: req.body.id},
    {
      $set: {
        delivered: true
      }
    },
    {
      new: true
    }
  )
    .then(i => res.status(200).send(i))
    .catch(err => res.status(400).send(err));
});

app.get("/order", (req, res) => {
  Orders.find()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

app.post("/order", (req, res) => {
  const {
    customerName,
    address,
    productId,
    email,
    contact,
    delivered
  } = req.body;

  const order = new Orders({
    customerName,
    address,
    productId,
    email,
    contact,
    delivered
  });

  Products.findOneAndUpdate(
    { productId },
    {
      $inc: {
        quantity: -1
      }
    },
    {
      new: true
    }
  )
    .then(data => {
      if (!data) res.status(404).send();
      else res.status(200).send(data);
      // console.log(data);
    })
    .catch(err => res.status(404).send(err));

  order
    .save()
    .then(doc => console.log(doc))
    .catch(err => console.log(err));
});

app.get("/chain", (req, res) => {
  // uncomment to check validity
  // blockchain.chain[2].data = { data: "hello" };
  res.status(200).send({
    chain: blockchain.chain.slice(1),
    length: blockchain.chain.length - 1
  });
});

app.get("/validity", (req, res) => {
  if (blockchain.isChainValid()) res.status(200).send("Blockchain is valid.");
  else res.status(400).send("Blockchain invalid!");
});

app.get("/mine", (req, res) => {
  blockchain.makeChainValid();
  writeJSON(blockchain);
  res.status(200).send("Chain is validated");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
