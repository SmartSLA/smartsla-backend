/**
 * @swagger
 * definition:
 *  ticket_event:
 *    description: a ticket event
 *    type: object
 *    properties:
 *      id:
 *        type: string
 *      name:
 *        type: string
 *      type:
 *        type: string
 *  id_name_email_type:
 *    description: Object containing name, id, type and email of user
 *    type: object
 *    properties:
 *      id:
 *        type: number
 *      name:
 *        type: string
 *      email:
 *        type: string
 *      type:
 *        type: string
 *  ticket_content:
 *    description: Ticket object
 *    type: object
 *    properties:
 *      _id:
 *        type: number
 *      assignedTo:
 *        $ref: "#/definitions/id_name_email_type"
 *      author:
 *        $ref: "#/definitions/id_name_email_type"
 *      beneficiary:
 *        $ref: "#/definitions/id_name_email_type"
 *      callNumber:
 *        type: string
 *      contract:
 *        type: string
 *      createdDuringBusinessHours:
 *        type: boolean
 *      description:
 *        type: string
 *      events:
 *        type: array
 *        items:
 *          $ref: "#/definitions/ticket_event"
 *      idOssa:
 *        type: string
 *      meetingId:
 *        type: string
 *      participants:
 *        type: array
 *        items:
 *          type: string
 *      relatedRequests:
 *        type: array
 *        items:
 *          type: object
 *      relatedContributions:
 *        type: array
 *        items:
 *          $ref: "#/definitions/contribution_content"
 *      responsible:
 *        $ref: "#/definitions/id_name_email_type"
 *      severity:
 *        type: string
 *      software:
 *        $ref: "#/definitions/contract_software"
 *      status:
 *        type: string
 *      team:
 *        type: object
 *      timestamps:
 *        type: object
 *        properties:
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 *      title:
 *        type: string
 *      type:
 *        type: string
 */
