
async function initialize_server(server_url) {
    wax = new waxjs.WaxJS({
        rpcEndpoint: server_url
    });
}

if (mode_test == "client") {
    client = true;
} else if (mode_test == "web") {
    client = false;
}
const autoLogin = false;

async function login() {
    try {
        var userAccount = await wax.login();
        try {
            const userAccount = await wax.login();
            //document.getElementById('updaterdsadsadsa').value = userAccount;
        } catch (e) {
            document.getElementById('response').append(e.message);
        }
        try {
            const result = await wax.api.transact({
                actions: [{
                    account: 'warspacetest',
                    name: 'login',
                    data: {
                        username: wax.userAccount,
                        memo: "login"
                    },
                    authorization: [{
                        actor: wax.userAccount,
                        permission: 'active',
                    }],
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 15
            });
            //document.getElementById('response').append(JSON.stringify(result));
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (e) {
            console.log(e.message);
            //$("#response").text("РўРѕРєРµРЅС‹ СѓСЃРїРµС€РЅРѕ РѕС‚РїСЂР°РІР»РµРЅС‹ Рє " + transferto);
        }
        return userAccount;
    } catch (e) {
        console.log("Error (login): " + e);
        return false;
    }
}

if (autoLogin == true) {
    const userAuth = login();
}

async function loginButton() {
    if (autoLogin == false) {
        userAuth = await login();
        if (client) {
            GameInstance.SendMessage('JSManager', 'LoginResponse', userAuth.toString());
        } else {
            return userAuth;
        }
    } else {
        console.log("Auto Login = True");
        return false;
    }
}

async function getUser(username = "") {
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(userAuth);
    if (username == "") {
        if (!wax.api) {
            console.log("* Login first *   (getUser)");
            return false;
        }
        var updater = userAuth;
    } else {

        var updater = username;
    }

    //const fail = document.getElementById('fail').checked;
    try {
        const result = await wax.rpc.get_table_rows({
            json: true,               // Get the response as json
            code: 'warspacetest',      // Contract that we target
            scope: 'warspacetest',         // Account that owns the data
            table: 'accounts',        // Table name
            limit: 10,                // Maximum number of rows that we want to get
            reverse: false,           // Optional: Get reversed data
            show_payer: false          // Optional: Show ram payer
        });
        var res = "json";
        result.rows.forEach((element) => {
            if (element.username == updater) {
                //$("#food").text(JSON.stringify(element.balance));
                res = element;
            }
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (client) {
            GameInstance.SendMessage('JSManager', 'GetUserResponse', JSON.stringify(res));
        } else {
            return res;
        }
    } catch (e) {
        console.log("Error (getUser): " + e);
        return false;
    }
}

async function setNft(slot_nft, nftid) {
    if (!wax.api) {
        console.log("* Login first *   (setNft)");
        return false;
    }
    $('#exampleModal').modal("hide");
    var nfts;
    const updater = wax.userAccount;
    getUser().then(data => {
        nfts = data.items;


        nfts[parseInt(slot_nft)] = nftid;

        try {
            const result = wax.api.transact({
                actions: [{
                    account: 'warspacetest',
                    name: 'setnft',
                    data: {
                        username: updater,
                        item_code: nfts,
                    },
                    authorization: [{
                        actor: updater,
                        permission: 'active',
                    }],
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30
            });
            if (client) {
                GameInstance.SendMessage('JSManager', 'SetNftResponse', JSON.stringify(result));
            } else {
                return result;
            }

        } catch (e) {
            console.log("Error (setNft): " + e);
        }
    });
    /*	await new Promise(resolve => setTimeout(resolve, 4000));
        location.reload();*/
}
async function delNft(slot_nft) {
    if (!wax.api) {
        console.log("* Login first *   (setNft)");
        return false;
    }
    var nfts;
    const updater = wax.userAccount;
    getUser().then(data => {
        nfts = data.items;


        nfts[parseInt(slot_nft)] = 0;

        try {
            const result = wax.api.transact({
                actions: [{
                    account: 'warspacetest',
                    name: 'setnft',
                    data: {
                        username: updater,
                        item_code: nfts,
                    },
                    authorization: [{
                        actor: updater,
                        permission: 'active',
                    }],
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30
            });
            alert("Success!");
            if (client) {
                GameInstance.SendMessage('JSManager', 'DelNftResponse', JSON.stringify(result));
            } else {
                return result;
            }
            return result;
            /*      new Promise(resolve => setTimeout(resolve, 2000));
                  location.reload();*/
        } catch (e) {
            console.log("Error (setNft): " + e);
        }
    });
    /*	await new Promise(resolve => setTimeout(resolve, 4000));
        location.reload();*/
}
async function mining(resource, slot) {
    if (!wax.api) {
        console.log("* Login first *   (mining)");
        return false;
    }

    const updater = wax.userAccount;

    var rand_int = Math.floor(Math.random() * (99999999 - 0) + 0);

    try {
        const result = await wax.api.transact({
            actions: [{
                account: 'warspacetest',
                name: 'mine',
                data: {
                    username: updater,
                    resource: resource,
                    nonce_code: rand_int,
                    id_item: slot,
                },
                authorization: [{
                    actor: updater,
                    permission: 'active',
                }],
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (client) {
            GameInstance.SendMessage('JSManager', 'MiningResponse', JSON.stringify(result));
        } else {
            return result;
        }
    } catch (e) {
        console.log("Error (Mining): " + e);
    }
}
async function claim(resource, slot) {
    if (!wax.api) {
        console.log("* Login first *   (mining)");
        return false;
    }

    const updater = wax.userAccount;

    var rand_int = Math.floor(Math.random() * (99999999 - 0) + 0);

    try {
        const result = await wax.api.transact({
            actions: [{
                account: 'warspacetest',
                name: 'claim',
                data: {
                    username: updater,
                    slot_id: slot,
                    resource: resource,
                },
                authorization: [{
                    actor: updater,
                    permission: 'active',
                }],
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        login_user(true);
        if (client) {
            GameInstance.SendMessage('JSManager', 'ClaimResponse', JSON.stringify(result));
        } else {
            return result;
        }
    } catch (e) {
        console.log("Error (Claim): " + e);
    }
}
async function get_image(nft_id) {
    var data_ret = "";
    $.ajax({
        url: 'https://wax.api.atomicassets.io/atomicassets/v1/assets/' + nft_id + '/',
        success: function (data) {
            data_ret = "https://ipfs.io/ipfs/" + data.data.data.img + "/";
        }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (nft_id == 0) {
        data_ret = "/empty.png";
    }
    if (client) {
        GameInstance.SendMessage('JSManager', 'Get_imageResponse', JSON.stringify(data_ret));
    } else {
        return data_ret;
    }
}
async function get_inventory(username) {
    var data_ret = "";
    $.ajax({
        url: 'https://wax.api.atomicassets.io/atomicassets/v1/assets?collection_name=warspacette1&owner=' + username + '&page=1&limit=100&order=desc&sort=asset_id',
        success: function (data) {
            data_ret = data;
        }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (client) {
        GameInstance.SendMessage('JSManager', 'Get_inventoryResponse', JSON.stringify(data_ret));
    } else {
        return data_ret;
    }
}
async function add_token_account() {
    var result = await wax.api.transact({
        actions: [{
            account: 'wallet.wax',
            name: 'tokenset',
            data: {
                from: wax.userAccount,
                contract: "farmmineliri",
                token: "4,WSGT",
                displayname: "War Space Gold",
                image: "QmVcnjgjppCAkyj3FvJedbTHchDQGpyxenjk6bwRy1pHAu",
            },
            authorization: [{
                actor: wax.userAccount,
                permission: 'active',
            }],
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 15
    });
    var result = await wax.api.transact({
        actions: [{
            account: 'wallet.wax',
            name: 'tokenset',
            data: {
                from: wax.userAccount,
                contract: "farmmineliri",
                token: "4,WSFT",
                displayname: "War Space Food",
                image: "QmVcnjgjppCAkyj3FvJedbTHchDQGpyxenjk6bwRy1pHAu",
            },
            authorization: [{
                actor: wax.userAccount,
                permission: 'active',
            }],
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 15
    });
    var result = await wax.api.transact({
        actions: [{
            account: 'wallet.wax',
            name: 'tokenset',
            data: {
                from: wax.userAccount,
                contract: "farmmineliri",
                token: "4,WSST",
                displayname: "War Space Stone",
                image: "QmVcnjgjppCAkyj3FvJedbTHchDQGpyxenjk6bwRy1pHAu",
            },
            authorization: [{
                actor: wax.userAccount,
                permission: 'active',
            }],
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 15
    });
    var result = await wax.api.transact({
        actions: [{
            account: 'wallet.wax',
            name: 'tokenset',
            data: {
                from: wax.userAccount,
                contract: "farmmineliri",
                token: "4,WSWT",
                displayname: "War Space Wood",
                image: "QmVcnjgjppCAkyj3FvJedbTHchDQGpyxenjk6bwRy1pHAu",
            },
            authorization: [{
                actor: wax.userAccount,
                permission: 'active',
            }],
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 15
    });
}
async function getBalance(updater) {
    if (!wax.api) {
        console.log("* Login first *   (getBalance)");
        return false;
    }
    //const fail = document.getElementById('fail').checked;

    const result = await wax.rpc.get_table_rows({
        json: true,               // Get the response as json
        code: 'eosio.token',      // Contract that we target
        scope: updater,         // Account that owns the data
        table: 'accounts',        // Table name
        limit: 10,                // Maximum number of rows that we want to get
        reverse: false,           // Optional: Get reversed data
        show_payer: false          // Optional: Show ram payer
    });
    var res = "json";
    var balance_wax = "";
    result.rows.forEach((element) => {
        //$("#food").text(JSON.stringify(element.balance));
        balance_wax = element.balance.slice(0, -3);
    });
    if (balance_wax == "") {
        balance_wax = 0;
    }
    $.ajax({
        url: "https://api.coingecko.com/api/v3/simple/price?ids=wax&vs_currencies=usd",
        dataType: 'json',
        success: function (data) {
            blnc_result = parseFloat(balance_wax) * parseFloat(data.wax.usd);
            if (client) {
                GameInstance.SendMessage('JSManager', 'GetBalanceResponse', JSON.stringify({ "usd": blnc_result, "wax": parseFloat(balance_wax) }));
                console.log({ "usd": blnc_result.toFixed(4), "wax": parseFloat(balance_wax).toFixed(4) });
            } else {
                console.log({ "usd": blnc_result.toFixed(4), "wax": parseFloat(balance_wax).toFixed(4) });
                return { "usd": blnc_result.toFixed(4), "wax": parseFloat(balance_wax).toFixed(4) };

            }
        }
    });
}
