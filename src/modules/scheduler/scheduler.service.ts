import { Injectable, Logger } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'

@Injectable()
export class SchedulerService {
	constructor(
		private readonly schedulerRegistry: SchedulerRegistry
	) {}

	addTimeout(name: string, callback: () => void, delay: number) {
		const timeout = setTimeout(callback, delay)
		this.schedulerRegistry.addTimeout(name, timeout)
	}

	addInterval(name: string, callback: () => void, delay: number) {
		const interval = setInterval(callback, delay)
		this.schedulerRegistry.addInterval(name, interval)
	}

	deleteTimeout(name: string) {
		const timeouts = this.schedulerRegistry.getTimeouts()
		const timeout = timeouts[name]
		if (timeout) {
			this.schedulerRegistry.deleteTimeout(name)
		}
	}

	deleteInterval(name: string) {
		const intervals = this.schedulerRegistry.getIntervals()
		const interval = intervals[name]
		if (interval) {
			this.schedulerRegistry.deleteInterval(name)
		}
	}
}
