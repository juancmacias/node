const express = require("express");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config({path:'process.env'});
//console.log(process.env.USUARIO+'/'+process.env.KEY+'/'+process.env.HOST+'/'+process.env.PORT);
// llamamos a expres
const app = express();

// cargamos la página donde quereemos enviar la info
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

//	ponemos el puerto donde escucha
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log('Escuchando en el puerto:' ${PORT});
});

const transporter = nodemailer.createTransport({
  host: process.env.HOST, // gestor de correo
  port: 465,
  auth: {
    user: process.env.USUARIO,
    pass: process.env.KEY
  },
  tls: {
      rejectUnauthorized: false
  }
});
// verificación de la información
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("El servidor esta listo para enviar correos");
  }
});

app.post("/send", (req, res) => {
  //1. recibimos los datos
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });

    //2. configuramos el correo
    const mail = {
      from: process.env.USUARIO,
      to: data.email,
      subject: data.subject,
      text: data.name+''+data.email+' \n'+data.message,
    };

    //3.enviamos el correo
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Algo ha salido mal...");
      } else {
      	console.log(process.cwd())
        //res.status(200).send("El correo se envio correctamente");
        res.sendFile(process.cwd() + "/public/index.html");
      }
    });
  });
});