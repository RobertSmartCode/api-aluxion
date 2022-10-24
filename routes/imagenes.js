const { Router } = require('express');
const { consultarApi, actualizarImgAWSS3 } = require('../controllers/imagenes');


const { validarJWT} = require('../middlewares');

const router = Router();
router.post('/', [ 
    validarJWT
], consultarApi);


router.put('/',[
    validarJWT
],actualizarImgAWSS3);


module.exports = router;