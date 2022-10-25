const { Router } = require('express');
const { check } = require('express-validator');


const JWT_SECRET =process.env.JWT_SECRET

const { validarJWT, validarCampos} = require('../middlewares');

const { login,
        googleSignin, 
        forgotPassword,
        getResetPassword,
        postResetPassword} = require('../controllers/auth');


const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );


router.post("/forgot-password", forgotPassword);
  
router.get("/reset-password/:id/:token", getResetPassword);
  
router.post("/reset-password/:id/:token", postResetPassword );

module.exports = router;