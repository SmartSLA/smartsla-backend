/**
 * @swagger
 * definition:
 *  software_link:
 *    type: object
 *    description: software external link
 *    properties:
 *      name:
 *        type: string
 *      url:
 *        type: string
 *  software_content:
 *    type: object
 *    description: software object
 *    properties:
 *      _id:
 *        type: string
 *      name:
 *        type: string
 *      summary:
 *        type: string
 *      description:
 *        type: string
 *      licence:
 *        type: string
 *      technology:
 *        type: string
 *      group:
 *        type: string
 *      logo:
 *        type: string
 *      externalLinks:
 *        type: array
 *        items:
 *          $ref: "#/definitions/software_link"
 *      timestamps:
 *        type: object
 *        properties:
 *          creation:
 *            type: string
 */
