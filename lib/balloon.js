var stringWidth = require("string-width");

exports.say = function (text, wrap) {
	var delimiters = {
		first : ["/", "\\"],
		middle : ["|", "|"],
		last : ["\\", "/"],
		only : ["<", ">"]
	};

	return format(text, wrap, delimiters);
}

exports.think = function (text, wrap) {
	var delimiters = {
		first : ["(", ")"],
		middle : ["(", ")"],
		last : ["(", ")"],
		only : ["(", ")"]
	};

	return format(text, wrap, delimiters);
}

function format (text, wrap, delimiters) {
	var lines = split(text, wrap);
	var maxLength = max(lines);

	var balloon;
	if (lines.length === 1) {
		balloon = [
			" " + top(maxLength),
			delimiters.only[0] + " " + lines[0] + " " + delimiters.only[1],
			" " + bottom(maxLength)
		];
	} else {
		balloon = [" " + top(maxLength)];

		for (var i = 0, len = lines.length; i < len; i += 1) {
			var delimiter;

			if (i === 0) {
				delimiter = delimiters.first;
			} else if (i === len - 1) {
				delimiter = delimiters.last;
			} else {
				delimiter = delimiters.middle;
			}

			balloon.push(delimiter[0] + " " + pad(lines[i], maxLength) + " " + delimiter[1]);
		}

		balloon.push(" " + bottom(maxLength));
	}

	return balloon.join("\n");
}

function split(text, wrap) {
	text = text.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '').replace(/\t/g, '        ');
	var lines = [];
	if (!wrap) {
		lines = text.split("\n");
	} else {
		var stringWidth = require("string-width");
		var start = 0;
		while (start < text.length) {
			var nextNewLine = text.indexOf("\n", start);
			var segmentEnd = (nextNewLine === -1) ? text.length : nextNewLine;
			var line = '';
			var width = 0;
			for (let i = start; i < segmentEnd;) {
				const char = text[i];
				const charWidth = stringWidth(char);
				if (width + charWidth > wrap) break;
				line += char;
				width += charWidth;
				i++;
			}
			if (line.length === 0 && start < segmentEnd) {
				// Handle case where a single character is wider than wrap
				line = text[start];
				start++;
			} else {
				start += line.length;
			}
			lines.push(line);
			// If a newline, skip it
			if (text[start] === "\n") start++;
		}
	}
	return lines;
}

function max (lines) {
	var max = 0;
	for (var i = 0, len = lines.length; i < len; i += 1) {
		if (stringWidth(lines[i]) > max) {
			max = stringWidth(lines[i]);
		}
	}

	return max;
}

function pad (text, length) {
	return text + (new Array(length - stringWidth(text) + 1)).join(" ");
}

function top (length) {
	return new Array(length + 3).join("_");
}

function bottom (length) {
	return new Array(length + 3).join("-");
}
