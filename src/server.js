import express from "express";
import cors from "cors"
import createTables from "./utils/create-tables.js";
import productsRoute from "./services/products/routes.js"
import reviewsRoute from "./services/reviews/routes.js"

const server = express()


const { PORT = 5000 } = process.env;

server.use(cors())

server.use(express.json())

server.use("/products", productsRoute)

server.use("/reviews", reviewsRoute)

server.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`)
    await createTables()
})

server.on('error', (error) => {
    console.log('Server is stoppped ', error)
})