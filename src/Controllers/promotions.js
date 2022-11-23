import { PromotionsHome } from "../Models/Promotions_Schemas";

const promotionsFunctions = {};

//
promotionsFunctions.createPromotion = async (req, res) => {
  try {
    const {
      type,
      info_type,
      since,
      until,
      gender,
      age_min,
      age_max,
      place,
      images,
      categories,
      status,
      tagetID,
      title,
      relation,
      description,
      rif,
      social,
      address,
    } = req.body;

    const data = new PromotionsHome({
      type: type,
      info_type: info_type,
      since: since,
      until: until,
      gender: gender,
      age_min: age_min,
      age_max: age_max,
      place: place,
      images: images,
      categories: categories,
      status: status,
      tagetID: tagetID,
      title: title,
      relation: relation,
      description: description,
      rif: rif,
      social: social,
      address: address,
    });
    await data.save();
    res.json({ msg: "Experiencia laboral registrada con exito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

export default promotionsFunctions;

//
// PromotionsFunctions.name = async (req, res) => {
//   try {
//
//
// res.send('Hello Word')
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       msg: 'Error inesperado'
//     })
//   }
// }
