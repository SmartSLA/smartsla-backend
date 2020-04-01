/**
 * @swagger
 * definition:
 *  contract_schedule:
 *    description: contract schedule
 *    type: object
 *    properties:
 *      start:
 *        type: string
 *      end:
 *        type: string
 *  contract_software:
 *    type: object
 *    description: contract related software
 *    properties:
 *      software:
 *        type: string
 *      critical:
 *        type: string
 *      technicalReferent:
 *        type: string
 *      os:
 *        type: string
 *      version:
 *        type: string
 *      supportDate:
 *        $ref: "#/definitions/contract_schedule"
 *  contract_contact:
 *    type: object
 *    description: contacts related to contract
 *    properties:
 *      commerical:
 *        type: string
 *      technical:
 *        type: string
 *  contract_mailing_list:
 *    type: object
 *    description: mailing list related to contract
 *    properties:
 *      internal:
 *        type: array
 *        items:
 *          type: string
 *      external:
 *        type: array
 *        items:
 *          type: string
 *  contract_human_resources:
 *    type: object
 *    description: human resources related to contract
 *    properties:
 *      teams:
 *        type: array
 *        items:
 *          type: object
 *      beneficiaries:
 *        type: array
 *        items:
 *          type: object
 *  contract_hours:
 *    type: object
 *    description: business hours of contract
 *    properties:
 *      businessHours:
 *        type: string
 *      nonBusinessHours:
 *        type: string
 *  contract_engagement_detail:
 *    type: object
 *    description: details of contract engagement
 *    properties:
 *      bypassed:
 *        $ref: "#/definitions/contract_hours"
 *      resolved:
 *        $ref: "#/definitions/contract_hours"
 *      supported:
 *        $ref: "#/definitions/contract_hours"
 *      description:
 *        type: string
 *      idOssa:
 *        type: string
 *      severity:
 *        type: string
 *  contract_engagement_section:
 *    type: object
 *    description: contract engagement section
 *    properties:
 *      engagements:
 *        type: array
 *        items:
 *          $ref: "#/definitions/contract_engagement_detail"
 *  contract_engagements:
 *    type: object
 *    description: contract engagement
 *    properties:
 *      critical:
 *        $ref: "#/definitions/contract_engagement_section"
 *      sensible:
 *        $ref: "#/definitions/contract_engagement_section"
 *      standard:
 *        $ref: "#/definitions/contract_engagement_section"
 *  contract_link:
 *    type: object
 *    descripton: external links for contract
 *    properties:
 *      name:
 *        type: string
 *      url:
 *        type: string
 *  contract_content:
 *    type: object
 *    description: contract object
 *    properties:
 *      _id:
 *        type: string
 *      description:
 *        type: string
 *      name:
 *        type: string
 *      endDate:
 *        type: string
 *      Engagements:
 *        $ref: "#/definitions/contract_engagements"
 *      businessHours:
 *        $ref: "#/definitions/contract_hours"
 *      features:
 *        type: object
 *        description: contract options
 *        properties:
 *          nonBusinessHours:
 *            type: boolean
 *      contract:
 *        $ref: "#/definitions/contract_contact"
 *      client:
 *        type: string
 *      clientId:
 *        type: string
 *      credits:
 *        type: number
 *      govern:
 *        type: string
 *      humanResources:
 *        $ref: "#/definitions/contract_human_resources"
 *      mailingList:
 *        $ref: "#/definitions/contract_mailing_list"
 *      schedule:
 *        $ref: "#/definitions/contract_schedule"
 *      status:
 *        type: boolean
 *      startDate:
 *        type: string
 *      software:
 *        type: array
 *        items:
 *          $ref: "#/definitions/contract_software"
 *      timestamps:
 *        type: object
 *        properties:
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 *      timezone:
 *        type: string
 *      type:
 *        type: string
 *      externalLinks:
 *        $ref: "#/definitions/contract_link"
 */
