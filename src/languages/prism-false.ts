import type { LanguageProto } from '../types';

export default {
	id: 'false',
	grammar() {
		/**
		 * Based on the manual by Wouter van Oortmerssen.
		 *
		 * @see {@link https://github.com/PrismJS/prism/issues/2801#issue-829717504}
		 */
		return {
			'comment': {
				pattern: /\{[^}]*\}/
			},
			'string': {
				pattern: /"[^"]*"/,
				greedy: true
			},
			'character-code': {
				pattern: /'(?:[^\r]|\r\n?)/,
				alias: 'number'
			},
			'assembler-code': {
				pattern: /\d+`/,
				alias: 'important'
			},
			'number': /\d+/,
			'operator': /[-!#$%&'*+,./:;=>?@\\^_`|~ßø]/,
			'punctuation': /\[|\]/,
			'variable': /[a-z]/,
			'non-standard': {
				pattern: /[()<BDO®]/,
				alias: 'bold'
			}
		};
	}
} as LanguageProto<'false'>;
