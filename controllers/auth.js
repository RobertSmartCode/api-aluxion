const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const JWT_SECRET =process.env.JWT_SECRET

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}


const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }

}

const  forgotPassword= async (req, res) => {
    const { correo } = req.body;
    try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if ( !usuario ) {
        return res.status(400).json({
         msg: 'Usuario no existe'
        });
    }

      
      const secret = JWT_SECRET + usuario.password;
      const token = jwt.sign({ email: usuario.email, id: usuario._id}, secret, {
        expiresIn: "20m",
      });
      
      const link = `http://localhost:8090/reset-password/${usuario._id}/${token}`;
      

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "robertsmartcode@gmail.com",
          pass: "jshgxqdoyrylnghl",
        },
      });
  
      let mailOptions = {
        from: "robertsmartcode@gmail.com",
        to: `${correo}`,
        subject: "Password Reset",
        text: link,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
     
    } catch (error) {}
    res.json(correo)
  }



 const getResetPassword= async (req, res) => {
    const { id, token } = req.params;
    
    const usuario = await Usuario.findOne({ _id: id });
    if (!usuario) {
      return res.json({ status: "User Not Exists!!" });
    }

    const secret = JWT_SECRET + usuario.password;
    try {
      const verify = jwt.verify(token, secret);
      res.json({ email: verify.email, status: "Verified" });
    } catch (error) {
      console.log(error);
      res.send("Not Verified");
    }
  }


  const postResetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    const usuario = await Usuario.findOne({ _id: id });
    if (!usuario) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + usuario.password;
    try {
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcryptjs.hash(password, 10);
      await Usuario.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
      
  
      res.json({ email: verify.email, status: "verified" });
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
  }
module.exports = {
    login,
    googleSignin,
    forgotPassword,
    getResetPassword,
    postResetPassword 

}
