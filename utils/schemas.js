 // const basejoi = require('joi');
const joi=require('joi')
const sanitizehtml=require('sanitize-html');
/*
  const extension=(joi) => ({
    type:'string',
    base: joi.string(),
    messages:{
      'string.escapeHTML': '{{#label}} must not include html'
    },
    rules: {
      escapeHTML: {
             validate(value,helpers){
              const clean=sanitizehtml(value,{
                allowedTags:[],
                allowedAttributes:{},
              });
              if(clean!==value){
                return helpers.error('string.escapeHTML',{value});

              }
              else{
                return clean;
              }
             }
            
      }
    }
  });
const  joi= basejoi.extend(extension);
*/
module.exports.campschema=joi.object({
        campgrounds:joi.object({ 
            title:joi.string().required(),
           description:joi.string().required(),
           price:joi.number().min(0).required(),
        // image:joi.string().required(),
           location:joi.string().required(),
            
        }).required(),
        deleteimages:joi.array(),

      
      
    });

    module.exports.reviewschema=joi.object({
            review:joi.object({
                rating:joi.number().min(1),
                body:joi.string().required()
            }).required()
       })
      