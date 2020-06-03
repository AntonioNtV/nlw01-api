import { Request, Response } from 'express'
import knex from '../database/connections'

class PointsController {
    async create(req: Request, res: Response) {

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            adressNumber,
            items
        } = req.body
    
        const trx = await knex.transaction()

        const point = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            adress_number: adressNumber,
            image: 'image-fake',
        }
    
        const insertedIds = await trx('points').insert(point)
        
        const point_id = insertedIds[0]

        const pointsItems = items.map( (item_id: number) => {
            return {
                item_id,
                point_id
            }
        })
        
    
        const validItemsId = (await trx('items').select('id')).map( itemObject=> {
            return itemObject.id
        })
            
        if (items.every((item: number) => validItemsId.includes(item))) {
            await trx('points_items').insert(pointsItems)
        }
    
        trx.commit()
    
        return res.json({ 
            point_id,
            ...point
         })

    }

    async index(req: Request, res: Response) {

        const points = await knex('points').select('*')

        return res.json(points)

    }
}

export default new PointsController