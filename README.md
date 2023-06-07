------------------------ FRONT ------------------------

=> Lancer le front:

    cd front
    npm run dev

--------------------------------------------------------

------------------------- BACK -------------------------

=> Lancer le back:
    
    cd back
    npm run db:dev:up
    npm run start

=> Lancer en mode test:
    npm run db:test:up
		npm run start:dev

=> Redemarrer apres changement du schema de la db
    npm run db:dev/test:restart

=> Lancer les tests
    npm run test:e2e

--------------------------------------------------------