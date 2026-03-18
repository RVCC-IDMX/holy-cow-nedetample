const test = require('tape');
const balloon = require('../lib/balloon');

test('single line - nowrap', (t) => {
	t.plan(2);

	t.equal(' _____\n< Hi! >\n -----', balloon.say('Hi!'));
	t.equal(' _____\n( Hi! )\n -----', balloon.think('Hi!'));
});

test('single line - wrap', (t) => {
	t.plan(2);

	t.equal(' _____\n< Yes >\n -----', balloon.say('Yes', 10));
	t.equal(' _____\n( Yes )\n -----', balloon.think('Yes', 10));
});

test('two lines - nowrap', (t) => {
	t.plan(2);
	t.equal([
		' _____',
		'/ AB  \\',
		'\\ CDE /',
		' -----',
	].join('\n'), balloon.say('AB\nCDE'));
	t.equal([
		' _____',
		'( AB  )',
		'( CDE )',
		' -----',
	].join('\n'), balloon.think('AB\nCDE'));
});

test('multiple lines - nowrap', (t) => {
	t.plan(2);

	t.equal([
		' _________',
		'/ AB      \\',
		'| CDE     |',
		'\\ QWE RTY /',
		' ---------',
	].join('\n'), balloon.say('AB\nCDE\nQWE RTY'));
	t.equal([
		' _________',
		'( AB      )',
		'( CDE     )',
		'( QWE RTY )',
		' ---------',
	].join('\n'), balloon.think('AB\nCDE\nQWE RTY'));
});

test('multiple lines - wrap to max lenght', (t) => {
	t.plan(2);

	t.equal([
		' ______',
		'/ ONE  \\',
		'| TWO  |',
		'| THRE |',
		'\\ E    /',
		' ------',
	].join('\n'), balloon.say('ONE\nTWO THREE', 4));
	t.equal([
		' ______',
		'( ONE  )',
		'( TWO  )',
		'( THRE )',
		'( E    )',
		' ------',
	].join('\n'), balloon.think('ONE\nTWO THREE', 4));
});

// Basic emoji wrap
test('emoji - wrap 8', (t) => {
    t.plan(1);
    t.equal([
        ' __________',
        '/ 🙂🙂🙂🙂 \\',
        '| 🙂🙂🙂🙂 |',
        '| 🙂🙂🙂🙂 |',
        '| 🙂🙂🙂🙂 |',
        '\\ 🙂🙂🙂🙂 /',
        ' ----------',
    ].join('\n'), balloon.say('🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂', 8));
});

// Mixed ASCII and emoji
test('mixed ascii and emoji - wrap 10', (t) => {
    t.plan(1);
    t.equal([
        ' ____________',
        '/ Hello 🙂🙂 \\',
        '| 🙂🙂🙂🙂🙂 |',
        '\\ 🙂🙂🙂!    /',
        ' ------------',
    ].join('\n'), balloon.say('Hello 🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂!', 10));
});

// CJK characters
test('CJK - wrap 6', (t) => {
    t.plan(1);
    t.equal([
        ' ________',
        '/ 你好， \\',
        '| 世界！ |',
        '| 这是一 |',
        '| 个测试 |',
        '\\ 。     /',
        ' --------',
    ].join('\n'), balloon.say('你好，世界！这是一个测试。', 6));
});

// Mixed CJK and emoji
test('mixed CJK and emoji - wrap 8', (t) => {
    t.plan(1);
    t.equal([
        ' __________',
        '/ 你好🙂🙂 \\',
        '| 🙂🙂世界 |',
        '\\ 🙂🙂🙂🙂 /',
        ' ----------',
    ].join('\n'), balloon.say('你好🙂🙂🙂🙂世界🙂🙂🙂🙂', 8));
});

// Single wide emoji per line
test('single wide emoji per line - wrap 2', (t) => {
    t.plan(1);
    t.equal([
        ' ____',
        '/ 🙂 \\',
        '| 🙂 |',
        '| 🙂 |',
        '| 🙂 |',
        '| 🙂 |',
        '| 🙂 |',
        '| 🙂 |',
        '\\ 🙂 /',
        ' ----',
    ].join('\n'), balloon.say('🙂🙂🙂🙂🙂🙂🙂🙂', 2));
});