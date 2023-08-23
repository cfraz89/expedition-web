import type { HttpMethod } from '@sveltejs/kit';

export interface Flow {
	id: string;
	type: string;
	expires_at: string;
	issued_at: string;
	request_url: string;
	ui: {
		action: string;
		method: HttpMethod;
		nodes: Node[];
		messages: FlowMessage[];
	};
	created_at: string;
	updated_at: string;
	refresh: boolean;
}

export interface Node {
	type: 'input';
	group: string;
	attributes: {
		name: string;
		type: string;
		value: string;
		required: boolean;
		disabled: boolean;
		node_type: string;
	};
	messages: string[];
	meta: { label?: { text: string; type: 'info'; context: any } };
}

export interface FlowMessage {
	id: number;
	text: string;
	type: 'error';
}

export interface KratosError {
	id: string;
	error: {
		code: number;
		status: string;
		reason: string;
		message: string;
	};
	created_at: string;
	updated_at: string;
}
