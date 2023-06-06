import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('Test backend transcendance.', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
		await app.init();
		await app.listen(3333);
		prisma = app.get(PrismaService);
		await prisma.cleanDb();

		pactum.request.setBaseUrl('http://localhost:3333');
  });

	afterAll(async () => {
		app.close();
	})

	describe('Auth', () => {
		it.todo('Signup');
	})
});
