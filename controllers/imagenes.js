fs = require('fs');
const axios = require('axios');
const { response } = require('express');
const {uploadToBucket} = require('../helpers/s3');
const consultarApi = async (req, res = response ) => {

    const { busqueda = "Auto", paginaactual = 1 } = req.query;
    
    if(busqueda === '' ) return;

    try {
        const imagenesPorPagina = 3;
        const key = '24887817-08e6c55c4f8c2f77c72e11f3d';
        const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`;
        const respuesta = await axios.get(url);

     res.json( respuesta.data.hits);
      
      } catch (error) {
        console.error(error);
      }
   
}

const actualizarImgAWSS3 = async (req, res = response ) => {

    const { nombre, largeImageURL } = req.body;
  axios({
        url: largeImageURL,
        method: 'GET',
        responseType: 'stream'
  })
        .then(async (response) => {
            try {
                const imageName = `./imagenes/${nombre}.jpg`
                const writer = await fs.createWriteStream(imageName);
                await response.data.pipe(writer);
                //writer.on('finish', () => console.log("Finished"));
                writer.on('error', () => console.error("Error while dowloading image"));

                const { Location } = await uploadToBucket(nombre,imageName);
                fs.unlinkSync( imageName )
               
                res.json(Location)
            } catch (err) {
                console.log(err)
            }    
        }) 
                               
}


  module.exports = {
    consultarApi,
    actualizarImgAWSS3  
}