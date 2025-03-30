import { Injectable } from '@nestjs/common'
import * as QRCode from 'qrcode'

@Injectable()
export class QRCodeService {
	async generateQRCode(data: string) {
		try {
			return await QRCode.toDataURL(data)
		} catch (err) {
			throw new Error('Failed to generate QR code')
		}
	}

	async generateQrCodeBuffer(data: string): Promise<Buffer> {
		try {
			return await QRCode.toBuffer(data) // Returns a Buffer
		} catch (error) {
			throw new Error('Failed to generate QR Code buffer')
		}
	}

	async generateQrCodeSvg(data: string): Promise<string> {
		try {
			return await QRCode.toString(data, { type: 'svg' }) // Generates an SVG string
		} catch (error) {
			throw new Error('Failed to generate QR Code SVG')
		}
	}
}
