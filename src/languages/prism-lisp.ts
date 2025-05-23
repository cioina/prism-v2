import { rest } from '../shared/symbols';
import type { LanguageProto } from '../types';

export default {
	id: 'lisp',
	alias: ['emacs', 'elisp', 'emacs-lisp'],
	grammar() {
		/**
		 * Functions to construct regular expressions
		 * e.g. (interactive ... or (interactive)
		 */
		function simple_form(name: string) {
			return RegExp(/(\()/.source + '(?:' + name + ')' + /(?=[\s\)])/.source);
		}
		/**
		 * booleans and numbers
		 */
		function primitive(pattern: string) {
			return RegExp(/([\s([])/.source + '(?:' + pattern + ')' + /(?=[\s)])/.source);
		}

		// Patterns in regular expressions

		// Symbol name. See https://www.gnu.org/software/emacs/manual/html_node/elisp/Symbol-Type.html
		// & and : are excluded as they are usually used for special purposes
		const symbol = /(?!\d)[-+*/~!@$%^=<>{}\w]+/.source;
		// symbol starting with & used in function arguments
		const marker = '&' + symbol;
		// Open parenthesis for look-behind
		const par = '(\\()';
		const endpar = '(?=\\))';
		// End the pattern with look-ahead space
		const space = '(?=\\s)';
		const nestedPar = /(?:[^()]|\((?:[^()]|\((?:[^()]|\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\))*\))*\))*/.source;

		const arg = {
			'lisp-marker': RegExp(marker),
			'varform': {
				pattern: RegExp(/\(/.source + symbol + /\s+(?=\S)/.source + nestedPar + /\)/.source),
				inside: 'lisp'
			},
			'argument': {
				pattern: RegExp(/(^|[\s(])/.source + symbol),
				lookbehind: true,
				alias: 'variable'
			},
			[rest]: 'lisp'
		};

		const forms = '\\S+(?:\\s+\\S+)*';

		const arglist = {
			pattern: RegExp(par + nestedPar + endpar),
			lookbehind: true,
			inside: {
				'rest-vars': {
					pattern: RegExp('&(?:body|rest)\\s+' + forms),
					inside: arg
				},
				'other-marker-vars': {
					pattern: RegExp('&(?:aux|optional)\\s+' + forms),
					inside: arg
				},
				'keys': {
					pattern: RegExp('&key\\s+' + forms + '(?:\\s+&allow-other-keys)?'),
					inside: arg
				},
				'argument': {
					pattern: RegExp(symbol),
					alias: 'variable'
				},
				'punctuation': /[()]/
			}
		};


		return {
			// Three or four semicolons are considered a heading.
			// See https://www.gnu.org/software/emacs/manual/html_node/elisp/Comment-Tips.html
			'heading': {
				pattern: /;;;.*/,
				alias: ['comment', 'title']
			},
			'comment': /;.*/,
			'string': {
				pattern: /"(?:[^"\\]|\\.)*"/,
				greedy: true,
				inside: {
					'argument': /[-A-Z]+(?=[.,\s])/,
					'symbol': RegExp('`' + symbol + "'")
				}
			},
			'quoted-symbol': {
				pattern: RegExp("#?'" + symbol),
				alias: ['variable', 'symbol']
			},
			'lisp-property': {
				pattern: RegExp(':' + symbol),
				alias: 'property'
			},
			'splice': {
				pattern: RegExp(',@?' + symbol),
				alias: ['symbol', 'variable']
			},
			'keyword': [
				{
					pattern: RegExp(
						par +
						'(?:and|(?:cl-)?letf|cl-loop|cond|cons|error|if|(?:lexical-)?let\\*?|message|not|null|or|provide|require|setq|unless|use-package|when|while)' +
						space
					),
					lookbehind: true
				},
				{
					pattern: RegExp(
						par + '(?:append|by|collect|concat|do|finally|for|in|return)' + space
					),
					lookbehind: true
				},
			],
			'declare': {
				pattern: simple_form(/declare/.source),
				lookbehind: true,
				alias: 'keyword'
			},
			'interactive': {
				pattern: simple_form(/interactive/.source),
				lookbehind: true,
				alias: 'keyword'
			},
			'boolean': {
				pattern: primitive(/nil|t/.source),
				lookbehind: true
			},
			'number': {
				pattern: primitive(/[-+]?\d+(?:\.\d*)?/.source),
				lookbehind: true
			},
			'defvar': {
				pattern: RegExp(par + 'def(?:const|custom|group|var)\\s+' + symbol),
				lookbehind: true,
				inside: {
					keyword: /^def[a-z]+/,
					variable: RegExp(symbol)
				}
			},
			'defun': {
				pattern: RegExp(par + /(?:cl-)?(?:defmacro|defun\*?)\s+/.source + symbol + /\s+\(/.source + nestedPar + /\)/.source),
				lookbehind: true,
				greedy: true,
				inside: {
					'keyword': /^(?:cl-)?def\S+/,
					// See below, this property needs to be defined later so that it can
					// reference the language object.
					'arguments': {
						...arglist,
						inside: {
							...arglist.inside,
							'sublist': arglist
						}
					},
					'function': {
						pattern: RegExp('(^\\s)' + symbol),
						lookbehind: true
					},
					'punctuation': /[()]/
				}
			},
			'lambda': {
				pattern: RegExp(par + 'lambda\\s+\\(\\s*(?:&?' + symbol + '(?:\\s+&?' + symbol + ')*\\s*)?\\)'),
				lookbehind: true,
				greedy: true,
				inside: {
					'keyword': /^lambda/,
					// See below, this property needs to be defined later so that it can
					// reference the language object.
					'arguments': arglist,
					'punctuation': /[()]/
				}
			},
			'car': {
				pattern: RegExp(par + symbol),
				lookbehind: true
			},
			'punctuation': [
				// open paren, brackets, and close paren
				/(?:['`,]?\(|[)\[\]])/,
				// cons
				{
					pattern: /(\s)\.(?=\s)/,
					lookbehind: true
				},
			]
		};
	}
} as LanguageProto<'lisp'>;
