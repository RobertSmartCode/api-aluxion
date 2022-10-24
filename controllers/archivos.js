const { response } = require('express');
const { Archivo } = require('../models');


const obtenerArchivos = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, archivos ] = await Promise.all([
        Archivo.countDocuments(query),
        Archivo.find(query)
            .populate('usuario', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        archivos
    });
}

const obtenerArchivo = async(req, res = response ) => {

    const { id } = req.params;
    const archivo = await Archivo.findById( id )
                            .populate('usuario', 'nombre');

    res.json( archivo );

}

const crearArchivo = async(req, res = response ) => {
    
    const nombre = req.body.nombre.toUpperCase();
   
    const archivoDB = await Archivo.findOne({ nombre });

    if ( archivoDB ) {
        return res.status(400).json({
            msg: `El archivo ${ archivoDB.nombre }, ya existe`
        });
    }
    
    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
    }

    const archivo = new Archivo ( data );

    // Guardar DB
    await archivo.save();

    res.status(201).json(archivo);

}

const actualizarArchivo = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const archivo = await Archivo.findByIdAndUpdate(id, data, { new: true });

    res.json( archivo );

}

const borrarArchivo = async(req, res =response ) => {

    const { id } = req.params;
    const archivoBorrado = await Archivo.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( archivoBorrado );
}




module.exports = {
    crearArchivo,
    obtenerArchivos,
    obtenerArchivo,
    actualizarArchivo,
    borrarArchivo
}