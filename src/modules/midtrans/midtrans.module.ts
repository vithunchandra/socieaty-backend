import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MidtransService } from "./midtrans.service";

@Module({
    imports: [
        HttpModule.registerAsync({
			useFactory: async () => {
				const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true'
				const serverKey = process.env.MIDTRANS_SERVER_KEY
				const clientKey = process.env.MIDTRANS_CLIENT_KEY
				return {
					baseURL: isProduction
						? 'https://app.midtrans.com'
						: 'https://app.sandbox.midtrans.com',
					headers: {
						Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`,
						'Content-Type': 'application/json'
					}
				}
			}
		}),
		ConfigModule
    ],
    providers: [MidtransService],
    exports: [MidtransService]
})
export class MidtransModule {}