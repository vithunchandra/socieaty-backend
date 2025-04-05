import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { TopupRequestDto } from './dto/topup-request.dto'
import { v7 } from 'uuid';

@Injectable()
export class PaymentService {
	private readonly baseUrl: string
	private readonly serverKey: string
	private readonly clientKey: string

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {
		const isProduction = this.configService.get('MIDTRANS_IS_PRODUCTION') === 'true'
		this.baseUrl = isProduction
			? 'https://api.midtrans.com'
			: 'https://api.sandbox.midtrans.com'
		this.serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY') || ''
		this.clientKey = this.configService.get<string>('MIDTRANS_CLIENT_KEY') || ''
	}

	private getAuthHeader() {
		const auth = Buffer.from(`${this.serverKey}:`).toString('base64')
		const headerConfig = {
			Authorization: `Basic ${auth}`,
			'Content-Type': 'application/json'
		}
		return headerConfig
	}

	async createTransaction(params: TopupRequestDto) {
		const url = `/snap/v1/transactions`

		const payload = {
			transaction_details: {
				order_id: v7(),
				gross_amount: params.amount
			},
			credit_card: {
				secure: true
			},
			customer_details: {
				first_name: params.customerName,
				email: params.customerEmail
			},
			custom_field1: params.description
		}

		try {
			const response = await firstValueFrom(
				this.httpService.post<string>(url, payload, {
					headers: this.getAuthHeader()
				})
			)
			return response.data
		} catch (error) {
			console.log(error)
			throw error
		}
	}

	async getTransactionStatus(orderId: string) {
		const url = `${this.baseUrl}/v2/${orderId}/status`

		try {
			const response = await firstValueFrom(
				this.httpService.get(url, {
					headers: this.getAuthHeader()
				})
			)
			return response.data
		} catch (error) {
			throw error
		}
	}

	async cancelTransaction(orderId: string) {
		const url = `${this.baseUrl}/v2/${orderId}/cancel`

		try {
			const response = await firstValueFrom(
				this.httpService.post(
					url,
					{},
					{
						headers: this.getAuthHeader()
					}
				)
			)
			return response.data
		} catch (error) {
			throw error
		}
	}

	async expireTransaction(orderId: string) {
		const url = `${this.baseUrl}/v2/${orderId}/expire`

		try {
			const response = await firstValueFrom(
				this.httpService.post(
					url,
					{},
					{
						headers: this.getAuthHeader()
					}
				)
			)
			return response.data
		} catch (error) {
			throw error
		}
	}

	async captureTransaction(params: { transactionId: string; grossAmount: number }) {
		const url = `${this.baseUrl}/v2/capture`

		const payload = {
			transaction_id: params.transactionId,
			gross_amount: params.grossAmount
		}

		try {
			const response = await firstValueFrom(
				this.httpService.post(url, payload, {
					headers: this.getAuthHeader()
				})
			)
			return response.data
		} catch (error) {
			throw error
		}
	}

	verifyNotification(notificationData: any) {
		const orderId = notificationData.order_id
		return this.getTransactionStatus(orderId)
	}

	getSnapRedirectUrl() {
		return `${this.baseUrl}/snap/v1/transactions`
	}

	async createSnapTransaction(params: {
		orderId: string
		amount: number
		customerName: string
		customerEmail: string
		description: string
	}) {
		const url = `${this.baseUrl}/snap/v1/transactions`

		const payload = {
			transaction_details: {
				order_id: params.orderId,
				gross_amount: params.amount
			},
			customer_details: {
				first_name: params.customerName,
				email: params.customerEmail
			},
			custom_field1: params.description
		}

		try {
			const response = await firstValueFrom(
				this.httpService.post(url, payload, {
					headers: this.getAuthHeader()
				})
			)
			return response.data
		} catch (error) {
			throw error
		}
	}
}
