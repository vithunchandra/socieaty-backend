import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { CreateTopupTransactionDto } from './dto/create-topup-transaction'
import { firstValueFrom } from 'rxjs'
import { CreateSnapTransactionResponseDto } from './dto/create-snap-transaction-response.dto'
import { TopupNotificationRequestDto } from '../topup/dto/topup-notification-request.dto'
import * as crypto from 'crypto'

@Injectable()
export class MidtransService {
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService
	) {}

	private readonly midtransUrl = {
		topup: '/snap/v1/transactions'
	}

	async createTopupTransaction(data: CreateTopupTransactionDto) {
		const url = this.midtransUrl.topup

		const payload = {
			transaction_details: {
				order_id: data.orderId,
				gross_amount: data.grossAmount
			},
			credit_card: {
				secure: true
			},
			customer_details: {
				first_name: data.customer.userData.name,
				phone: data.customer.userData.phoneNumber,
				email: data.customer.userData.email
			}
		}

		try {
			const response = await firstValueFrom(this.httpService.post(url, payload))
			return {
				token: response.data.token,
				redirectUrl: response.data.redirect_url
			}
		} catch (error) {
			console.log(error.response.data)
			throw error
		}
	}

	isValidTopupNotification(topupNotificationRequestDto: TopupNotificationRequestDto) {
		const { order_id, status_code, gross_amount, signature_key } = topupNotificationRequestDto

		const serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY')
		const stringToSign = order_id + status_code.toString() + gross_amount.toFixed(2).toString() + serverKey

		const calculatedSignature = crypto.createHash('sha512').update(stringToSign).digest('hex')
		return calculatedSignature === signature_key
	}
}
