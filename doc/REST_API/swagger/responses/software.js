/**
 * @swagger
 * response:
 *  software:
 *    description: Ok with the software object
 *    schema:
 *      $ref: "#/definitions/software_content"
 *    examples:
 *      applications/json:
 *        {
 *        "timestamps": {
 *          "creation": "2020-03-26T09:36:41.373Z"
 *        },
 *        "_id": "5e7c77a93687003605f593fa",
 *        "name": "Moodle OpenHackademy",
 *        "summary": "Application Moodle et paramétrages/plugins spécifiques pour le site OpenHackademy du ministère du bien être",
 *        "description": "Application d'apprentissage en ligne basée sur Moodle",
 *        "licence": "GNU General Public License (GPL)",
 *        "technology": "PHP",
 *        "externalLinks": [],
 *        "group": " Serveurs d'applications"
 *        }
 *  software_list:
 *    description:
 *    schema:
 *      type: array
 *      items:
 *        $ref: "#/definitions/software_content"
 *    examples:
 *      application/json:
 *        [
 *        {
 *          "timestamps": {
 *            "creation": "2020-03-26T09:36:41.373Z"
 *          },
 *          "_id": "5e7c77a93687003605f593fa",
 *          "name": "Moodle OpenHackademy",
 *          "summary": "Application Moodle et paramétrages/plugins spécifiques pour le site OpenHackademy du ministère du bien être",
 *          "description": "Application d'apprentissage en ligne basée sur Moodle",
 *          "licence": "GNU General Public License (GPL)",
 *          "technology": "PHP",
 *          "externalLinks": [],
 *          "group": " Serveurs d'applications"
 *        },
 *        {
 *          "timestamps": {
 *            "creation": "2020-03-26T09:34:43.253Z"
 *          },
 *          "_id": "5e7c77333687003605f593f8",
 *          "name": "Drupal",
 *          "description": "Drupal est un système de gestion de contenu libre et open-source publié sous la licence publique générale GNU et écrit en PHP.",
 *          "licence": "GNU General Public License (GPL)",
 *          "technology": "PHP",
 *          "group": "Outils et langages",
 *          "externalLinks": [
 *            {
 *              "name": "lien de la communauté",
 *              "url": "https://www.drupal.org"
 *            }
 *          ],
 *          "summary": "CMS leader"
 *        }
 *        ]
 */
