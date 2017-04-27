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
	game.load.image('startButton', 'img/test2.png');
}

function preStateCreate() {
	game.stage.backgroundColor = '#182d3b';

	var preLabel = game.add.text(game.world.centerX - 110, 200, '京爷切菜');
	preLabel.fill = 'white';

	var StartButton = game.add.button(game.world.centerX - 95, 400, 'startButton', onStartClick, this, 2, 1, 0);

	function onStartClick() {
		game.state.start('intro');
	}
}
//说明界面
function introStatePreload() {
	game.load.image('startButton', 'img/test2.png');
}

function introStateCreate() {
	game.stage.backgroundColor = '#182d3b';

	var preLabel = game.add.text(game.world.centerX - 130, 200, '游戏玩法说明');
	preLabel.fill = 'white';

	var StartButton = game.add.button(game.world.centerX - 95, 400, 'startButton', onStartClick, this, 2, 1, 0);

	function onStartClick() {
		game.state.start('main');
	}
}
//游戏界面
function preload() {
	game.load.image('test1', 'img/test1.png'),
		game.load.image('test1-frag', 'img/test1-frag.png'),
		game.load.image('test2', 'img/test2.png'),
		game.load.image('test2-frag', 'img/test2-frag.png');
	game.load.image('3', 'img/1.png');
	game.load.image('2', 'img/2.png');
	game.load.image('1', 'img/3.png');
	game.load.image('4', 'img/start.png');
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
	emtr1,
	emtr2

var fireRate = 300;//水果的频率
var eggRate = 0.1;//鸡蛋的概率
var nextFire = 0;

var isActive = true;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = 300;

	slashes = game.add.graphics(0, 0);

	scoreLabel = game.add.text(w / 2 - 50, h - 130, '0分');
	scoreLabel.fill = 'white';

	timeLabel = game.add.text(10, 10, 'time:20');
	timeLabel.fill = 'white';

	testObj1 = createGroup(4, 'test1');
	emtr1 = game.add.emitter(0, 0, 300);
	emtr1.makeParticles('test1-frag');
	emtr1.gravity = 300;
	emtr1.setYSpeed(-400, 400);

	testObj2 = createGroup(4, 'test2');
	emtr2 = game.add.emitter(0, 0, 300);
	emtr2.makeParticles('test2-frag');
	emtr2.gravity = 300;
	emtr2.setYSpeed(-400, 400);

	gameTime = game.time.create(false);
	//倒计时
	isActive = false;
	countDownSpr = game.add.sprite(w / 2 - 80, h / 2, '1');
	countDownTime = game.time.create();
	countDownTime.loop(Phaser.Timer.SECOND, countDownFunc, this);
	countDown = 1;
	countDownTime.start();
}
var countDown;
function countDownFunc() {
	countDown++;
	countDownSpr.loadTexture(countDown);
	if (countDown == 4)
		countDownSpr.x = w / 2 - 200;
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
	if (game.time.now > nextFire && testObj1.countDead() > 0 && testObj2.countDead() > 0) {
		nextFire = game.time.now + fireRate;
		throwGoodObject();
		if (Math.random() > eggRate) {
			throwBadObject();
		}
	}
}

function throwGoodObject() {
	var obj = testObj1.getFirstDead();
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
		timeLabel.text = 'time:' + Math.round(gameTime.duration / Phaser.Timer.SECOND);
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
			testObj1.forEachExists(checkIntersects);
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
	if (fruit.key === 'test1') {
		emtr1.x = fruit.x;
		emtr1.y = fruit.y;
		score += 2;
		emtr1.start(true, 2000, null, 2);
	} else if (fruit.key === 'test2') {
		emtr2.x = fruit.x;
		emtr2.y = fruit.y;
		//score -= 5;现在主要是俩图片长的太像了，就没直接改
		emtr2.start(true, 2000, null, 2);
	}

	fruit.kill();
	points = [];

	scoreLabel.text = score + '分';
}
//得分面板
function scoreStatePreload() {
	game.load.image('restartButton', 'img/restartButton.png');
	game.load.image('shareButton', 'img/shareButton.png');
	game.load.image('win', 'img/win.png');
	game.load.image('lose', 'img/lose.png');
}

function scoreStateCreate() {
	game.stage.backgroundColor = '#182d3b';

	var preLabel = game.add.text(game.world.centerX - 110, 100, '游戏结束' + '\n得分:' + score, { font: "45px" });
	preLabel.fill = 'white';

	if (score >= 100)
		game.add.sprite(w / 2 - 200, 250, 'win');
	else
		game.add.sprite(w / 2 - 200, 250, 'lose');

	game.add.button(game.world.centerX - 195, 600, 'restartButton', onRestartClick, this, 2, 1, 0);
	game.add.button(game.world.centerX + 95, 600, 'shareButton', onShareButtonClick, this, 2, 1, 0);

	console.info(score)
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