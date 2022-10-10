import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point, polygon } from '@turf/helpers'
import vnzlData from './venezuela2.json'

export default async (lonLat) => {
  let names={state:'',city:'',country:''}

    let pt = point(lonLat);

    const matchLonLat = async (feature) => {
        new Promise(async (res, rej) => {
            var poly = polygon(feature.geometry.coordinates[0])
            let result = booleanPointInPolygon(pt, poly)
            if (result) {
                names.country = feature.properties.COUNTRY
                names.state = feature.properties.NAME_1
                names.city = feature.properties.NAME_2
            }

        }).then(res => {
            console.log(res)
            return res
        })
    }

    await Promise.all(vnzlData.features.map(feature => matchLonLat(feature)))

    return names


}