enum SupportTicketStatus {
	OPEN = 'open',
	CLOSED = 'closed'
}

const supportTicketStatusMap = {
	open: SupportTicketStatus.OPEN,
	closed: SupportTicketStatus.CLOSED
}

export { SupportTicketStatus, supportTicketStatusMap }
