import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DatabaseService } from './database/database.service';

const buyer = {
  first_name: 'John',
  last_name: 'Doe',
  username: 'john',
  password: 'P@sSw0rD',
  role: 'buyer',
};

const seller = {
  first_name: 'Peter',
  last_name: 'Doe',
  username: 'peter',
  password: 'P@sSw0rD',
  role: 'seller',
};

describe('App', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let server: any;
  let buyerLoginReq = null;
  let sellerLoginReq = null;

  async function loginBuyer() {
    if (buyerLoginReq) return buyerLoginReq;
    buyerLoginReq = request(server)
      .post('/auth/login')
      .send({ username: buyer.username, password: buyer.password })
      .expect(200)
      .then((response) => response.body.access_token);
    return buyerLoginReq;
  }

  async function loginSeller() {
    if (sellerLoginReq) return sellerLoginReq;

    sellerLoginReq = request(server)
      .post('/auth/login')
      .send({ username: seller.username, password: seller.password })
      .expect(200)
      .then((response) => response.body.access_token);

    return sellerLoginReq;
  }

  async function storeProduct(product: any) {
    const token = await loginSeller();

    const response = await request(server)
      .post('/products')
      .send(product)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    return response.body;
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    server = app.getHttpServer();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbConnection();
  });

  // EXTRA  TEST
  it('/POST /users', async () => {
    // Creating a new user should work as expected
    await Promise.all([
      request(server).post('/users').send(buyer).expect(201),
      request(server).post('/users').send(seller).expect(201),
    ]);

    // Attempting to create a new buyer with the same buyer name should fail
    await Promise.all([
      request(server).post('/users').send(buyer).expect(400),
      request(server).post('/users').send(seller).expect(400),
    ]);
  });

  // REQUESTED TEST 1
  it('/POST deposit', async () => {
    const depositA = [
      {
        coin: 10,
        quantity: 2,
      },
    ];

    const depositB = [
      {
        coin: 10,
        quantity: 10,
      },
      {
        coin: 5,
        quantity: 12,
      },
    ];

    const token = await loginBuyer();
    await request(server)
      .post('/deposit')
      .send({
        coins: depositA,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(depositA);

    await request(server)
      .post('/deposit')
      .send({
        coins: depositB,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect([
        {
          coin: 5,
          quantity: 12,
        },
        {
          coin: 10,
          quantity: 12,
        },
      ]);
  });

  // REQUESTED TEST 2
  it('/POST buy', async () => {
    const savedProduct = await storeProduct({
      name: 'Product',
      cost: 10,
      amount_available: 10,
    });
    const savedProduct2 = await storeProduct({
      name: 'Product 2',
      cost: 10000000,
      amount_available: 10,
    });

    const token = await loginBuyer();

    // Attempting to purchase more than available quantity should fail
    await request(server)
      .post('/buy')
      .send({
        products: [
          {
            product_id: savedProduct2._id,
            quantity: 10000,
          },
        ],
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    // Attempting to spend more than balance should fail
    await request(server)
      .post('/buy')
      .send({
        products: [
          {
            product_id: savedProduct2._id,
            quantity: 1,
          },
        ],
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(403);

    // Attempting to purchase available amount should succeed
    await request(server)
      .post('/buy')
      .send({
        products: [
          {
            product_id: savedProduct._id,
            quantity: 1,
          },
        ],
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('products').deleteMany({});
    await app.close();
  });
});
