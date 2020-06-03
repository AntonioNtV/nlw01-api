import express from 'express'
import cors from 'cors'
import routes from './routes'
import knex from 'knex'
import path from 'path'

class App {
    public express: express.Application

    public constructor () {
        this.express = express()

        this.middlewares()
        this.database()
        this.routes()
    }

    private middlewares() {
        this.express.use(cors())
        this.express.use(express.json())
    }

    private database() {
        const connection = knex({
            client: 'sqlite',
            connection: {
                filename: path.resolve(__dirname, '..', 'database', 'database.sqlite')
            },
            useNullAsDefault: true
        })
    }

    private routes() {
        this.express.use(routes)
    }

    
}

export default new App().express