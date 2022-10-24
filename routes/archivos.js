const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearArchivo,
        obtenerArchivos,
        obtenerArchivo,
        actualizarArchivo, 
        borrarArchivo } = require('../controllers/archivos');
const { existeArchivoPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/archivos
 */

//  Obtener todos los Archivos - publico
router.get('/', obtenerArchivos );

// Obtener un archivo por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeArchivoPorId ),
    validarCampos,
], obtenerArchivo );

// Crear archivo - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearArchivo);

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeArchivoPorId ),
    validarCampos
],actualizarArchivo);

// Borrar un archivo - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeArchivoPorId ),
    validarCampos,
],borrarArchivo);



module.exports = router;