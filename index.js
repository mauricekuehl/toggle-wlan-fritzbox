const express = require("express");
const app = express();
const tr = require("tr-064");
const tr064 = new tr.TR064();

const logindata = require("./logindata.json");
const password = logindata.password;
const username = logindata.username;
console.log(username, password);

const PORT = 7000;
app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
app.use(express.static("static"));
app.use(express.json());

app.get("/api/status", (req, res) => {
  tr064.initTR064Device("fritz.box", 49000, function (err, device) {
    if (!err) {
      device.startEncryptedCommunication(function (err, sslDev) {
        if (!err) {
          sslDev.login(username, password);
          let wanip =
            sslDev.services["urn:dslforum-org:service:WLANConfiguration:1"];
          wanip.actions.GetInfo(function (err, result) {
            console.log(result.NewEnable);
            console.log(result);
            if (err === null) {
              res.json(result.NewEnable);
            } else {
              console.log(err);
              res.status(500).send();
            }
          });
        }
      });
    }
  });
});

app.get("/api/on", (req, res) => {
  tr064.initTR064Device("fritz.box", 49000, function (err, device) {
    if (!err) {
      device.startEncryptedCommunication(function (err, sslDev) {
        if (!err) {
          sslDev.login(username, password);
          let wanip =
            sslDev.services["urn:dslforum-org:service:WLANConfiguration:1"];
          wanip.actions.SetEnable({ NewEnable: true }, function (err, result) {
            console.log(result);

            if (err === null) {
              res.status(200).send();
            } else {
              console.log(err);
              res.status(500).send();
            }
          });
        }
      });
    }
  });
});

app.get("/api/off", (req, res) => {
  tr064.initTR064Device("fritz.box", 49000, function (err, device) {
    if (!err) {
      device.startEncryptedCommunication(function (err, sslDev) {
        if (!err) {
          sslDev.login(username, password);
          let wanip =
            sslDev.services["urn:dslforum-org:service:WLANConfiguration:1"];
          wanip.actions.SetEnable({ NewEnable: false }, function (err, result) {
            console.log(result);

            if (err === null) {
              res.status(200).send();
            } else {
              console.log(err);
              res.status(500).send();
            }
          });
        }
      });
    }
  });
});
