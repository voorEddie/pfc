var w = window.innerWidth,
	h = window.innerHeight;

var game = new Phaser.Game(w, h, Phaser.AUTO, 'game');

game.state.add('pre', { preload: preStatePreload, create: preStateCreate });
game.state.add('intro', { preload: introStatePreload, create: introStateCreate });
game.state.add('main', { preload: preload, create: create, update: update, render: render });
game.state.add('score', { preload: scoreStatePreload, create: scoreStateCreate });
game.state.start("pre");
//开始界面
function preStatePreload() {
	game.load.image('startButton', 'img/btn0001.png');
	game.load.image('BG1', 'img/BG1.png');
}

function preStateCreate() {
	game.stage.backgroundColor = '#182d3b';

	var imgBG1 = game.add.image(0, 0, 'BG1');
	imgBG1.height = h;
	imgBG1.width = w;

	var StartButton = game.add.button(w, h * .63, 'startButton', onStartClick, this, 2, 1, 0);
	StartButton.anchor.setTo(1, 0);
	StartButton.width = w * .48;
	StartButton.height = StartButton.width / 1.9;

	function onStartClick() {
		game.state.start('intro');

	}
}
//说明界面
function introStatePreload() {
	game.load.image('startButton', 'img/btn0002.png');
	game.load.image('BG2', 'img/BG2.png');
}

function introStateCreate() {
	game.stage.backgroundColor = '#182d3b';

	var imgBG2 = game.add.image(0, 0, 'BG2');
	imgBG2.height = h;
	imgBG2.width = w;

	var StartButton = game.add.button(w, h * .63, 'startButton', onStartClick, this, 2, 1, 0);
	StartButton.anchor.setTo(1, 0);
	StartButton.width = w * .48;
	StartButton.height = StartButton.width / 1.9;

	function onStartClick() {
		game.state.start('main');
	}
}
//游戏界面
function preload() {
	// game.load.image('test1', 'img/test1.png');
	// game.load.image('test1-frag', 'img/test1-frag.png');
	game.load.image('test2', 'img/test2.png');
	game.load.image('test2-frag', 'img/test2-frag.png');
	game.load.image('3', 'img/djs1.png');
	game.load.image('2', 'img/djs2.png');
	game.load.image('1', 'img/djs3.png');
	game.load.image('4', 'img/djs0.png');
	game.load.image('BG3', 'img/BG3.png');
	game.load.image('scoreLabel','img/btn0003.png');

	// 1号鸭梨 + 对应的两瓣
	game.load.image('pear1', 'img/330001.png');
	game.load.image('pear1-f1', 'img/330002.png');
	game.load.image('pear1-f2', 'img/330003.png');

	// 2号鸭梨 + 对应的两瓣
	game.load.image('pear2', 'img/330004.png');
	game.load.image('pear2-f1', 'img/330005.png');
	game.load.image('pear2-f2', 'img/330006.png');

	// 2号鸭梨 + 对应的两瓣
	game.load.image('pear3', 'img/330007.png');
	game.load.image('pear3-f1', 'img/330008.png');
	game.load.image('pear3-f2', 'img/330009.png');

	// 鸟 + 鸟被揍
	game.load.image('bird', 'img/330010.png');
	game.load.image('bird-down', 'img/330011.png');

}

var good_objects,
	bad_objects,
	slashes,
	line,
	scoreLabel,
	score = 0,
	points = [];

var testObj1,
	testObj2,
	pear1Emtr1,
	pear1Emtr2,
	pear2Emtr1,
	pear2Emtr2,
	pear3Emtr1,
	pear3Emtr2,
	emtr2

var fireRate = 300;//水果的频率
var eggRate = 0.1;//鸡蛋的概率
var nextFire = 0;

var isActive = true;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = 300;

	var imgBG3 = game.add.image(0, 0, 'BG3');
	imgBG3.height = h;
	imgBG3.width = w;

	slashes = game.add.graphics(0, 0);

	var scoreLabelImg = game.add.image(w/2, h * 0.85, 'scoreLabel');
	scoreLabelImg.scale.x = 0.5;
	scoreLabelImg.scale.y = 0.5;
	scoreLabelImg.anchor.setTo(0.5,0.5);

	scoreLabel = game.add.text(w * 0.6, h * 0.86, '0', { font: "55px" });
	scoreLabel.anchor.setTo(1,0.5);
	scoreLabel.fill = 'purple';

	timeLabel = game.add.text(w * 0.85, h * 0.09, '20', { font: "55px" });
	timeLabel.anchor.setTo(1,0.5);
	timeLabel.fill = 'yellow';

	// testObj1 = createGroup(4, 'test1');
	// emtr1 = game.add.emitter(0, 0, 300);
	// emtr1.makeParticles('test1-frag');
	// emtr1.gravity = 300;
	// emtr1.setYSpeed(-400, 400);

	testObj2 = createGroup(4, 'test2');
	emtr2 = game.add.emitter(0, 0, 300);
	emtr2.makeParticles('test2-frag');
	emtr2.gravity = 300;
	emtr2.setYSpeed(-400, 400);

	pearObj1 = createGroup(3, 'pear1');
	pear1Emtr1 = game.add.emitter(0, 0, 300);
	pear1Emtr1.makeParticles('pear1-f1');
	pear1Emtr1.gravity = 300;
	pear1Emtr1.setYSpeed(-400, 400);
	pear1Emtr2 = game.add.emitter(0, 0, 300);
	pear1Emtr2.makeParticles('pear1-f2');
	pear1Emtr2.gravity = 300;
	pear1Emtr2.setYSpeed(-400, 400);

	pearObj2 = createGroup(3, 'pear2');
	pear2Emtr1 = game.add.emitter(0, 0, 300);
	pear2Emtr1.makeParticles('pear2-f1');
	pear2Emtr1.gravity = 300;
	pear2Emtr1.setYSpeed(-400, 400);
	pear2Emtr2 = game.add.emitter(0, 0, 300);
	pear2Emtr2.makeParticles('pear2-f2');
	pear2Emtr2.gravity = 300;
	pear2Emtr2.setYSpeed(-400, 400);

	pearObj3 = createGroup(3, 'pear3');
	pear3Emtr1 = game.add.emitter(0, 0, 300);
	pear3Emtr1.makeParticles('pear3-f1');
	pear3Emtr1.gravity = 300;
	pear3Emtr1.setYSpeed(-400, 400);
	pear3Emtr2 = game.add.emitter(0, 0, 300);
	pear3Emtr2.makeParticles('pear3-f2');
	pear3Emtr2.gravity = 300;
	pear3Emtr2.setYSpeed(-400, 400);

	gameTime = game.time.create(false);
	//倒计时
	isActive = false;
	countDownSpr = game.add.sprite(w/2, h/2, '1');
	countDownSpr.scale.x = 0.5;
	countDownSpr.scale.y = 0.5;
	countDownSpr.anchor.setTo(0.5,0.5);
	countDownTime = game.time.create();
	countDownTime.loop(Phaser.Timer.SECOND, countDownFunc, this);
	countDown = 1;
	countDownTime.start();
}
var countDown;
function countDownFunc() {
	countDown++;
	countDownSpr.loadTexture(countDown);
	if (countDown >= 5) {
		countDownTime.stop();
		gameTime.add(Phaser.Timer.SECOND * 20, gameOver, this);
		gameTime.start();
		isActive = true;
		countDownSpr.visible = false;
	}

}

function createGroup(numItems, sprite) {
	var group = game.add.group();
	group.enableBody = true;
	group.physicsBodyType = Phaser.Physics.ARCADE;
	group.createMultiple(numItems, sprite);
	group.setAll('checkWorldBounds', true);
	group.setAll('outOfBoundsKill', true);
	return group;
}

function throwObject() {
	if (game.time.now > nextFire && pearObj1.countDead() > 0 && pearObj2.countDead() > 0 && pearObj3.countDead() > 0 && testObj2.countDead() > 0) {
		nextFire = game.time.now + fireRate;
		throwGoodObject();
		if (Math.random() > eggRate) {
			//throwBadObject();
		}
	}
}

function throwGoodObject() {
	var objs = [pearObj1, pearObj2, pearObj3];
	var obj = objs[Math.floor(Math.random() * objs.length)].getFirstDead();
	obj.reset(game.world.centerX + Math.random() * 100 - Math.random() * 100, 600);
	obj.anchor.setTo(0.5, 0.5);
	obj.body.angularAcceleration = 100;
	game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, 530);
}

function throwBadObject() {
	var obj = testObj2.getFirstDead();
	obj.reset(game.world.centerX + Math.random() * 100 - Math.random() * 100, 600);
	obj.anchor.setTo(0.5, 0.5);
	obj.body.angularAcceleration = 100;
	game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, 530);
}

function update() {
	if (isActive) {
		throwObject();
		timeLabel.text = Math.round(gameTime.duration / Phaser.Timer.SECOND);
	}
	points.push({
		x: game.input.x,
		y: game.input.y
	});
	points = points.splice(points.length - 10, points.length);
	//game.add.sprite(game.input.x, game.input.y, 'hit');

	if (points.length < 1 || points[0].x == 0) {
		return;
	}

	slashes.clear();
	slashes.beginFill(0xFFFFFF);
	slashes.alpha = .5;
	slashes.moveTo(points[0].x, points[0].y);
	for (var i = 1; i < points.length; i++) {
		slashes.lineTo(points[i].x, points[i].y);
	}
	slashes.endFill();

	for (var i = 1; i < points.length; i++) {
		line = new Phaser.Line(points[i].x, points[i].y, points[i - 1].x, points[i - 1].y);
		// game.debug.geom(line);
		if (isActive) {
			pearObj1.forEachExists(checkIntersects);
			pearObj2.forEachExists(checkIntersects);
			pearObj3.forEachExists(checkIntersects);
			testObj2.forEachExists(checkIntersects);
		}
	}
	//	if (game.input.activePointer.isDown && !isActive) {
	//		gameRestart();
	//	}
}

var contactPoint = new Phaser.Point(0, 0);

function checkIntersects(fruit, callback) {
	var l1 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
	var l2 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom - fruit.height);
	l2.angle = 90;

	if (Phaser.Line.intersects(line, l1, true) ||
		Phaser.Line.intersects(line, l2, true)) {

		contactPoint.x = game.input.x;
		contactPoint.y = game.input.y;
		var distance = Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y));
		if (Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y)) > 110) {
			return;
		}

		killFruit(fruit);

		// if (fruit.parent == testObj1) {
		// killFruit(fruit);
		// } else {
		// gameOver();
		// }
	}
}

function gameOver() {
	isActive = false;
	game.state.start('score');
}

function render() {
}

function killFruit(fruit) {
	if (fruit.key === 'pear1') {
		pear1Emtr1.x = fruit.x;
		pear1Emtr1.y = fruit.y;
		pear1Emtr2.x = fruit.x;
		pear1Emtr2.y = fruit.y;
		score += 2;
		pear1Emtr1.start(true, 2000, null, 1);
		pear1Emtr2.start(true, 2000, null, 1);
	} else if (fruit.key === 'pear2') {
		pear2Emtr1.x = fruit.x;
		pear2Emtr1.y = fruit.y;
		pear2Emtr2.x = fruit.x;
		pear2Emtr2.y = fruit.y;
		score += 2;
		pear2Emtr1.start(true, 2000, null, 1);
		pear2Emtr2.start(true, 2000, null, 1);
	} else if (fruit.key === 'pear3') {
		pear3Emtr1.x = fruit.x;
		pear3Emtr1.y = fruit.y;
		pear3Emtr2.x = fruit.x;
		pear3Emtr2.y = fruit.y;
		score += 2;
		pear3Emtr1.start(true, 2000, null, 1);
		pear3Emtr2.start(true, 2000, null, 1);
	} else if (fruit.key === 'test2') {
		emtr2.x = fruit.x;
		emtr2.y = fruit.y;
		//score -= 5;现在主要是俩图片长的太像了，就没直接改
		emtr2.start(true, 2000, null, 2);
	}

	fruit.kill();
	points = [];

	scoreLabel.text = score;
}
//得分面板
function scoreStatePreload() {
	game.load.image('restartButton', 'img/btn20001.png');
	game.load.image('shareButton', 'img/btn20002.png');
	game.load.image('win', 'img/win.png');
	game.load.image('lose', 'img/lose.png');
	game.load.image('BG4','img/BG4.png');
}

function scoreStateCreate() {
	game.stage.backgroundColor = '#182d3b';

	var imgBG4 = game.add.image(0, 0, 'BG4');
	imgBG4.height = h;
	imgBG4.width = w;

	var textByJingYe;
	if (score >= 150) textByJingYe = '京爷说：保留成绩截\n图，发给公众号\n吧，大师！';
	else if (score >= 140) textByJingYe = '京爷说：你这么专\n业，该奖励你去\n【熬大梨呀】！';
	else if (score >= 130) textByJingYe = '京爷说：今天的梨汤\n还是这么香浓，\n再来一壶！';
	else if (score >= 115) textByJingYe = '京爷说：辛苦你了\n，希望明天还\n能来帮忙呀！';
	else if (score >= 100) textByJingYe = '京爷说：嗯，以你的\n实力应该可\n以做的更好吧？';
	else if (score >= 80) textByJingYe = '京爷说：没少误伤\n味味吧...你\n可要小心点啊！';
	else if (score >= 60) textByJingYe = '味味说：等我伤\n好了，一定要报\n仇！好疼啊！';
	else textByJingYe = '味味说：你丫是看\n准了专门来砍\n我的是不是！';

	var preLabel = game.add.text(w * 0.65, h * 0.55, '得分:' + score + '分\n' + textByJingYe, { font: "25px" ,fontWeight: "bold"});
	preLabel.anchor.setTo(0.5,0.5);
	preLabel.fill = 'white';

	resultSpr = game.add.sprite(w * 0.55, h * 0.38, 'win');
	resultSpr.scale.x = 0.6;
	resultSpr.scale.y = 0.6;
	resultSpr.anchor.setTo(0.5,0.5);

	if (score >= 100)
		resultSpr.loadTexture('win');
	else
		resultSpr.loadTexture('lose');

	restartBnt = game.add.button(0, h * 0.85, 'restartButton', onRestartClick, this, 2, 1, 0);
	restartBnt.scale.x = 0.5;
	restartBnt.scale.y = 0.5;
	restartBnt.anchor.setTo(0,0.5);
	shareBnt = game.add.button(w, h * 0.8, 'shareButton', onShareButtonClick, this, 2, 1, 0);
	shareBnt.scale.x = 0.5;
	shareBnt.scale.y = 0.5;
	shareBnt.anchor.setTo(1,0.5);

	var highscore = Math.max(score, sessionStorage.getItem("pfcHighscore"));
	sessionStorage.setItem("pfcHighscore", highscore);

	function onRestartClick() {
		isActive = true;
		score = 0;
		game.time.reset();
		game.state.start('main');
	}

	function onShareButtonClick() {
		//调用朋友圈分享接口
	}
}