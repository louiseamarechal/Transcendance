------------------------ FRONT ------------------------

=> Lancer le front:

    cd front
    npm run dev

--------------------------------------------------------

------------------------- BACK -------------------------

=> Lancer le back:
    
    cd back
    npm run start:dev -> utilisation sans docker
    npm run db:dev:up -> utilisation avec docker

=> Lancer en mode test:
    npm run db:test:up

=> Redemarrer apres changement du schema de la db
    npm run db:dev/test:restart

=> Lancer les tests
    npm run test:e2e

--------------------------------------------------------