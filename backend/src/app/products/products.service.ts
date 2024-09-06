import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import {
  CreateProductDto,
  GetProductQueryDto,
  PurchaseProductsDto,
  UpdateProductDto,
} from './dto';
import {
  createRecordFromSet,
  getPaginationData,
  ResponseWrapper,
} from '../../utils';
import { ErrorMessages } from '../../constants';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private userService: UsersService
  ) {}

  async createProduct(ownerId: string, productDto: CreateProductDto) {
    const productData = {
      ...productDto,
      seller: ownerId,
    };
    const product = new this.productModel(productData);
    const newProduct = await product.save();
    return newProduct;
  }

  async getProducts(queryDto: GetProductQueryDto) {
    const { page, per_page, seller } = queryDto;
    const matchQuery: Record<string, unknown> = {};

    if (seller) matchQuery.seller = new mongoose.Types.ObjectId(seller);

    const [{ count, schools }] = await this.productModel.aggregate([
      { $match: matchQuery },
      {
        $facet: {
          count: [
            {
              $count: 'total',
            },
          ],
          schools: [
            {
              $skip: (page - 1) * per_page,
            },
            {
              $limit: per_page,
            },
            {
              $sort: {
                created_at: -1,
              },
            },
          ],
        },
      },
    ]);

    const matchingProductsCount = count[0]?.total || 0;
    return new ResponseWrapper(schools, {
      pagination: getPaginationData(page, matchingProductsCount, per_page),
    });
  }

  async updateProduct(
    userId: string,
    productId: string,
    updateProductDto: UpdateProductDto
  ) {
    const updatedProduct = await this.productModel.findOneAndUpdate(
      { _id: productId, seller: userId },
      {
        $set: updateProductDto,
      },
      {
        new: true,
      }
    );

    if (!updatedProduct)
      throw new NotFoundException(ErrorMessages.ProductNotFound);

    return updatedProduct;
  }

  getProductById(productId: string) {
    return this.productModel.findById(productId);
  }

  async updatePurchasedProductsQuantity(
    products: PurchaseProductsDto['products'],
    session: ClientSession
  ) {
    const writes = products.map(({ product_id, quantity }) => ({
      updateOne: {
        filter: { _id: product_id },
        update: {
          $inc: {
            amount_available: -1 * quantity,
          },
        },
      },
    }));

    await this.productModel.bulkWrite(writes, {
      session,
    });
  }

  async purchaseProducts(
    userId: string,
    purchaseProductDto: PurchaseProductsDto
  ) {
    const { products: purchaseProducts } = purchaseProductDto;
    const productIds = purchaseProducts.map((product) => product.product_id);

    // Get the user making the purchase, throw an error if not found
    const purchaseUser = (
      await this.userService.getUser(userId, {
        throwOnNotFound: true,
      })
    ).toObject();

    // Get the products data
    const products = await this.productModel.find({
      _id: { $in: productIds },
    });

    // An _id to product data mapping for ease of lookup
    const productsRecord = createRecordFromSet(
      products,
      '_id',
      (item) => item.toObject() as any
    );

    const errors: Record<string, string[]> = {};
    let totalAmountOfPurchase = 0;

    // Ensure that the products requested exist and that they are
    // available in the requested quantity
    purchaseProducts.forEach(({ product_id, quantity }) => {
      const product = productsRecord[product_id];

      if (!product) errors.products = [ErrorMessages.ProductNotFound];

      const { name, amount_available, cost } = product;
      totalAmountOfPurchase += quantity * cost;

      if (amount_available < quantity) {
        errors.products ??= [];
        errors.products.push(
          ErrorMessages.InsufficientProduct(name, amount_available)
        );
      }
    });

    if (Object.values(errors).length) throw new BadRequestException(errors);

    // Ensure user has enough money to make purchase
    const coinsRemaining = this.userService.validateUserAbilityToPurchase(
      purchaseUser,
      totalAmountOfPurchase
    );

    // Debit user account and update product quantity
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await this.updatePurchasedProductsQuantity(purchaseProducts, session);
        await this.userService.updateUserBalance(
          purchaseUser,
          totalAmountOfPurchase,
          coinsRemaining,
          session
        );
      });
    } finally {
      await session.endSession();
    }

    const purchasedProducts = purchaseProducts.map(
      ({ product_id, quantity }) => {
        const { name, cost } = productsRecord[product_id];
        return {
          name,
          cost,
          total: cost * quantity,
          quantity,
        };
      }
    );
    return {
      products: purchasedProducts,
      amount_spent: totalAmountOfPurchase,
      user_balance: coinsRemaining,
    };
  }
}
