let btnLogin = document.getElementById("btn-meta-mask-login");

btnLogin.onclick = login;

/* TODO: Add Moralis init code */
const serverUrl = "https://jssa74qum3dp.usemoralis.com:2053/server";
const appId = "Jgtx83pRi6Cklall43XpAcYN4397BbPxXC6Y55WG";

/* Initialize moralis  */
Moralis.start({ serverUrl, appId });

async function login() {

    let user = Moralis.User.current();
    
    btnLogin.innerText = "Loading ...";

    if(!user) {
        user = await Moralis.authenticate({ signingMessage: "Login using metamask!" })
            .then(function( user ) {
                window.location.href = "home.html";
            })
            .catch(function(error) {
                alert(error);
            });
    }

    window.location.href = "home.html";
}

