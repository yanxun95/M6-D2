
import { Router } from "express"
import pool from "../../utils/db.js"
const route = Router()

route.get("/", async (req, res, next) => {
    try {
        const query =
            `SELECT 
        review.review_id,
        review.comment AS comment,
        review.rate,
        review.product_id,
        product.product_id,
        product.name AS product_name,
        product.description,
        product.brand,
        product.image_url,
        product.price,
        product.category
    FROM reviews as review
    INNER JOIN products AS product ON review.product_id = product.product_id
    `
        const result = await pool.query(query)
        res.send(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.get("/:id", async (req, res, next) => {
    try {
        const query = `SELECT 
        review.review_id,
        review.comment AS comment,
        review.rate,
        review.product_id,
        product.product_id,
        product.name AS product_name,
        product.description,
        product.brand,
        product.image_url,
        product.price,
        product.category
    FROM reviews as review
    INNER JOIN products AS product ON review.product_id = product.product_id
    WHERE review_id=${req.params.id};`
        const result = await pool.query(query)
        if (result.rows.length > 0) {
            res.send(result.rows[0])
        }
        else {
            res.status(404).send({ message: `Review with ${req.params.id} is not found.` })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.delete("/:id", async (req, res, next) => {
    try {
        const query = `DELETE FROM reviews WHERE review_id=${req.params.id};`
        await pool.query(query)
        res.status(204).send()
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


route.put("/:id", async (req, res, next) => {
    try {
        const { comment, rate } = req.body;
        const query = `
            UPDATE reviews 
            SET 
                comment=${"'" + comment + "'"},
                rate=${"'" + rate + "'"}
            WHERE review_id=${req.params.id}
            RETURNING*;`
        const result = await pool.query(query)
        res.send(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.post("/", async (req, res, next) => {
    try {
        const { comment, rate, product_id } = req.body;
        const query = `
        INSERT INTO reviews
        (
            comment,
            rate,
            product_id
        )
        VALUES 
        (
            ${"'" + comment + "'"},
            ${"'" + rate + "'"},
            ${"'" + product_id + "'"}
        ) RETURNING *;
        `
        const result = await pool.query(query)
        res.status(201).send(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

export default route;