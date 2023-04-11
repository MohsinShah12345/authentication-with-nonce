// import packages
const express = require('express');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');
// creating express instance;
const app = express();
// Port for our server || application
const port = 7000;
// creatin web3 instance
const web3 = new Web3("https://cloudflare-eth.com/")
const jwtSecret = "mwl45uelkbtuivetbvtgrtytgrb8oy58g45g8[4y50hn58gy54g";
// code below will configure axpress application to server static file present in public folder
app.use(express.static('public'))
// safe route
app.get('/nonce', nonceController);
// here verify our temptoken generated with nonce and return new bearer token
app.post('/verify', async (req, res) => {
    const { signature } = req.query;
    const authHeader = await req.headers['authorization'];
    const tempToken = authHeader && authHeader.split(" ")[1];
    if (tempToken == null) return res.sendStatus(403); // token is undefined
    // previously created Temporary token
    const userData = await jwt.verify(tempToken, jwtSecret);
    const { nonce = "", address = "" } = userData; // decoding token and address
    // crearting sign message
    const message = await signMessage(nonce, address);
    // getting address of user wallet using message and signature
    const verifyAddress = await web3.eth.accounts.recover(message, signature);
    console.log("Veriied Address", verifyAddress)
    if (verifyAddress.toLowerCase() == address.toLowerCase()) {
        const token = await jwt.sign({ verifyAddress }, jwtSecret, { expiresIn: "1d" });
        return res.json({ token });
    } else {
        return res.sendStatus(403)
    }

});
app.get("/secret", authenticateToken, async (req, res) => {
    res.send(`Welcome address ${req.authData.verifyAddress}`)
})

async function authenticateToken(req, res, next) {
    const authHeader = await req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401); // token is undefined
    jwt.verify(token, jwtSecret, (err, authData) => {
        console.log("err in verifing auth token", err);
        if (err) {
            return res.sendStatus(403)
        }
        req.authData = authData;
        next();
    })

}
async function nonceController(req, res) {
    // creating nonce using current Time
    const nonce = new Date().getTime();
    const { address } = req.query; // destructing user wallet address from query , sent from frontend || index.html file
    // creating a temporary token using nonce and and user wallet address
    // token will expires in 60 second for security purpose , but expiry time would be your choice
    const tempToken = jwt.sign({ nonce, address }, jwtSecret, { expiresIn: '60s' });
    // now creating a user sign Message 
    const message = await signMessage(nonce, address);
    // return res.send("Server is Running");
    res.json({
        tempToken,
        message
    })
}
async function signMessage(nonce, userAddress) {
    return `Please sign this message from address ${userAddress}:\n\n${nonce} `
}
// app will listen on Port
app.listen(port, () => {
    console.log(`App is listening on Port: ${port}`)
});