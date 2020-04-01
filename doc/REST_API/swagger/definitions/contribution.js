/**
 * @swagger
 * definition:
 *  contribution_link:
 *    type: object
 *    description: an external contribution link
 *    properties:
 *      name:
 *        type: string
 *      url:
 *        type: string
 *  contribution_status:
 *    type: object
 *    description: contribution status
 *    properties:
 *      develop:
 *        type: string
 *      reversed:
 *        type: string
 *      published:
 *        type: string
 *      integrated:
 *        type: string
 *      rejected:
 *        type: string
 *  contribution_content:
 *    type: object
 *    description: contribution object
 *    properties:
 *      _id:
 *        type: number
 *      name:
 *        type: string
 *      software:
 *        type: string
 *      author:
 *        type: string
 *      version:
 *        type: string
 *      fixedInVersion:
 *        type: string
 *      status:
 *        $ref: "#/definitions/contribution_status"
 *      description:
 *        type: string
 *      deposedAt:
 *        type: string
 *      links:
 *        type: array
 *        items:
 *          $ref: "#/definitions/contribution_link"
 *      timestamps:
 *        type: object
 *        properties:
 *          creation:
 *            type: string
 */
