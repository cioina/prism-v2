import type { LanguageProto } from '../types';

export default {
	id: 'ichigojam',
	grammar() {
		// according to the offical reference (EN)
		// https://ichigojam.net/IchigoJam-en.html
		return {
			'comment': /(?:\B'|REM)(?:[^\n\r]*)/i,
			'string': {
				pattern: /"(?:""|[!#$%&'()*,\/:;<=>?^\w +\-.])*"/,
				greedy: true
			},
			'number': /\B#[0-9A-F]+|\B`[01]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:E[+-]?\d+)?/i,
			'keyword': /\b(?:BEEP|BPS|CASE|CLEAR|CLK|CLO|CLP|CLS|CLT|CLV|CONT|COPY|ELSE|END|FILE|FILES|FOR|GOSUB|GOTO|GSB|IF|INPUT|KBD|LED|LET|LIST|LOAD|LOCATE|LRUN|NEW|NEXT|OUT|PLAY|POKE|PRINT|PWM|REM|RENUM|RESET|RETURN|RIGHT|RTN|RUN|SAVE|SCROLL|SLEEP|SRND|STEP|STOP|SUB|TEMPO|THEN|TO|UART|VIDEO|WAIT)(?:\$|\b)/i,
			'function': /\b(?:ABS|ANA|ASC|BIN|BTN|DEC|END|FREE|HELP|HEX|I2CR|I2CW|IN|INKEY|LEN|LINE|PEEK|RND|SCR|SOUND|STR|TICK|USR|VER|VPEEK|ZER)(?:\$|\b)/i,
			'label': /(?:\B@\S+)/,
			'operator': /<[=>]?|>=?|\|\||&&|[+\-*\/=|&^~!]|\b(?:AND|NOT|OR)\b/i,
			'punctuation': /[\[,;:()\]]/
		};
	}
} as LanguageProto<'ichigojam'>;
