var stringWidth = require("string-width").default || require("string-width");
var GraphemeSplitter = require("grapheme-splitter");

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
		var splitter = new GraphemeSplitter();
		var segments = text.split('\n');
		for (let seg of segments) {
			let graphemes = splitter.splitGraphemes(seg);
			let idx = 0;
			while (idx < graphemes.length) {
				let line = '';
				let width = 0;
				while (idx < graphemes.length) {
					let g = graphemes[idx];
					let gWidth = stringWidth(g);
					if (width + gWidth > wrap && line.length > 0) break;
					if (width + gWidth > wrap && line.length === 0) {
						// Always add at least one grapheme, even if it's too wide
						line += g;
						idx++;
						break;
					}
					line += g;
					width += gWidth;
					idx++;
				}
				// Debug output for each line
				console.log('[DEBUG] line:', JSON.stringify(line), 'graphemes:', graphemes.slice(idx - line.length, idx), 'stringWidth:', stringWidth(line));
				console.log('[DEBUG] stringWidth(🙂):', stringWidth('🙂'));
				lines.push(line);
			}
		}
	}
	return lines;
}

function max(lines) {
    var max = 0;
    for (var i = 0; i < lines.length; i++) {
        var width = stringWidth(lines[i]);
        if (width > max) {
            max = width;
        }
    }
    return max;
}

function pad(text, length) {
    let padded = text;
    while (stringWidth(padded) < length) {
        padded += ' ';
    }
    return padded;
}

function top(length) {
    return '_'.repeat(length + 2);
}

function bottom (length) {
	return '-'.repeat(length + 2);
}
