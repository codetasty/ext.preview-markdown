/* global define, $, config */
"use strict";

define(function(require, exports, module) {
	// libraries
	const Showdown = require('./showdown');
	
	// deps
	const ExtensionManager = require('core/extensionManager');
	const EditorPreview = require('modules/editor/ext/preview');
	
	class Extension extends ExtensionManager.Extension {
		constructor() {
			super({
				name: 'preview-markdown',
			});
			
			this.converter = null;
			this.modeHandler = null;
		}
		
		
		init() {
			super.init();
			
			this.converter = new Showdown.Converter();
			this.modeHandler = EditorPreview.addModeHandler('markdown', this.markdownPreviewHandler.bind(this));
			
			this.emit('init');
		}
		
		destroy() {
			super.destroy();
			
			EditorPreview.removeModeHandler(this.modeHandler);
			this.modeHandler = null;
			
			this.converter = null;
		}
		
		markdownPreviewHandler(session) {
			let value = session.data.getValue();
			
			return {
				head: '<link rel="stylesheet" href="' + this.getBaseUrl() + '/markdown.css">',
				body: this.converter.makeHtml(value),
				className: 'markdown-body',
			};
		}
	}
	
	module.exports = new Extension();
});