import type { LanguageProto } from '../types';

export default {
	id: 'r',
	grammar: {
		'comment': /#.*/,
		'string': {
			pattern: /(['"])(?:\\.|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
		'percent-operator': {
			// Includes user-defined operators
			// and %%, %*%, %/%, %in%, %o%, %x%
			pattern: /%[^%\s]*%/,
			alias: 'operator'
		},
		'boolean': /\b(?:FALSE|TRUE)\b/,
		'ellipsis': /\.\.(?:\.|\d+)/,
		'number': [
			/\b(?:Inf|NaN)\b/,
			/(?:\b0x[\dA-Fa-f]+(?:\.\d*)?|\b\d+(?:\.\d*)?|\B\.\d+)(?:[EePp][+-]?\d+)?[iL]?/
		],
		'keyword': /\b(?:NA|NA_character_|NA_complex_|NA_integer_|NA_real_|NULL|break|else|for|function|if|in|next|repeat|while)\b/,
		'operator': /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
		'punctuation': /[(){}\[\],;]/
	}
} as LanguageProto<'r'>;
