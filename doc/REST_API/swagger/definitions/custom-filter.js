/**
 * @swagger
 * definition:
 *  filter_item:
 *    type: object
 *    description: filter entry
 *    properties:
 *      category:
 *        type: string
 *      value:
 *        type: string
 *  filter_content:
 *    type: object
 *    description: filter object
 *    properties:
 *      _id:
 *        type: string
 *      user:
 *        type: string
 *      name:
 *        type: string
 *      items:
 *        type: array
 *        items:
 *          $ref: "#/definitions/filter_item"
 *      timestamps:
 *        type: object
 *        properties:
 *          creation:
 *            type: string
 */
