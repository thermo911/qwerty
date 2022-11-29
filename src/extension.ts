// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

interface IQueue<T> {
	enqueue(item: T): void;
	dequeue(): T | undefined;
	size(): number;
	clear(): void;
	first(): T | undefined;
  }

class Queue<T> implements IQueue<T> {
	private storage: T[] = [];
  
	constructor(private capacity: number = Infinity) {}
  
	enqueue(item: T): void {
		if (this.size() === this.capacity) {
			this.dequeue();
		}
		this.storage.push(item);
	}

	dequeue(): T | undefined{
	 	 return this.storage.shift();
	}

	size(): number {
	  	return this.storage.length;
	}

	clear() {
		this.storage = [];
	}

	first(): T | undefined {
		return this.storage[0];
	}
}

class TypingListener {

	queue: Queue<number>;
    
	lastTypingTimeMs: number = 0;
	statusBar: vscode.StatusBarItem;

    constructor(statusBar: vscode.StatusBarItem, queueCapacity: number = 25) {
		this.statusBar = statusBar;
		this.queue = new Queue<number>(queueCapacity);

        vscode.window.onDidChangeTextEditorSelection(this.onTypingEvent, this, []);

        this.updateInfo();
		this.statusBar.show();
    }

	updateInfo() {
		let nowMs = new Date().getTime();
		let firstMs = this.queue.first();
		if (firstMs === undefined) {
			firstMs = 0;
		}
		let diff = nowMs - firstMs;
		this.queue.enqueue(nowMs);
		this.statusBar.text = `${Math.round(60000 * this.queue.size() / diff)} tpm`;
	}

    private onTypingEvent() {
        this.updateInfo();
    }

	dispose() {
	}
}

export function activate(context: vscode.ExtensionContext) {

	let statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	let typingListener = new TypingListener(statusBar);

    context.subscriptions.push(typingListener);
    context.subscriptions.push(statusBar);
}


// this method is called when your extension is deactivated
export function deactivate() {
}
